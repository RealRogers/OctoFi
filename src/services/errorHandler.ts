/**
 * Error handling service for the AI-Enhanced Swap Interface
 * Provides centralized error handling and recovery strategies
 */

import { ErrorHandler, Logger } from './interfaces'
import { NetworkError, AIError, TransactionError, RecoveryAction } from './types'

class ErrorHandlerService implements ErrorHandler {
  private logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  /**
   * Handle network-related errors with appropriate recovery strategies
   */
  handleNetworkError(error: NetworkError): RecoveryAction {
    this.logger.error('Network error occurred', error, { code: error.code, reason: error.reason })

    // Determine recovery action based on error code
    switch (error.code) {
      case 429: // Rate limited
        return { type: 'retry', delay: 5000 }
      
      case 503: // Service unavailable
        return { type: 'retry', delay: 10000 }
      
      case 404: // Not found
        return { 
          type: 'fallback', 
          alternative: 'Using cached data or alternative endpoint' 
        }
      
      case -32603: // Internal JSON-RPC error
        return { type: 'retry', delay: 3000 }
      
      default:
        if (error.code >= 500) {
          // Server errors - retry with backoff
          return { type: 'retry', delay: 2000 }
        } else {
          // Client errors - manual intervention needed
          return {
            type: 'manual',
            instructions: [
              'Check your internet connection',
              'Verify the network is supported',
              'Try refreshing the page'
            ]
          }
        }
    }
  }

  /**
   * Handle AI service errors with graceful degradation
   */
  handleAIServiceError(error: AIError): RecoveryAction {
    this.logger.error('AI service error occurred', error, { 
      service: error.service, 
      retryable: error.retryable 
    })

    if (error.retryable) {
      return { type: 'retry', delay: 5000 }
    }

    // Non-retryable errors - fallback to basic functionality
    return {
      type: 'fallback',
      alternative: 'AI insights temporarily unavailable. Basic swap functionality remains active.'
    }
  }

  /**
   * Handle transaction errors with user-friendly guidance
   */
  handleTransactionError(error: TransactionError): RecoveryAction {
    this.logger.error('Transaction error occurred', error, { 
      code: error.code, 
      reason: error.reason 
    })

    // Map common transaction error codes to user actions
    switch (error.code) {
      case 'INSUFFICIENT_FUNDS':
        return {
          type: 'manual',
          instructions: [
            'Check your token balance',
            'Ensure you have enough tokens for the swap',
            'Account for gas fees in your balance'
          ]
        }
      
      case 'SLIPPAGE_EXCEEDED':
        return {
          type: 'manual',
          instructions: [
            'Increase slippage tolerance',
            'Try a smaller swap amount',
            'Wait for better market conditions'
          ]
        }
      
      case 'GAS_LIMIT_EXCEEDED':
        return {
          type: 'manual',
          instructions: [
            'Increase gas limit',
            'Try during lower network congestion',
            'Consider using a different route'
          ]
        }
      
      case 'DEADLINE_EXCEEDED':
        return {
          type: 'retry',
          delay: 1000
        }
      
      case 'NETWORK_ERROR':
        return {
          type: 'retry',
          delay: 3000
        }
      
      case 'USER_REJECTED':
        return {
          type: 'manual',
          instructions: [
            'Transaction was cancelled by user',
            'Try the transaction again if desired'
          ]
        }
      
      default:
        return {
          type: 'manual',
          instructions: [
            'An unexpected error occurred',
            'Check transaction details',
            'Contact support if the issue persists'
          ]
        }
    }
  }

  /**
   * Log error with context for debugging
   */
  logError(error: Error, context: string): void {
    this.logger.error(`Error in ${context}`, error, {
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * Simple logger implementation
 */
class ConsoleLogger implements Logger {
  info(message: string, data?: any): void {
    console.info(`[INFO] ${message}`, data || '')
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || '')
  }

  error(message: string, error?: Error, data?: any): void {
    console.error(`[ERROR] ${message}`, error || '', data || '')
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '')
    }
  }
}

// Export singleton instances
export const logger = new ConsoleLogger()
export const errorHandler = new ErrorHandlerService(logger)

// Export classes for testing
export { ErrorHandlerService, ConsoleLogger }