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
  chainId: 997,
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Test Token',
    symbol: 'STT',
    decimals: 18
  },
  rpcUrls: ['https://testnet.rpc.somnia.network'],
  blockExplorerUrls: ['https://testnet.explorer.somnia.network']
}

// ============================================================================
// Contract Addresses (Mock - Replace with actual deployed contracts)
// ============================================================================

/**
 * Staking pool contract addresses on Somnia Testnet
 * TODO: Replace with actual deployed contract addresses
 */
export const STAKING_POOLS = {
  USDC: {
    address: '0x1234567890123456789012345678901234567890',
    token: '0x0987654321098765432109876543210987654321',
    name: 'USDC Staking Pool',
    symbol: 'USDC'
  },
  USDT: {
    address: '0x2345678901234567890123456789012345678901',
    token: '0x1987654321098765432109876543210987654321',
    name: 'USDT Staking Pool',
    symbol: 'USDT'
  },
  ARB: {
    address: '0x3456789012345678901234567890123456789012',
    token: '0x2987654321098765432109876543210987654321',
    name: 'ARB Staking Pool',
    symbol: 'ARB'
  }
} as const

/**
 * Token contract addresses on Somnia Testnet
 * TODO: Replace with actual token addresses
 */
export const TOKEN_ADDRESSES = {
  USDC: '0x0987654321098765432109876543210987654321',
  USDT: '0x1987654321098765432109876543210987654321',
  ARB: '0x2987654321098765432109876543210987654321'
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
  VERTEX_AI: process.env.VITE_VERTEX_AI_ENDPOINT || '',
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
