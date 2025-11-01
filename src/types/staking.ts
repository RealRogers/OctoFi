/**
 * Staking Type Definitions
 * Core types for the OctoFi staking functionality
 */

// Note: ethers v6 uses native bigint instead of BigNumber

// ============================================================================
// Core Staking Types
// ============================================================================

/**
 * Represents a staking pool where users can stake tokens
 */
export interface StakingPool {
  id: string
  address: string
  name: string
  symbol: string
  tokenAddress: string
  apy: number
  apyPredicted?: number // AI prediction
  tvl: number
  totalStakers: number
  minStake: string
  maxStake?: string
  lockPeriod: number // in seconds
  entryFee: number // percentage (0-100)
  exitFee: number // percentage (0-100)
  performanceFee: number // percentage (0-100)
  rewardToken: string
  isActive: boolean
  createdAt: Date
  logoUrl: string
}

/**
 * Represents a user's staking position in a pool
 */
export interface StakingPosition {
  id: string
  poolId: string
  pool: StakingPool
  userAddress: string
  stakedAmount: string
  stakedAmountUSD: number
  rewardsEarned: string
  rewardsEarnedUSD: number
  apy: number
  stakedAt: Date
  unlocksAt: Date
  isLocked: boolean
  canWithdraw: boolean
  canClaim: boolean
}

/**
 * Represents a staking transaction (stake, withdraw, claim)
 */
export interface StakingTransaction {
  id: string
  hash: string
  type: 'stake' | 'withdraw' | 'claim'
  poolId: string
  poolName: string
  amount: string
  amountUSD: number
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: Date
  gasUsed?: string
  error?: string
}

/**
 * Aggregated statistics for user's staking activity
 */
export interface StakingStats {
  totalStakedUSD: number
  totalRewardsUSD: number
  averageAPY: number
  activePositions: number
  totalTransactions: number
}

/**
 * Token balance information
 */
export interface TokenBalance {
  address: string
  symbol: string
  balance: string
  balanceFormatted: string
  balanceUSD: number
}

// ============================================================================
// Blockchain Types
// ============================================================================

/**
 * Smart contract ABI types for staking pool
 */
export interface IStakingPoolContract {
  // View functions
  balanceOf(account: string): Promise<bigint>
  earned(account: string): Promise<bigint>
  totalSupply(): Promise<bigint>
  rewardRate(): Promise<bigint>
  lockDuration(): Promise<bigint>
  unlockTime(account: string): Promise<bigint>
  
  // State-changing functions
  stake(amount: bigint): Promise<any>
  withdraw(amount: bigint): Promise<any>
  getReward(): Promise<any>
  exit(): Promise<any>
}

/**
 * ERC20 token contract interface
 */
export interface IERC20Contract {
  balanceOf(account: string): Promise<bigint>
  allowance(owner: string, spender: string): Promise<bigint>
  approve(spender: string, amount: bigint): Promise<any>
  transfer(to: string, amount: bigint): Promise<any>
}

/**
 * Transaction request for ethers.js
 */
export interface TransactionRequest {
  from?: string
  to: string
  value?: string
  data?: string
  gasLimit?: string
  gasPrice?: string
  nonce?: number
}

/**
 * Transaction response from blockchain
 */
export interface TransactionResponse {
  hash: string
  from: string
  to: string
  value: bigint
  gasLimit: bigint
  gasPrice: bigint
  nonce: number
  wait(confirmations?: number): Promise<TransactionReceipt>
}

/**
 * Transaction receipt after confirmation
 */
export interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  blockHash: string
  from: string
  to: string
  gasUsed: bigint
  status: number
}

// ============================================================================
// AI Prediction Types
// ============================================================================

/**
 * AI-generated APY prediction for a pool
 */
export interface APYPrediction {
  predicted: number
  confidence: number // 0-100
  timeframe: string // e.g., "30 days"
  factors: string[]
  isAIGenerated: boolean
}

/**
 * Market sentiment analysis
 */
export interface SentimentAnalysis {
  score: number // -1 to 1
  label: 'bearish' | 'neutral' | 'bullish'
  sources: string[]
}

/**
 * Risk assessment for a pool
 */
export interface RiskAssessment {
  score: number // 0-100
  level: 'low' | 'medium' | 'high'
  factors: {
    volatility: number
    liquidity: number
    smartContract: number
  }
}

// ============================================================================
// Filter and Sort Types
// ============================================================================

/**
 * Filters for pool list
 */
export interface PoolFilters {
  search: string
  minAPY: number
  maxAPY: number
  minTVL: number
  lockPeriod: 'all' | 'none' | '7d' | '30d' | '90d'
  showAIPredictions: boolean
}

/**
 * Sort options for pools
 */
export type PoolSortBy = 'apy' | 'tvl' | 'name' | 'created'

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc'

// ============================================================================
// Historical Data Types
// ============================================================================

/**
 * Historical APY data point
 */
export interface APYDataPoint {
  date: Date
  apy: number
}

/**
 * Pool statistics
 */
export interface PoolStats {
  totalStakers: number
  averageStake: string
  totalRewardsDistributed: string
  uptimePercentage: number
}

/**
 * Reward event from history
 */
export interface RewardEvent {
  timestamp: Date
  amount: string
  amountUSD: number
  transactionHash: string
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error codes for staking operations
 */
export enum StakingErrorCode {
  // Wallet errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WRONG_NETWORK = 'WRONG_NETWORK',
  
  // Balance errors
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_ALLOWANCE = 'INSUFFICIENT_ALLOWANCE',
  
  // Pool errors
  POOL_NOT_FOUND = 'POOL_NOT_FOUND',
  POOL_INACTIVE = 'POOL_INACTIVE',
  POOL_FULL = 'POOL_FULL',
  
  // Position errors
  POSITION_NOT_FOUND = 'POSITION_NOT_FOUND',
  POSITION_LOCKED = 'POSITION_LOCKED',
  NO_REWARDS = 'NO_REWARDS',
  
  // Transaction errors
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  
  // Validation errors
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  AMOUNT_TOO_LOW = 'AMOUNT_TOO_LOW',
  AMOUNT_TOO_HIGH = 'AMOUNT_TOO_HIGH',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Custom error class for staking operations
 */
export class StakingError extends Error {
  constructor(
    message: string,
    public code: StakingErrorCode,
    public details?: any,
    public recoverable: boolean = true
  ) {
    super(message)
    this.name = 'StakingError'
  }
}

// ============================================================================
// Network Configuration Types
// ============================================================================

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

/**
 * Token information
 */
export interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
}

// ============================================================================
// Cache Types
// ============================================================================

/**
 * Cached data with timestamp
 */
export interface CachedData<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// ============================================================================
// Hook Options Types
// ============================================================================

/**
 * Options for useStakingPools hook
 */
export interface UseStakingPoolsOptions {
  enabled?: boolean
  refetchInterval?: number
}

/**
 * Options for useStakingPositions hook
 */
export interface UseStakingPositionsOptions {
  enabled?: boolean
  refetchInterval?: number
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * Stake form data
 */
export interface StakeFormData {
  amount: string
}

/**
 * Withdraw form data
 */
export interface WithdrawFormData {
  amount: string
}

/**
 * Calculator form data
 */
export interface CalculatorFormData {
  poolId: string
  amount: string
  days: number
}
