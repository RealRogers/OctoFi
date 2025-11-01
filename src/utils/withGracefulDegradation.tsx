/**
 * Higher-Order Component for Graceful Degradation
 * Provides fallback rendering and error recovery for components
 */

import React, { Component, ComponentType, ErrorInfo } from 'react'
import { ComponentErrorFallback } from '@/components/FallbackComponents'

interface WithGracefulDegradationState {
  hasError: boolean
  error?: Error
  retryCount: number
}

interface WithGracefulDegradationOptions {
  maxRetries?: number
  fallbackComponent?: ComponentType<any>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string
}

export function withGracefulDegradation<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithGracefulDegradationOptions = {}
) {
  const {
    maxRetries = 3,
    fallbackComponent: FallbackComponent,
    onError,
    componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  } = options

  return class WithGracefulDegradation extends Component<P, WithGracefulDegradationState> {
    constructor(props: P) {
      super(props)
      this.state = {
        hasError: false,
        retryCount: 0
      }
    }

    static getDerivedStateFromError(error: Error): Partial<WithGracefulDegradationState> {
      return {
        hasError: true,
        error
      }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error(`Error in ${componentName}:`, error, errorInfo)
      
      if (onError) {
        onError(error, errorInfo)
      }

      // Auto-retry for certain types of errors
      if (this.shouldAutoRetry(error) && this.state.retryCount < maxRetries) {
        setTimeout(() => {
          this.handleRetry()
        }, 1000 * (this.state.retryCount + 1)) // Exponential backoff
      }
    }

    shouldAutoRetry = (error: Error): boolean => {
      // Auto-retry for network errors, timeout errors, etc.
      const retryableErrors = [
        'NetworkError',
        'TimeoutError',
        'ChunkLoadError',
        'Loading chunk'
      ]
      
      return retryableErrors.some(errorType => 
        error.message.includes(errorType) || error.name.includes(errorType)
      )
    }

    handleRetry = () => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }))
    }

    render() {
      if (this.state.hasError) {
        // Use custom fallback component if provided
        if (FallbackComponent) {
          return (
            <FallbackComponent
              error={this.state.error}
              resetError={this.handleRetry}
              retryCount={this.state.retryCount}
              maxRetries={maxRetries}
              {...this.props}
            />
          )
        }

        // Use default fallback
        return (
          <ComponentErrorFallback
            error={this.state.error}
            resetError={this.state.retryCount < maxRetries ? this.handleRetry : undefined}
            componentName={componentName}
          />
        )
      }

      return <WrappedComponent {...this.props} />
    }

    static displayName = `withGracefulDegradation(${componentName})`
  }
}

// Hook version for functional components
export function useGracefulDegradation(
  componentName: string = 'Component',
  maxRetries: number = 3
) {
  const [error, setError] = React.useState<Error | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)

  const resetError = React.useCallback(() => {
    if (retryCount < maxRetries) {
      setError(null)
      setRetryCount(prev => prev + 1)
    }
  }, [retryCount, maxRetries])

  const handleError = React.useCallback((error: Error) => {
    console.error(`Error in ${componentName}:`, error)
    setError(error)
  }, [componentName])

  return {
    error,
    retryCount,
    maxRetries,
    resetError: retryCount < maxRetries ? resetError : undefined,
    handleError
  }
}

// Utility for wrapping async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error('Operation failed:', error)
    
    if (onError) {
      onError(error as Error)
    }
    
    return fallbackValue
  }
}