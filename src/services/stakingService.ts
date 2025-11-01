/**
 * Staking Service
 * Core service for staking contract interactions
 */

import { ethers } from 'ethers'
import { 
  StakingPool, 
  StakingPosition, 
  StakingError, 
  StakingErrorCode,
  TransactionResponse as StakingTransactionResponse
} from '@/types/staking'
import { blockchainService } from './blockchainService'
import { STAKING_POOLS, TRANSACTION_CONFIG } from '@/lib/stakingConstants'
import { formatTokenAmount } from '@/lib/stakingUtils'

/**
 * Staking Pool Contract ABI (simplified)
 */
const STAKING_POOL_ABI = [
  // View functions
  'function balanceOf(address account) view returns (uint256)',
  'function earned(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function rewardRate() view returns (uint256)',
  'function lockDuration() view returns (uint256)',
  'function unlockTime(address account) view returns (uint256)',
  'function stakingToken() view returns (address)',
  'function rewardToken() view returns (address)',
  
  // State-changing functions
  'function stake(uint256 amount)',
  'function withdraw(uint256 amount)',
  'function getReward()',
  'function exit()'
]

/**
 * ERC20 Token ABI (simplified)
 */
const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
]

/**
 * Staking Service Class
 */
class StakingService {
  private useMockData = true // Set to false when contracts are deployed
  
  // ==========================================================================
  // Mock Data
  // ==========================================================================
  
  private getMockPools(): StakingPool[] {
    return [
      {
        id: '1',
        address: STAKING_POOLS.USDC.address,
        name: 'USDC Staking',
        symbol: 'USDC',
        tokenAddress: '0x0987654321098765432109876543210987654321',
        apy: 12.5,
        tvl: 1250000,
        totalStakers: 342,
        minStake: '10',
        lockPeriod: 0,
        entryFee: 0,
        exitFee: 0,
        performanceFee: 0,
        rewardToken: '0x0987654321098765432109876543210987654321',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        logoUrl: '/placeholder.svg'
      },
      {
        id: '2',
        address: STAKING_POOLS.USDT.address,
        name: 'USDT Staking',
        symbol: 'USDT',
        tokenAddress: '0x1987654321098765432109876543210987654321',
        apy: 15.8,
        tvl: 890000,
        totalStakers: 256,
        minStake: '10',
        lockPeriod: 2592000, // 30 days
        entryFee: 0,
        exitFee: 0,
        performanceFee: 0,
        rewardToken: '0x1987654321098765432109876543210987654321',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        logoUrl: '/placeholder.svg'
      },
      {
        id: '3',
        address: STAKING_POOLS.ARB.address,
        name: 'ARB Staking',
        symbol: 'ARB',
        tokenAddress: '0x2987654321098765432109876543210987654321',
        apy: 22.3,
        tvl: 450000,
        totalStakers: 189,
        minStake: '5',
        lockPeriod: 7776000, // 90 days
        entryFee: 0,
        exitFee: 0,
        performanceFee: 0,
        rewardToken: '0x2987654321098765432109876543210987654321',
        isActive: true,
        createdAt: new Date('2024-02-01'),
        logoUrl: '/placeholder.svg'
      }
    ]
  }
  
  private getMockPositions(userAddress: string): StakingPosition[] {
    const pools = this.getMockPools()
    return [
      {
        id: `${pools[0].address}-${userAddress}`,
        poolId: pools[0].address,
        pool: pools[0],
        userAddress,
        stakedAmount: '1000.00',
        stakedAmountUSD: 1000,
        rewardsEarned: '12.50',
        rewardsEarnedUSD: 12.50,
        apy: pools[0].apy,
        stakedAt: new Date('2024-10-01'),
        unlocksAt: new Date('2024-10-01'),
        isLocked: false,
        canWithdraw: true,
        canClaim: true
      },
      {
        id: `${pools[1].address}-${userAddress}`,
        poolId: pools[1].address,
        pool: pools[1],
        userAddress,
        stakedAmount: '500.00',
        stakedAmountUSD: 500,
        rewardsEarned: '8.25',
        rewardsEarnedUSD: 8.25,
        apy: pools[1].apy,
        stakedAt: new Date('2024-10-15'),
        unlocksAt: new Date('2024-11-15'),
        isLocked: true,
        canWithdraw: false,
        canClaim: true
      }
    ]
  }
  
  // ==========================================================================
  // Pool Queries
  // ==========================================================================

  /**
   * Get pool information
   * @param poolAddress - Pool contract address
   * @returns Pool information
   */
  async getPool(poolAddress: string): Promise<StakingPool> {
    // Use mock data if enabled
    if (this.useMockData) {
      const mockPools = this.getMockPools()
      const pool = mockPools.find(p => p.address === poolAddress)
      if (pool) return pool
      throw new StakingError('Pool not found', StakingErrorCode.UNKNOWN_ERROR)
    }
    
    try {
      const provider = blockchainService.getProvider()
      if (!provider) {
        throw new StakingError(
          'Provider not initialized',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const poolContract = new ethers.Contract(poolAddress, STAKING_POOL_ABI, provider)

      // Get basic pool data
      const [totalSupply, rewardRate, lockDuration, stakingTokenAddress, rewardTokenAddress] = 
        await Promise.all([
          poolContract.totalSupply(),
          poolContract.rewardRate(),
          poolContract.lockDuration(),
          poolContract.stakingToken(),
          poolContract.rewardToken()
        ])

      // Get token info
      const tokenContract = new ethers.Contract(stakingTokenAddress, ERC20_ABI, provider)
      const [symbol, name, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.name(),
        tokenContract.decimals()
      ])

      // Calculate APY (simplified - would need price data in production)
      const apy = this.calculateAPYFromRewardRate(rewardRate, totalSupply)

      // Find pool config
      const poolConfig = Object.values(STAKING_POOLS).find(p => p.address === poolAddress)

      return {
        id: poolAddress,
        address: poolAddress,
        name: poolConfig?.name || name,
        symbol: poolConfig?.symbol || symbol,
        tokenAddress: stakingTokenAddress,
        apy,
        tvl: parseFloat(ethers.formatUnits(totalSupply, decimals)),
        totalStakers: 0, // Would need to track this separately
        minStake: '0.01', // Would come from contract
        lockPeriod: lockDuration.toNumber(),
        entryFee: 0,
        exitFee: 0,
        performanceFee: 0,
        rewardToken: rewardTokenAddress,
        isActive: true,
        createdAt: new Date(),
        logoUrl: '/placeholder.svg'
      }
    } catch (error: any) {
      console.error('Error getting pool:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get all available pools
   * @returns Array of pools
   */
  async getAllPools(): Promise<StakingPool[]> {
    // Use mock data if enabled
    if (this.useMockData) {
      return this.getMockPools()
    }
    
    try {
      const poolAddresses = Object.values(STAKING_POOLS).map(p => p.address)
      const pools = await Promise.all(
        poolAddresses.map(address => this.getPool(address))
      )
      return pools
    } catch (error: any) {
      console.error('Error getting all pools:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get pool APY
   * @param poolAddress - Pool contract address
   * @returns APY as percentage
   */
  async getPoolAPY(poolAddress: string): Promise<number> {
    try {
      const pool = await this.getPool(poolAddress)
      return pool.apy
    } catch (error: any) {
      console.error('Error getting pool APY:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get pool TVL
   * @param poolAddress - Pool contract address
   * @returns TVL in tokens
   */
  async getPoolTVL(poolAddress: string): Promise<number> {
    try {
      const pool = await this.getPool(poolAddress)
      return pool.tvl
    } catch (error: any) {
      console.error('Error getting pool TVL:', error)
      throw this.handleError(error)
    }
  }

  // ==========================================================================
  // User Position Queries
  // ==========================================================================

  /**
   * Get user's position in a specific pool
   * @param poolAddress - Pool contract address
   * @param userAddress - User's wallet address
   * @returns User's position
   */
  async getUserPosition(poolAddress: string, userAddress: string): Promise<StakingPosition> {
    try {
      const provider = blockchainService.getProvider()
      if (!provider) {
        throw new StakingError(
          'Provider not initialized',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const poolContract = new ethers.Contract(poolAddress, STAKING_POOL_ABI, provider)
      const pool = await this.getPool(poolAddress)

      // Get user's staking data
      const [stakedAmount, rewardsEarned, unlockTime] = await Promise.all([
        poolContract.balanceOf(userAddress),
        poolContract.earned(userAddress),
        poolContract.unlockTime(userAddress)
      ])

      const stakedAmountFormatted = formatTokenAmount(stakedAmount, 18, 6)
      const rewardsEarnedFormatted = formatTokenAmount(rewardsEarned, 18, 6)

      const unlocksAt = new Date(unlockTime.toNumber() * 1000)
      const isLocked = new Date() < unlocksAt

      return {
        id: `${poolAddress}-${userAddress}`,
        poolId: poolAddress,
        pool,
        userAddress,
        stakedAmount: stakedAmountFormatted,
        stakedAmountUSD: 0, // Would need price data
        rewardsEarned: rewardsEarnedFormatted,
        rewardsEarnedUSD: 0, // Would need price data
        apy: pool.apy,
        stakedAt: new Date(), // Would need to track this
        unlocksAt,
        isLocked,
        canWithdraw: !isLocked && parseFloat(stakedAmountFormatted) > 0,
        canClaim: parseFloat(rewardsEarnedFormatted) > 0
      }
    } catch (error: any) {
      console.error('Error getting user position:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get all user positions across all pools
   * @param userAddress - User's wallet address
   * @returns Array of user positions
   */
  async getUserPositions(userAddress: string): Promise<StakingPosition[]> {
    // Use mock data if enabled
    if (this.useMockData) {
      return this.getMockPositions(userAddress)
    }
    
    try {
      const poolAddresses = Object.values(STAKING_POOLS).map(p => p.address)
      const positions = await Promise.all(
        poolAddresses.map(address => this.getUserPosition(address, userAddress))
      )
      
      // Filter out positions with no stake
      return positions.filter(pos => parseFloat(pos.stakedAmount) > 0)
    } catch (error: any) {
      console.error('Error getting user positions:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get user's rewards in a specific pool
   * @param poolAddress - Pool contract address
   * @param userAddress - User's wallet address
   * @returns Rewards amount as string
   */
  async getUserRewards(poolAddress: string, userAddress: string): Promise<string> {
    try {
      const provider = blockchainService.getProvider()
      if (!provider) {
        throw new StakingError(
          'Provider not initialized',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const poolContract = new ethers.Contract(poolAddress, STAKING_POOL_ABI, provider)
      const rewards: bigint = await poolContract.earned(userAddress)
      
      return formatTokenAmount(rewards, 18, 6)
    } catch (error: any) {
      console.error('Error getting user rewards:', error)
      throw this.handleError(error)
    }
  }

  // ==========================================================================
  // Transactions
  // ==========================================================================

  /**
   * Approve token for staking
   * @param tokenAddress - Token contract address
   * @param spenderAddress - Spender (pool) contract address
   * @param amount - Amount to approve (defaults to max)
   * @returns Transaction response
   */
  async approveToken(
    tokenAddress: string,
    spenderAddress: string,
    amount: string = TRANSACTION_CONFIG.APPROVAL_AMOUNT
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      const signer = blockchainService.getSigner()
      if (!signer) {
        throw new StakingError(
          'Wallet not connected',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
      
      const tx = await tokenContract.approve(spenderAddress, amount)
      return tx
    } catch (error: any) {
      console.error('Error approving token:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Stake tokens in a pool
   * @param poolAddress - Pool contract address
   * @param amount - Amount to stake (in token units)
   * @returns Transaction response
   */
  async stake(poolAddress: string, amount: string): Promise<ethers.providers.TransactionResponse> {
    try {
      const signer = blockchainService.getSigner()
      if (!signer) {
        throw new StakingError(
          'Wallet not connected',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const poolContract = new ethers.Contract(poolAddress, STAKING_POOL_ABI, signer)
      
      // Convert amount to wei (assuming 18 decimals)
      const amountWei = ethers.parseUnits(amount, 18)
      
      const tx = await poolContract.stake(amountWei)
      return tx
    } catch (error: any) {
      console.error('Error staking:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Withdraw tokens from a pool
   * @param poolAddress - Pool contract address
   * @param amount - Amount to withdraw (in token units)
   * @returns Transaction response
   */
  async withdraw(poolAddress: string, amount: string): Promise<ethers.providers.TransactionResponse> {
    try {
      const signer = blockchainService.getSigner()
      if (!signer) {
        throw new StakingError(
          'Wallet not connected',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const poolContract = new ethers.Contract(poolAddress, STAKING_POOL_ABI, signer)
      
      // Convert amount to wei (assuming 18 decimals)
      const amountWei = ethers.parseUnits(amount, 18)
      
      const tx = await poolContract.withdraw(amountWei)
      return tx
    } catch (error: any) {
      console.error('Error withdrawing:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Claim rewards from a pool
   * @param poolAddress - Pool contract address
   * @returns Transaction response
   */
  async claimRewards(poolAddress: string): Promise<ethers.providers.TransactionResponse> {
    try {
      const signer = blockchainService.getSigner()
      if (!signer) {
        throw new StakingError(
          'Wallet not connected',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const poolContract = new ethers.Contract(poolAddress, STAKING_POOL_ABI, signer)
      
      const tx = await poolContract.getReward()
      return tx
    } catch (error: any) {
      console.error('Error claiming rewards:', error)
      throw this.handleError(error)
    }
  }

  // ==========================================================================
  // Utilities
  // ==========================================================================

  /**
   * Check token allowance
   * @param tokenAddress - Token contract address
   * @param ownerAddress - Owner's wallet address
   * @param spenderAddress - Spender (pool) contract address
   * @returns Allowance amount as string
   */
  async checkAllowance(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string
  ): Promise<string> {
    try {
      const provider = blockchainService.getProvider()
      if (!provider) {
        throw new StakingError(
          'Provider not initialized',
          StakingErrorCode.WALLET_NOT_CONNECTED
        )
      }

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const allowance: bigint = await tokenContract.allowance(ownerAddress, spenderAddress)
      
      return allowance.toString()
    } catch (error: any) {
      console.error('Error checking allowance:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Estimate gas for a transaction
   * @param transaction - Transaction request
   * @returns Estimated gas as BigNumber
   */
  async estimateGas(transaction: ethers.TransactionRequest): Promise<bigint> {
    try {
      return await blockchainService.estimateGas(transaction)
    } catch (error: any) {
      console.error('Error estimating gas:', error)
      throw new StakingError(
        'Failed to estimate gas',
        StakingErrorCode.GAS_ESTIMATION_FAILED,
        error
      )
    }
  }

  /**
   * Wait for transaction confirmation
   * @param txHash - Transaction hash
   * @param confirmations - Number of confirmations
   * @returns Transaction receipt
   */
  async waitForTransaction(txHash: string, confirmations: number = 1) {
    try {
      return await blockchainService.waitForTransaction(txHash, confirmations)
    } catch (error: any) {
      console.error('Error waiting for transaction:', error)
      throw this.handleError(error)
    }
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Calculate APY from reward rate (simplified)
   * @param rewardRate - Reward rate per second
   * @param totalSupply - Total staked supply
   * @returns APY as percentage
   */
  private calculateAPYFromRewardRate(rewardRate: bigint, totalSupply: bigint): number {
    try {
      if (totalSupply === 0n) return 0
      
      // Simplified calculation - in production would need token prices
      const rewardPerYear = rewardRate * BigInt(365 * 24 * 60 * 60)
      const apy = (rewardPerYear * 100n) / totalSupply
      
      return parseFloat(ethers.formatUnits(apy, 0))
    } catch (error) {
      console.error('Error calculating APY:', error)
      return 0
    }
  }

  /**
   * Handle and transform errors
   * @param error - Original error
   * @returns StakingError
   */
  private handleError(error: any): StakingError {
    // User rejected transaction
    if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      return new StakingError(
        'Transaction rejected by user',
        StakingErrorCode.TRANSACTION_REJECTED,
        error,
        false
      )
    }

    // Insufficient funds
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return new StakingError(
        'Insufficient balance for transaction',
        StakingErrorCode.INSUFFICIENT_BALANCE,
        error,
        false
      )
    }

    // Network error
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
      return new StakingError(
        'Network error. Please try again',
        StakingErrorCode.NETWORK_ERROR,
        error,
        true
      )
    }

    // Contract error with reason
    if (error.reason) {
      return new StakingError(
        error.reason,
        StakingErrorCode.TRANSACTION_FAILED,
        error,
        false
      )
    }

    // Already a StakingError
    if (error instanceof StakingError) {
      return error
    }

    // Unknown error
    return new StakingError(
      'An unexpected error occurred',
      StakingErrorCode.UNKNOWN_ERROR,
      error,
      true
    )
  }
}

// Export singleton instance
export const stakingService = new StakingService()
