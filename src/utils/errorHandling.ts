/**
 * Error Handling Utilities
 * 
 * Centralized error handling for the dashboard with user-friendly messages,
 * error logging, and integration with toast notifications.
 */

import type { NetworkError, AIError, TransactionError } from '@/services/types'

/**
 * Toast notification function type
 * Matches the signature of useToast().toast
 */
type ToastFunction = (options: {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}) => void

/**
 * Error context for better debugging and tracking
 */
export interface ErrorContext {
  component: string
  action: string
  metadata?: Record<string, unknown>
}

/**
 * Handles dashboard errors with logging and user notifications
 * 
 * @param error - The error that occurred
 * @param context - Context information about where the error occurred
 * @param toast - Toast notification function (optional)
 * 
 * @example
 * ```typescript
 * try {
 *   await applyRecommendation(id)
 * } catch (error) {
 *   handleDashboardError(
 *     error as Error,
 *     { component: 'AgentDashboard', action: 'applyRecommendation' },
 *     toast
 *   )
 * }
 * ```
 */
export function handleDashboardError(
  error: Error,
  context: ErrorContext,
  toast?: ToastFunction
): void {
  // Log error to console with context
  console.error(
    `[Dashboard Error - ${context.component}/${context.action}]:`,
    error,
    context.metadata
  )
  
  // Log to error tracking service if available (e.g., Sentry)
  if (typeof window !== 'undefined' && (window as any).errorTracker) {
    try {
      (window as any).errorTracker.captureException(error, {
        tags: {
          component: context.component,
          action: context.action,
        },
        extra: context.metadata,
      })
    } catch (trackingError) {
      console.warn('Failed to log error to tracking service:', trackingError)
    }
  }
  
  // Show user-friendly toast notification
  if (toast) {
    const userMessage = getUserFriendlyErrorMessage(error)
    toast({
      title: 'Something went wrong',
      description: userMessage,
      variant: 'destructive',
      duration: 5000,
    })
  }
}

/**
 * Converts technical error messages to user-friendly descriptions
 * 
 * @param error - The error to convert
 * @returns User-friendly error message
 * 
 * @example
 * ```typescript
 * const message = getUserFriendlyErrorMessage(new Error('Network timeout'))
 * // Returns: "Request timed out. Please try again."
 * ```
 */
export function getUserFriendlyErrorMessage(error: Error): string {
  const message = error.message.toLowerCase()
  
  // Network errors
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network connection issue. Please check your internet connection and try again.'
  }
  
  // Timeout errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'Request timed out. The server is taking too long to respond. Please try again.'
  }
  
  // Authentication errors
  if (message.includes('unauthorized') || message.includes('authentication')) {
    return 'Your session has expired. Please log in again to continue.'
  }
  
  // Permission errors
  if (message.includes('forbidden') || message.includes('permission')) {
    return 'You don\'t have permission to perform this action.'
  }
  
  // Rate limiting
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  
  // Validation errors
  if (message.includes('invalid') || message.includes('validation')) {
    return 'Invalid data provided. Please check your input and try again.'
  }
  
  // AI service errors
  if (error instanceof AIError) {
    if (error.retryable) {
      return `AI service temporarily unavailable (${error.service}). Please try again in a moment.`
    }
    return `AI service error (${error.service}). Please contact support if this persists.`
  }
  
  // Transaction errors
  if (error instanceof TransactionError) {
    return `Transaction failed: ${error.reason}. Please check your wallet and try again.`
  }
  
  // Network errors with codes
  if (error instanceof NetworkError) {
    if (error.code >= 500) {
      return 'Server error. Our team has been notified. Please try again later.'
    }
    if (error.code >= 400) {
      return `Request error: ${error.reason}. Please check your input and try again.`
    }
  }
  
  // Generic fallback
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
}

/**
 * Wraps an async function with error handling
 * 
 * @param fn - Async function to wrap
 * @param context - Error context
 * @param toast - Toast notification function
 * @returns Wrapped function that handles errors
 * 
 * @example
 * ```typescript
 * const safeApplyRecommendation = withErrorHandling(
 *   applyRecommendation,
 *   { component: 'Dashboard', action: 'applyRecommendation' },
 *   toast
 * )
 * 
 * await safeApplyRecommendation(recommendationId)
 * ```
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext,
  toast?: ToastFunction
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleDashboardError(error as Error, context, toast)
      throw error // Re-throw to allow caller to handle if needed
    }
  }) as T
}

/**
 * Checks if an error is retryable
 * 
 * @param error - Error to check
 * @returns True if the error is retryable
 * 
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   // Show retry button
 * }
 * ```
 */
export function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase()
  
  // Network and timeout errors are retryable
  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch')
  ) {
    return true
  }
  
  // AI errors with retryable flag
  if (error instanceof AIError) {
    return error.retryable
  }
  
  // Network errors with 5xx status codes
  if (error instanceof NetworkError) {
    return error.code >= 500
  }
  
  // Rate limiting is retryable after waiting
  if (message.includes('rate limit')) {
    return true
  }
  
  return false
}

/**
 * Gets a suggested retry delay based on the error type
 * 
 * @param error - Error to analyze
 * @param attemptNumber - Current retry attempt number (for exponential backoff)
 * @returns Suggested delay in milliseconds
 * 
 * @example
 * ```typescript
 * const delay = getRetryDelay(error, 2)
 * setTimeout(() => retry(), delay)
 * ```
 */
export function getRetryDelay(error: Error, attemptNumber: number = 1): number {
  const message = error.message.toLowerCase()
  
  // Rate limiting - longer delay
  if (message.includes('rate limit')) {
    return 30000 // 30 seconds
  }
  
  // Network errors - exponential backoff
  if (message.includes('network') || message.includes('timeout')) {
    return Math.min(1000 * Math.pow(2, attemptNumber), 60000) // Max 60 seconds
  }
  
  // Default exponential backoff
  return Math.min(5000 * Math.pow(2, attemptNumber - 1), 30000) // Max 30 seconds
}

/**
 * Logs a warning to the console with context
 * 
 * @param message - Warning message
 * @param context - Additional context
 * 
 * @example
 * ```typescript
 * logWarning('Invalid data received', { component: 'Dashboard', data })
 * ```
 */
export function logWarning(message: string, context?: Record<string, unknown>): void {
  console.warn(`[Dashboard Warning]: ${message}`, context)
}

/**
 * Logs an info message to the console with context
 * 
 * @param message - Info message
 * @param context - Additional context
 * 
 * @example
 * ```typescript
 * logInfo('Data fetched successfully', { component: 'Dashboard', count: 10 })
 * ```
 */
export function logInfo(message: string, context?: Record<string, unknown>): void {
  console.info(`[Dashboard Info]: ${message}`, context)
}
