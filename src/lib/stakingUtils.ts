/**
 * Staking Utility Functions
 * Helper functions for calculations, formatting, and common operations
 */

import { ethers } from 'ethers'
import { StakingPosition } from '@/types/staking'
import { REWARDS_CONFIG, SOMNIA_TESTNET } from './stakingConstants'

// ============================================================================
// Token Amount Formatting
// ============================================================================

/**
 * Format token amount from wei to human-readable format
 * @param amount - Amount in wei (string or BigNumber)
 * @param decimals - Token decimals
 * @param displayDecimals - Number of decimals to display
 * @returns Formatted amount as string
 */
export const formatTokenAmount = (
  amount: string | bigint,
  decimals: number,
  displayDecimals: number = 4
): string => {
  try {
    const formatted = ethers.formatUnits(amount, decimals)
    const num = parseFloat(formatted)
    
    // Handle very small numbers
    if (num < 0.0001 && num > 0) {
      return '< 0.0001'
    }
    
    return num.toFixed(displayDecimals)
  } catch (error) {
    console.error('Error formatting token amount:', error)
    return '0'
  }
}

/**
 * Parse token amount from human-readable to wei
 * @param amount - Amount as string
 * @param decimals - Token decimals
 * @returns Amount in wei as BigNumber
 */
export const parseTokenAmount = (
  amount: string,
  decimals: number
): bigint => {
  try {
    return ethers.parseUnits(amount, decimals)
  } catch (error) {
    console.error('Error parsing token amount:', error)
    return 0n
  }
}

// ============================================================================
// APY Calculations
// ============================================================================

/**
 * Calculate APY from reward rate and total supply
 * @param rewardRate - Reward rate per second
 * @param totalSupply - Total staked supply
 * @param rewardTokenPrice - Price of reward token in USD
 * @param stakedTokenPrice - Price of staked token in USD
 * @returns APY as percentage
 */
export const calculateAPY = (
  rewardRate: bigint,
  totalSupply: bigint,
  rewardTokenPrice: number,
  stakedTokenPrice: number
): number => {
  try {
    if (totalSupply === 0n) return 0
    
    const rewardPerYear = rewardRate * BigInt(REWARDS_CONFIG.SECONDS_PER_YEAR)
    const rewardValuePerYear = parseFloat(ethers.formatEther(rewardPerYear)) * rewardTokenPrice
    const totalStakedValue = parseFloat(ethers.formatEther(totalSupply)) * stakedTokenPrice
    
    if (totalStakedValue === 0) return 0
    
    return (rewardValuePerYear / totalStakedValue) * 100
  } catch (error) {
    console.error('Error calculating APY:', error)
    return 0
  }
}

// ============================================================================
// Rewards Calculations
// ============================================================================

/**
 * Calculate estimated rewards for a given amount and time period
 * @param stakedAmount - Amount to stake (as string)
 * @param apy - Annual percentage yield
 * @param days - Number of days
 * @returns Estimated rewards as string
 */
export const calculateRewards = (
  stakedAmount: string,
  apy: number,
  days: number
): string => {
  try {
    const amount = parseFloat(stakedAmount)
    if (isNaN(amount) || amount <= 0) return '0'
    
    const rewards = amount * (apy / 100) * (days / REWARDS_CONFIG.DAYS_PER_YEAR)
    return rewards.toFixed(6)
  } catch (error) {
    console.error('Error calculating rewards:', error)
    return '0'
  }
}

/**
 * Calculate daily rewards
 * @param stakedAmount - Amount staked
 * @param apy - Annual percentage yield
 * @returns Daily rewards as string
 */
export const calculateDailyRewards = (
  stakedAmount: string,
  apy: number
): string => {
  return calculateRewards(stakedAmount, apy, 1)
}

/**
 * Calculate monthly rewards
 * @param stakedAmount - Amount staked
 * @param apy - Annual percentage yield
 * @returns Monthly rewards as string
 */
export const calculateMonthlyRewards = (
  stakedAmount: string,
  apy: number
): string => {
  return calculateRewards(stakedAmount, apy, 30)
}

/**
 * Calculate yearly rewards
 * @param stakedAmount - Amount staked
 * @param apy - Annual percentage yield
 * @returns Yearly rewards as string
 */
export const calculateYearlyRewards = (
  stakedAmount: string,
  apy: number
): string => {
  return calculateRewards(stakedAmount, apy, 365)
}

// ============================================================================
// Time Calculations
// ============================================================================

/**
 * Calculate time remaining until unlock
 * @param unlockTime - Unlock timestamp
 * @returns Human-readable time remaining
 */
export const calculateTimeRemaining = (unlockTime: Date): string => {
  const now = new Date()
  const diff = unlockTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'Unlocked'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

/**
 * Check if a position is currently locked
 * @param position - Staking position
 * @returns True if locked, false otherwise
 */
export const isPositionLocked = (position: StakingPosition): boolean => {
  return new Date() < position.unlocksAt
}

/**
 * Get lock period in human-readable format
 * @param seconds - Lock period in seconds
 * @returns Human-readable lock period
 */
export const formatLockPeriod = (seconds: number): string => {
  if (seconds === 0) return 'No lock'
  
  const days = Math.floor(seconds / (24 * 60 * 60))
  
  if (days >= 365) {
    const years = Math.floor(days / 365)
    return `${years} year${years > 1 ? 's' : ''}`
  } else if (days >= 30) {
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? 's' : ''}`
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`
  } else {
    const hours = Math.floor(seconds / (60 * 60))
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
}

// ============================================================================
// Fee Calculations
// ============================================================================

/**
 * Calculate fee amount
 * @param amount - Base amount
 * @param feePercentage - Fee percentage (0-100)
 * @returns Fee amount as string
 */
export const calculateFees = (
  amount: string,
  feePercentage: number
): string => {
  try {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return '0'
    
    const fee = amountNum * (feePercentage / 100)
    return fee.toFixed(6)
  } catch (error) {
    console.error('Error calculating fees:', error)
    return '0'
  }
}

/**
 * Calculate net amount after fees
 * @param amount - Gross amount
 * @param feePercentage - Fee percentage (0-100)
 * @returns Net amount as string
 */
export const calculateNetAmount = (
  amount: string,
  feePercentage: number
): string => {
  try {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return '0'
    
    const fee = amountNum * (feePercentage / 100)
    return (amountNum - fee).toFixed(6)
  } catch (error) {
    console.error('Error calculating net amount:', error)
    return '0'
  }
}

// ============================================================================
// USD Formatting
// ============================================================================

/**
 * Format USD value with currency symbol
 * @param value - Value in USD
 * @param decimals - Number of decimal places
 * @returns Formatted USD string
 */
export const formatUSD = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Format large numbers with K, M, B suffixes
 * @param value - Numeric value
 * @returns Formatted string with suffix
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  } else {
    return formatUSD(value)
  }
}

// ============================================================================
// Percentage Formatting
// ============================================================================

/**
 * Format percentage value
 * @param value - Percentage value
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format APY with color indicator
 * @param apy - APY value
 * @returns Object with formatted APY and color class
 */
export const formatAPYWithColor = (apy: number): { text: string; colorClass: string } => {
  const text = formatPercentage(apy, 2)
  let colorClass = 'text-muted-foreground'
  
  if (apy >= 20) {
    colorClass = 'text-green-500'
  } else if (apy >= 10) {
    colorClass = 'text-green-400'
  } else if (apy >= 5) {
    colorClass = 'text-yellow-500'
  }
  
  return { text, colorClass }
}

// ============================================================================
// Address Formatting
// ============================================================================

/**
 * Shorten Ethereum address for display
 * @param address - Full Ethereum address
 * @param chars - Number of characters to show on each side
 * @returns Shortened address
 */
export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length < 10) return address
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns True if valid, false otherwise
 */
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address)
}

// ============================================================================
// Explorer URLs
// ============================================================================

/**
 * Get block explorer URL for transaction
 * @param hash - Transaction hash
 * @param chainId - Chain ID (defaults to Somnia Testnet)
 * @returns Explorer URL
 */
export const getExplorerUrl = (hash: string, chainId: number = SOMNIA_TESTNET.chainId): string => {
  const explorers: Record<number, string> = {
    997: SOMNIA_TESTNET.blockExplorerUrls[0]
  }
  
  const baseUrl = explorers[chainId] || explorers[997]
  return `${baseUrl}/tx/${hash}`
}

/**
 * Get block explorer URL for address
 * @param address - Ethereum address
 * @param chainId - Chain ID (defaults to Somnia Testnet)
 * @returns Explorer URL
 */
export const getAddressExplorerUrl = (address: string, chainId: number = SOMNIA_TESTNET.chainId): string => {
  const explorers: Record<number, string> = {
    997: SOMNIA_TESTNET.blockExplorerUrls[0]
  }
  
  const baseUrl = explorers[chainId] || explorers[997]
  return `${baseUrl}/address/${address}`
}

// ============================================================================
// Weighted Average Calculations
// ============================================================================

/**
 * Calculate weighted average APY across multiple positions
 * @param positions - Array of staking positions
 * @returns Weighted average APY
 */
export const calculateWeightedAPY = (positions: StakingPosition[]): number => {
  if (positions.length === 0) return 0
  
  const totalStaked = positions.reduce((sum, pos) => sum + pos.stakedAmountUSD, 0)
  if (totalStaked === 0) return 0
  
  const weightedSum = positions.reduce((sum, pos) => {
    return sum + (pos.apy * pos.stakedAmountUSD)
  }, 0)
  
  return weightedSum / totalStaked
}

// ============================================================================
// Number Parsing
// ============================================================================

/**
 * Safely parse float from string
 * @param value - String value
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default
 */
export const safeParseFloat = (value: string, defaultValue: number = 0): number => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Safely parse integer from string
 * @param value - String value
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed integer or default
 */
export const safeParseInt = (value: string, defaultValue: number = 0): number => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

// ============================================================================
// Comparison Utilities
// ============================================================================

/**
 * Compare two APY values and return trend indicator
 * @param current - Current APY
 * @param predicted - Predicted APY
 * @returns Trend object with direction and percentage change
 */
export const getAPYTrend = (current: number, predicted: number): {
  direction: 'up' | 'down' | 'stable'
  change: number
  changePercent: number
} => {
  const change = predicted - current
  const changePercent = current > 0 ? (change / current) * 100 : 0
  
  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (Math.abs(changePercent) > 1) {
    direction = change > 0 ? 'up' : 'down'
  }
  
  return {
    direction,
    change,
    changePercent
  }
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date for display
 * @param date - Date object
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param date - Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}
