/**
 * Validation Utilities
 * 
 * Type guard functions for runtime validation of data structures.
 * These validators ensure data integrity and provide type safety at runtime.
 */

import type { 
  PerformanceMetrics, 
  TradingStrategy, 
  AIRecommendation,
  RecommendationPriority,
  RecommendationCategory,
  Token
} from '@/services/types'

/**
 * Validates if the given data is a valid PerformanceMetrics object
 * 
 * @param data - Unknown data to validate
 * @returns Type predicate indicating if data is PerformanceMetrics
 * 
 * @example
 * ```typescript
 * const data = fetchPerformanceData()
 * if (isValidPerformanceData(data)) {
 *   // data is now typed as PerformanceMetrics
 *   console.log(data.totalProfitLoss)
 * }
 * ```
 */
export function isValidPerformanceData(data: unknown): data is PerformanceMetrics {
  if (!data || typeof data !== 'object') {
    return false
  }
  
  const metrics = data as Record<string, unknown>
  
  // Check required numeric fields
  const hasValidNumbers = 
    typeof metrics.totalProfitLoss === 'number' &&
    typeof metrics.winRate === 'number' &&
    typeof metrics.totalTrades === 'number' &&
    typeof metrics.successfulTrades === 'number' &&
    typeof metrics.averageReturn === 'number' &&
    typeof metrics.sharpeRatio === 'number' &&
    typeof metrics.maxDrawdown === 'number'
  
  if (!hasValidNumbers) {
    return false
  }
  
  // Validate ranges
  const hasValidRanges =
    metrics.winRate >= 0 &&
    metrics.winRate <= 100 &&
    metrics.totalTrades >= 0 &&
    metrics.successfulTrades >= 0 &&
    metrics.successfulTrades <= metrics.totalTrades
  
  return hasValidRanges
}

/**
 * Validates if the given data is a valid TradingStrategy object
 * 
 * @param strategy - Unknown data to validate
 * @returns Type predicate indicating if data is TradingStrategy
 * 
 * @example
 * ```typescript
 * const strategy = getUserStrategy()
 * if (isValidStrategy(strategy)) {
 *   // strategy is now typed as TradingStrategy
 *   console.log(strategy.riskTolerance)
 * }
 * ```
 */
export function isValidStrategy(strategy: unknown): strategy is TradingStrategy {
  if (!strategy || typeof strategy !== 'object') {
    return false
  }
  
  const strat = strategy as Record<string, unknown>
  
  // Validate riskTolerance
  const validRiskLevels = ['conservative', 'moderate', 'aggressive']
  if (typeof strat.riskTolerance !== 'string' || !validRiskLevels.includes(strat.riskTolerance)) {
    return false
  }
  
  // Validate numeric fields
  const hasValidNumbers =
    typeof strat.maxSlippage === 'number' &&
    typeof strat.stopLoss === 'number' &&
    typeof strat.takeProfit === 'number' &&
    typeof strat.rebalanceThreshold === 'number'
  
  if (!hasValidNumbers) {
    return false
  }
  
  // Validate ranges
  const hasValidRanges =
    strat.maxSlippage >= 0 &&
    strat.maxSlippage <= 100 &&
    strat.stopLoss >= 0 &&
    strat.takeProfit >= 0 &&
    strat.rebalanceThreshold >= 0
  
  return hasValidRanges
}

/**
 * Validates if the given data is a valid AIRecommendation object
 * 
 * @param rec - Unknown data to validate
 * @returns Type predicate indicating if data is AIRecommendation
 * 
 * @example
 * ```typescript
 * const recommendation = getRecommendation()
 * if (validateRecommendation(recommendation)) {
 *   // recommendation is now typed as AIRecommendation
 *   console.log(recommendation.title)
 * }
 * ```
 */
export function validateRecommendation(rec: unknown): rec is AIRecommendation {
  if (!rec || typeof rec !== 'object') {
    return false
  }
  
  const recommendation = rec as Record<string, unknown>
  
  // Validate required string fields
  if (
    typeof recommendation.id !== 'string' ||
    typeof recommendation.title !== 'string' ||
    typeof recommendation.message !== 'string'
  ) {
    return false
  }
  
  // Validate priority
  const validPriorities: RecommendationPriority[] = ['low', 'medium', 'high', 'critical']
  if (
    typeof recommendation.priority !== 'string' ||
    !validPriorities.includes(recommendation.priority as RecommendationPriority)
  ) {
    return false
  }
  
  // Validate category
  const validCategories: RecommendationCategory[] = ['strategy', 'risk', 'opportunity', 'optimization']
  if (
    typeof recommendation.category !== 'string' ||
    !validCategories.includes(recommendation.category as RecommendationCategory)
  ) {
    return false
  }
  
  // Validate status
  const validStatuses = ['pending', 'applied', 'dismissed', 'expired']
  if (
    typeof recommendation.status !== 'string' ||
    !validStatuses.includes(recommendation.status)
  ) {
    return false
  }
  
  // Validate confidence
  if (
    typeof recommendation.confidence !== 'number' ||
    recommendation.confidence < 0 ||
    recommendation.confidence > 100
  ) {
    return false
  }
  
  // Validate rationale array
  if (!Array.isArray(recommendation.rationale)) {
    return false
  }
  
  // Validate dates
  if (!(recommendation.createdAt instanceof Date)) {
    return false
  }
  
  return true
}

/**
 * Validates if the given data is a valid Token object
 * 
 * @param token - Unknown data to validate
 * @returns Type predicate indicating if data is Token
 * 
 * @example
 * ```typescript
 * const token = getToken()
 * if (isValidToken(token)) {
 *   // token is now typed as Token
 *   console.log(token.symbol)
 * }
 * ```
 */
export function isValidToken(token: unknown): token is Token {
  if (!token || typeof token !== 'object') {
    return false
  }
  
  const t = token as Record<string, unknown>
  
  // Validate required fields
  const hasRequiredFields =
    typeof t.address === 'string' &&
    typeof t.symbol === 'string' &&
    typeof t.name === 'string' &&
    typeof t.decimals === 'number' &&
    typeof t.logoURI === 'string' &&
    typeof t.chainId === 'number' &&
    typeof t.verified === 'boolean'
  
  if (!hasRequiredFields) {
    return false
  }
  
  // Validate ranges
  const hasValidRanges =
    t.decimals >= 0 &&
    t.decimals <= 18 &&
    t.chainId > 0
  
  return hasValidRanges
}

/**
 * Validates if a value is a non-empty string
 * 
 * @param value - Value to validate
 * @returns True if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Validates if a value is a positive number
 * 
 * @param value - Value to validate
 * @returns True if value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value)
}

/**
 * Validates if a value is a non-negative number
 * 
 * @param value - Value to validate
 * @returns True if value is a non-negative number
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && !isNaN(value) && isFinite(value)
}

/**
 * Validates if a value is within a specified range
 * 
 * @param value - Value to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 */
export function isInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && value >= min && value <= max && !isNaN(value)
}

/**
 * Safely parses a number from unknown input
 * 
 * @param value - Value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 */
export function safeParseNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed
    }
  }
  
  return defaultValue
}

/**
 * Validates an array of items using a validator function
 * 
 * @param items - Array to validate
 * @param validator - Validator function for each item
 * @returns True if all items are valid
 */
export function validateArray<T>(
  items: unknown,
  validator: (item: unknown) => item is T
): items is T[] {
  if (!Array.isArray(items)) {
    return false
  }
  
  return items.every(validator)
}
