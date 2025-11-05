/**
 * Staking Constants
 * Configuration constants for the staking functionality
 */

import { NetworkConfig } from '@/types/staking'

// ============================================================================
// Network Configuration
// ============================================================================

/**
 * Somnia Testnet configuration
 */
export const SOMNIA_TESTNET: NetworkConfig = {
  chainId: 50312,
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Test Token',
    symbol: 'STT',
    decimals: 18
  },
  rpcUrls: ['https://dream-rpc.somnia.network'],
  blockExplorerUrls: ['https://explorer.somnia.network']
}

// ============================================================================
// Contract Addresses (Deployed on Somnia Testnet)
// ============================================================================

/**
 * Staking pool contract addresses on Somnia Testnet
 * Using environment variables for deployed contract addresses
 */
export const STAKING_POOLS = {
  USDC: {
    address: import.meta.env.VITE_USDC_POOL_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    token: import.meta.env.VITE_USDC_ADDRESS || '0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB',
    name: 'USDC Staking Pool',
    symbol: 'USDC'
  },
  USDT: {
    address: import.meta.env.VITE_USDT_POOL_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    token: import.meta.env.VITE_USDT_ADDRESS || '0xa233487B7FB5941Dd81A28A4A547519760BFE89e',
    name: 'USDT Staking Pool',
    symbol: 'USDT'
  },
  ARB: {
    address: import.meta.env.VITE_ARB_POOL_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    token: import.meta.env.VITE_ARB_ADDRESS || '0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030',
    name: 'ARB Staking Pool',
    symbol: 'ARB'
  }
} as const

/**
 * Token contract addresses on Somnia Testnet
 * Using environment variables for deployed token addresses
 */
export const TOKEN_ADDRESSES = {
  USDC: import.meta.env.VITE_USDC_ADDRESS || '0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB',
  USDT: import.meta.env.VITE_USDT_ADDRESS || '0xa233487B7FB5941Dd81A28A4A547519760BFE89e',
  ARB: import.meta.env.VITE_ARB_ADDRESS || '0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030'
} as const

// ============================================================================
// Query Configuration
// ============================================================================

/**
 * Stale time configuration for TanStack Query
 * Determines how long data is considered fresh
 */
export const QUERY_STALE_TIME = {
  POOLS: 30000, // 30 seconds
  POSITIONS: 10000, // 10 seconds
  BALANCE: 5000, // 5 seconds
  TRANSACTIONS: 60000, // 1 minute
  PREDICTIONS: 300000 // 5 minutes
} as const

/**
 * Refetch interval configuration for TanStack Query
 * Determines how often to automatically refetch data
 */
export const QUERY_REFETCH_INTERVAL = {
  POOLS: 60000, // 1 minute
  POSITIONS: 30000, // 30 seconds
  BALANCE: 15000, // 15 seconds
  REWARDS: 10000 // 10 seconds
} as const

// ============================================================================
// UI Configuration
// ============================================================================

/**
 * UI-related constants
 */
export const UI_CONFIG = {
  SKELETON_COUNT: 3,
  TRANSACTIONS_PER_PAGE: 10,
  CHART_PERIODS: [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 }
  ],
  DEFAULT_SLIPPAGE: 0.5, // 0.5%
  MAX_SLIPPAGE: 5, // 5%
  MIN_TOUCH_TARGET: 44 // 44px minimum for accessibility
} as const

// ============================================================================
// Validation Limits
// ============================================================================

/**
 * Validation limits for staking operations
 */
export const VALIDATION_LIMITS = {
  MIN_STAKE_USD: 10,
  MAX_STAKE_USD: 1000000,
  MIN_WITHDRAW_USD: 1,
  GAS_LIMIT_BUFFER: 1.2 // 20% buffer for gas estimation
} as const

// ============================================================================
// Error Messages
// ============================================================================

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  WRONG_NETWORK: 'Please switch to Somnia Testnet',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',
  POSITION_LOCKED: 'Your position is still locked and cannot be withdrawn',
  POOL_NOT_FOUND: 'Pool not found',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again'
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  STAKE_SUCCESS: 'Successfully staked tokens',
  WITHDRAW_SUCCESS: 'Successfully withdrawn tokens',
  CLAIM_SUCCESS: 'Successfully claimed rewards',
  APPROVE_SUCCESS: 'Token approval successful'
} as const

// ============================================================================
// Transaction Configuration
// ============================================================================

/**
 * Transaction-related constants
 */
export const TRANSACTION_CONFIG = {
  DEFAULT_GAS_LIMIT: '200000',
  APPROVAL_AMOUNT: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', // Max uint256
  CONFIRMATIONS_REQUIRED: 1,
  TIMEOUT_MS: 120000 // 2 minutes
} as const

// ============================================================================
// APY and Rewards Configuration
// ============================================================================

/**
 * APY and rewards calculation constants
 */
export const REWARDS_CONFIG = {
  DAYS_PER_YEAR: 365,
  SECONDS_PER_YEAR: 365 * 24 * 60 * 60,
  DEFAULT_CALCULATOR_DAYS: 30,
  MIN_CALCULATOR_DAYS: 1,
  MAX_CALCULATOR_DAYS: 365
} as const

// ============================================================================
// Lock Period Options
// ============================================================================

/**
 * Lock period options for filtering
 */
export const LOCK_PERIOD_OPTIONS = [
  { value: 'all', label: 'All Lock Periods' },
  { value: 'none', label: 'No Lock' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' }
] as const

// ============================================================================
// Chart Configuration
// ============================================================================

/**
 * Chart colors for multiple positions
 */
export const CHART_COLORS = [
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316'  // orange
] as const

// ============================================================================
// API Configuration
// ============================================================================

/**
 * External API endpoints
 * TODO: Configure actual API endpoints
 */
export const API_ENDPOINTS = {
  DIA_ORACLE: 'https://api.diadata.org',
  VERTEX_AI: '', // TODO: Configure Vertex AI endpoint
} as const

// ============================================================================
// Feature Flags
// ============================================================================

/**
 * Feature flags for enabling/disabling features
 */
export const FEATURE_FLAGS = {
  ENABLE_AI_PREDICTIONS: true,
  ENABLE_REWARDS_CALCULATOR: true,
  ENABLE_YIELD_CHART: true,
  ENABLE_TRANSACTION_HISTORY: true,
  ENABLE_POOL_FILTERS: true
} as const

// ============================================================================
// Local Storage Keys
// ============================================================================

/**
 * Keys for local storage
 */
export const STORAGE_KEYS = {
  POOL_FILTERS: 'octofi_pool_filters',
  POOL_SORT: 'octofi_pool_sort',
  CHART_PERIOD: 'octofi_chart_period',
  SLIPPAGE_TOLERANCE: 'octofi_slippage_tolerance'
} as const
