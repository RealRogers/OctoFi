/**
 * Utility functions for the AI-Enhanced Swap Interface services
 * Common helper functions used across multiple services
 */

import { Token, TokenPair, Chain } from './types'

/**
 * Format token amount with proper decimals
 */
export function formatTokenAmount(amount: string, decimals: number): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  // Handle very small numbers
  if (num < Math.pow(10, -decimals)) {
    return '< 0.' + '0'.repeat(decimals - 1) + '1'
  }
  
  // Format with appropriate decimal places
  if (num >= 1) {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 6 
    })
  } else {
    return num.toFixed(Math.min(8, decimals))
  }
}

/**
 * Parse token amount to wei/smallest unit
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  try {
    const num = parseFloat(amount)
    if (isNaN(num) || num < 0) return BigInt(0)
    
    // Convert to smallest unit
    const multiplier = BigInt(10) ** BigInt(decimals)
    const amountInSmallestUnit = BigInt(Math.floor(num * Math.pow(10, decimals)))
    
    return amountInSmallestUnit
  } catch (error) {
    return BigInt(0)
  }
}

/**
 * Format USD amount with proper currency formatting
 */
export function formatUSDAmount(amount: number): string {
  if (amount === 0) return '$0.00'
  
  if (amount < 0.01) {
    return '< $0.01'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: amount >= 1 ? 2 : 6
  }).format(amount)
}

/**
 * Format percentage with proper sign and decimals
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Calculate price impact for a swap
 */
export function calculatePriceImpact(
  inputAmount: number,
  outputAmount: number,
  marketPrice: number
): number {
  if (inputAmount === 0 || marketPrice === 0) return 0
  
  const expectedOutput = inputAmount * marketPrice
  const impact = ((expectedOutput - outputAmount) / expectedOutput) * 100
  
  return Math.max(0, impact) // Price impact is always positive
}

/**
 * Calculate slippage tolerance amount
 */
export function calculateSlippageAmount(
  amount: string,
  slippagePercent: number,
  decimals: number
): string {
  const amountNum = parseFloat(amount)
  if (isNaN(amountNum)) return '0'
  
  const slippageAmount = amountNum * (slippagePercent / 100)
  const minAmount = amountNum - slippageAmount
  
  return Math.max(0, minAmount).toFixed(decimals)
}

/**
 * Validate token address format
 */
export function isValidTokenAddress(address: string): boolean {
  // Basic Ethereum address validation
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethAddressRegex.test(address)
}

/**
 * Create a unique key for token pair
 */
export function getTokenPairKey(tokenPair: TokenPair): string {
  const { fromToken, toToken } = tokenPair
  return `${fromToken.chainId}-${fromToken.address}-${toToken.address}`
}

/**
 * Check if two tokens are the same
 */
export function areTokensEqual(token1: Token, token2: Token): boolean {
  return (
    token1.address.toLowerCase() === token2.address.toLowerCase() &&
    token1.chainId === token2.chainId
  )
}

/**
 * Get native token for a chain
 */
export function getNativeToken(chain: Chain): Token {
  return {
    address: '0x0000000000000000000000000000000000000000',
    symbol: chain.nativeCurrency.symbol,
    name: chain.nativeCurrency.name,
    decimals: chain.nativeCurrency.decimals,
    logoURI: '', // Will be set by token list
    chainId: chain.id,
    verified: true,
    auditStatus: 'audited'
  }
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function for frequent updates
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

/**
 * Create a timeout promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.NODE_ENV === 'development'
}

/**
 * Sleep utility for testing and delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}