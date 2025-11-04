import { describe, it, expect, vi, beforeEach } from 'vitest'
import { stakingService } from './stakingService'
import { blockchainService } from './blockchainService'
import { StakingError, StakingErrorCode } from '@/types/staking'

// Mock the blockchain service
vi.mock('./blockchainService', () => ({
  blockchainService: {
    getProvider: vi.fn(),
    getSigner: vi.fn(),
    estimateGas: vi.fn(),
    waitForTransaction: vi.fn()
  }
}))

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    Contract: vi.fn(),
    parseUnits: vi.fn((value: string) => BigInt(value + '000000000000000000')),
    formatUnits: vi.fn((value: bigint) => (Number(value) / 1e18).toString()),
    providers: {
      TransactionResponse: vi.fn()
    }
  }
}))

describe('StakingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mock Data Mode', () => {
    it('should return mock pools when useMockData is true', async () => {
      const pools = await stakingService.getAllPools()
      
      expect(pools).toHaveLength(3)
      expect(pools[0].symbol).toBe('USDC')
      expect(pools[1].symbol).toBe('USDT')
      expect(pools[2].symbol).toBe('ARB')
    })

    it('should return specific pool by address', async () => {
      const pools = await stakingService.getAllPools()
      const usdcPool = await stakingService.getPool(pools[0].address)
      
      expect(usdcPool.symbol).toBe('USDC')
      expect(usdcPool.apy).toBe(12.5)
      expect(usdcPool.tvl).toBe(1250000)
    })

    it('should throw error for non-existent pool', async () => {
      await expect(stakingService.getPool('0xinvalid'))
        .rejects
        .toThrow('Pool not found')
    })

    it('should return mock user positions', async () => {
      const userAddress = '0x123'
      const positions = await stakingService.getUserPositions(userAddress)
      
      expect(positions).toHaveLength(2)
      expect(positions[0].stakedAmount).toBe('1000.00')
      expect(positions[1].stakedAmount).toBe('500.00')
    })

    it('should calculate pool APY correctly', async () => {
      const pools = await stakingService.getAllPools()
      const apy = await stakingService.getPoolAPY(pools[0].address)
      
      expect(apy).toBe(12.5)
    })

    it('should calculate pool TVL correctly', async () => {
      const pools = await stakingService.getAllPools()
      const tvl = await stakingService.getPoolTVL(pools[0].address)
      
      expect(tvl).toBe(1250000)
    })
  })

  describe('Error Handling', () => {
    it('should handle user rejection error', () => {
      const error = { code: 4001 }
      const stakingError = (stakingService as any).handleError(error)
      
      expect(stakingError).toBeInstanceOf(StakingError)
      expect(stakingError.code).toBe(StakingErrorCode.TRANSACTION_REJECTED)
      expect(stakingError.message).toBe('Transaction rejected by user')
      expect(stakingError.retryable).toBe(false)
    })

    it('should handle insufficient funds error', () => {
      const error = { code: 'INSUFFICIENT_FUNDS' }
      const stakingError = (stakingService as any).handleError(error)
      
      expect(stakingError.code).toBe(StakingErrorCode.INSUFFICIENT_BALANCE)
      expect(stakingError.retryable).toBe(false)
    })

    it('should handle network error', () => {
      const error = { code: 'NETWORK_ERROR' }
      const stakingError = (stakingService as any).handleError(error)
      
      expect(stakingError.code).toBe(StakingErrorCode.NETWORK_ERROR)
      expect(stakingError.retryable).toBe(true)
    })

    it('should handle contract error with reason', () => {
      const error = { reason: 'Insufficient balance' }
      const stakingError = (stakingService as any).handleError(error)
      
      expect(stakingError.code).toBe(StakingErrorCode.TRANSACTION_FAILED)
      expect(stakingError.message).toBe('Insufficient balance')
    })

    it('should handle unknown error', () => {
      const error = new Error('Unknown error')
      const stakingError = (stakingService as any).handleError(error)
      
      expect(stakingError.code).toBe(StakingErrorCode.UNKNOWN_ERROR)
      expect(stakingError.retryable).toBe(true)
    })

    it('should pass through existing StakingError', () => {
      const originalError = new StakingError('Test error', StakingErrorCode.WALLET_NOT_CONNECTED)
      const stakingError = (stakingService as any).handleError(originalError)
      
      expect(stakingError).toBe(originalError)
    })
  })

  describe('Real Contract Mode', () => {
    beforeEach(() => {
      // Set to real contract mode for these tests
      ;(stakingService as any).useMockData = false
    })

    afterEach(() => {
      // Reset to mock mode
      ;(stakingService as any).useMockData = true
    })

    it('should throw error when provider not available', async () => {
      vi.mocked(blockchainService.getProvider).mockReturnValue(null)
      
      await expect(stakingService.getPool('0x123'))
        .rejects
        .toThrow('Provider not initialized')
    })

    it('should throw error when signer not available for transactions', async () => {
      vi.mocked(blockchainService.getSigner).mockReturnValue(null)
      
      await expect(stakingService.stake('0x123', '100'))
        .rejects
        .toThrow('Wallet not connected')
    })
  })

  describe('Utility Functions', () => {
    it('should calculate APY from reward rate correctly', () => {
      const rewardRate = BigInt('1000000000000000000') // 1 token per second
      const totalSupply = BigInt('31536000000000000000000000') // 31.536M tokens (1 year worth)
      
      const apy = (stakingService as any).calculateAPYFromRewardRate(rewardRate, totalSupply)
      
      // Should be approximately 100% APY
      expect(apy).toBeCloseTo(100, 0)
    })

    it('should return 0 APY when total supply is 0', () => {
      const rewardRate = BigInt('1000000000000000000')
      const totalSupply = BigInt('0')
      
      const apy = (stakingService as any).calculateAPYFromRewardRate(rewardRate, totalSupply)
      
      expect(apy).toBe(0)
    })

    it('should handle calculation errors gracefully', () => {
      // Test with invalid values that might cause errors
      const apy = (stakingService as any).calculateAPYFromRewardRate(null, BigInt('1000'))
      
      expect(apy).toBe(0)
    })
  })

  describe('Gas Estimation', () => {
    it('should estimate gas correctly', async () => {
      const mockGas = BigInt('21000')
      vi.mocked(blockchainService.estimateGas).mockResolvedValue(mockGas)
      
      const transaction = { to: '0x123', data: '0x' }
      const gas = await stakingService.estimateGas(transaction)
      
      expect(gas).toBe(mockGas)
      expect(blockchainService.estimateGas).toHaveBeenCalledWith(transaction)
    })

    it('should handle gas estimation errors', async () => {
      vi.mocked(blockchainService.estimateGas).mockRejectedValue(new Error('Gas estimation failed'))
      
      const transaction = { to: '0x123', data: '0x' }
      
      await expect(stakingService.estimateGas(transaction))
        .rejects
        .toThrow('Failed to estimate gas')
    })
  })

  describe('Transaction Waiting', () => {
    it('should wait for transaction correctly', async () => {
      const mockReceipt = { status: 1, blockNumber: 123 }
      vi.mocked(blockchainService.waitForTransaction).mockResolvedValue(mockReceipt)
      
      const receipt = await stakingService.waitForTransaction('0x123', 1)
      
      expect(receipt).toBe(mockReceipt)
      expect(blockchainService.waitForTransaction).toHaveBeenCalledWith('0x123', 1)
    })

    it('should handle transaction waiting errors', async () => {
      vi.mocked(blockchainService.waitForTransaction).mockRejectedValue(new Error('Transaction failed'))
      
      await expect(stakingService.waitForTransaction('0x123'))
        .rejects
        .toBeInstanceOf(StakingError)
    })
  })
})