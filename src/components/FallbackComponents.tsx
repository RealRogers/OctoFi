/**
 * Fallback Components
 * Graceful fallback components for various error and loading scenarios
 */

import React from 'react'
import { AlertTriangle, Wifi, RefreshCw, Settings, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'

// Generic component error fallback
export const ComponentErrorFallback: React.FC<{
  error?: Error
  resetError?: () => void
  componentName?: string
}> = ({ error, resetError, componentName = 'Component' }) => {
  return (
    <Card className="glass-card border-red-500/30">
      <CardContent className="p-6">
        <EmptyState
          icon={AlertTriangle}
          title={`${componentName} Error`}
          description="This component encountered an error and couldn't render properly."
          action={resetError ? {
            label: 'Try Again',
            onClick: resetError
          } : undefined}
          size="sm"
          glowColor="red"
        />
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 bg-gray-900/50 p-3 rounded text-xs">
            <summary className="cursor-pointer text-gray-400 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-red-400 whitespace-pre-wrap text-xs">
              {error.toString()}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  )
}

// Network error fallback
export const NetworkErrorFallback: React.FC<{
  onRetry?: () => void
}> = ({ onRetry }) => {
  return (
    <EmptyState
      icon={Wifi}
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      action={onRetry ? {
        label: 'Retry Connection',
        onClick: onRetry
      } : undefined}
      size="sm"
      glowColor="red"
    />
  )
}

// Service unavailable fallback
export const ServiceUnavailableFallback: React.FC<{
  serviceName: string
  onRetry?: () => void
}> = ({ serviceName, onRetry }) => {
  return (
    <EmptyState
      icon={Settings}
      title={`${serviceName} Unavailable`}
      description={`The ${serviceName} service is temporarily unavailable. Please try again later.`}
      action={onRetry ? {
        label: 'Retry',
        onClick: onRetry
      } : undefined}
      size="sm"
      glowColor="yellow"
    />
  )
}

// Performance chart fallback
export const PerformanceChartFallback: React.FC<{
  onRefresh?: () => void
}> = ({ onRefresh }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Activity}
          title="Chart Unavailable"
          description="Performance chart couldn't load. This might be due to insufficient data or a temporary issue."
          action={onRefresh ? {
            label: 'Refresh Chart',
            onClick: onRefresh
          } : undefined}
          size="sm"
          glowColor="blue"
        />
      </CardContent>
    </Card>
  )
}

// Agent controls fallback
export const AgentControlsFallback: React.FC<{
  onRetry?: () => void
}> = ({ onRetry }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Agent Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Settings}
          title="Controls Unavailable"
          description="Agent controls couldn't load. The trading agent service might be temporarily unavailable."
          action={onRetry ? {
            label: 'Reload Controls',
            onClick: onRetry
          } : undefined}
          size="sm"
          glowColor="orange"
        />
      </CardContent>
    </Card>
  )
}

// Generic loading fallback with timeout
export const LoadingFallback: React.FC<{
  message?: string
  timeout?: number
  onTimeout?: () => void
}> = ({ message = 'Loading...', timeout = 10000, onTimeout }) => {
  const [hasTimedOut, setHasTimedOut] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true)
      onTimeout?.()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onTimeout])

  if (hasTimedOut) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Loading Timeout"
        description="This is taking longer than expected. There might be a connection issue."
        action={{
          label: 'Reload Page',
          onClick: () => window.location.reload()
        }}
        size="sm"
        glowColor="yellow"
      />
    )
  }

  return (
    <EmptyState
      icon={RefreshCw}
      title={message}
      description="Please wait while we load your data..."
      size="sm"
      glowColor="blue"
    />
  )
}

// Maintenance mode fallback
export const MaintenanceFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md mx-auto">
        <EmptyState
          icon={Settings}
          title="Maintenance Mode"
          description="The AI Trading Agent is currently undergoing maintenance. We'll be back shortly with improved features and performance."
          size="lg"
          glowColor="blue"
        />
      </div>
    </div>
  )
}