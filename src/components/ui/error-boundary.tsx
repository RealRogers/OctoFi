/**
 * Error Boundary Component
 * Catches JavaScript errors in component tree and displays fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <Card className="glass-card max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              An unexpected error occurred while rendering this component. 
              This might be a temporary issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Reload Page
              </Button>
            </div>

            {/* Error Details (Development Mode) */}
            {this.props.showDetails && this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Show Error Details
                </summary>
                <div className="mt-2 p-3 bg-gray-900/50 rounded-lg">
                  <pre className="text-xs text-red-400 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * Async error boundary for handling promise rejections
 */
export const useAsyncError = () => {
  const [, setError] = React.useState()
  
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error
      })
    },
    [setError]
  )
}

export default ErrorBoundary