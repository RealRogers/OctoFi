/**
 * Trading Agent Hook
 * Provides easy access to trading agent functionality with React integration
 */

import { useEffect, useState, useCallback } from 'react'
import { TradingStrategy, AgentAction, SwapParameters } from '@/services/types'
import { tradingAgentService } from '@/services/tradingAgentService'
import { useTradingAgentStore, useSwapStore } from '@/services/store'
import { logger } from '@/services/errorHandler'

interface UseTradingAgentOptions {
  autoSync?: boolean
  enableLogging?: boolean
}

export const useTradingAgent = (options: UseTradingAgentOptions = {}) => {
  const { autoSync = true, enableLogging = true } = options
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentActions, setRecentActions] = useState<AgentAction[]>([])
  
  const {
    isActive,
    strategy,
    performance,
    setActive,
    setStrategy,
    setPerformance
  } = useTradingAgentStore()

  // Subscribe to agent actions
  useEffect(() => {
    const subscription = tradingAgentService.subscribeToActions((action) => {
      setRecentActions(prev => [action, ...prev].slice(0, 20)) // Keep last 20 actions
      
      if (enableLogging) {
        logger.info('Trading agent action', action)
      }
      
      // Auto-sync store state
      if (autoSync) {
        if (action.type === 'resume' && action.result === 'success') {
          setActive(true)
        } else if (action.type === 'pause' && action.result === 'success') {
          setActive(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [autoSync, enableLogging, setActive])

  // Sync with service state on mount
  useEffect(() => {
    if (autoSync) {
      setActive(tradingAgentService.isActive)
      setStrategy(tradingAgentService.strategy)
      setPerformance(tradingAgentService.performance)
    }
  }, [autoSync, setActive, setStrategy, setPerformance])

  const enableAgent = useCallback(async (newStrategy?: TradingStrategy) => {
    setIsLoading(true)
    setError(null)

    try {
      const strategyToUse = newStrategy || strategy || {
        riskTolerance: 'moderate' as const,
        maxSlippage: 1.0,
        stopLoss: 0.05,
        takeProfit: 0.15,
        rebalanceThreshold: 0.02
      }

      await tradingAgentService.enable(strategyToUse)
      
      if (autoSync) {
        setActive(true)
        setStrategy(strategyToUse)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable agent'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [strategy, autoSync, setActive, setStrategy])

  const disableAgent = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await tradingAgentService.disable()
      
      if (autoSync) {
        setActive(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable agent'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [autoSync, setActive])

  const updateStrategy = useCallback(async (newStrategy: TradingStrategy) => {
    setIsLoading(true)
    setError(null)

    try {
      await tradingAgentService.updateStrategy(newStrategy)
      
      if (autoSync) {
        setStrategy(newStrategy)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update strategy'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [autoSync, setStrategy])

  const executeSwap = useCallback(async (params: SwapParameters) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await tradingAgentService.executeSwap(params)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute swap'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getHistory = useCallback(async () => {
    try {
      return await tradingAgentService.getHistory()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get history'
      setError(errorMessage)
      return []
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshPerformance = useCallback(async () => {
    try {
      const newPerformance = tradingAgentService.getPerformance()
      if (autoSync) {
        setPerformance(newPerformance)
      }
      return newPerformance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh performance'
      setError(errorMessage)
      return null
    }
  }, [autoSync, setPerformance])

  const canExecuteTrades = useCallback(() => {
    return !isLoading && !error && !!strategy
  }, [isLoading, error, strategy])

  return {
    // State
    isActive,
    strategy,
    performance,
    isLoading,
    error,
    recentActions,
    
    // Actions
    enableAgent,
    disableAgent,
    updateStrategy,
    executeSwap,
    getHistory,
    clearError,
    refreshPerformance,
    canExecuteTrades,
    
    // Computed values
    hasRecentActivity: recentActions.length > 0,
    lastAction: recentActions[0] || null,
    isHealthy: isActive && !error,
    
    // Service reference (for advanced usage)
    service: tradingAgentService
  }
}

/**
 * Hook for automatic trading based on current swap state
 */
export const useAutoTrading = () => {
  const { fromToken, toToken, fromAmount, slippage } = useSwapStore()
  const { isActive, executeSwap } = useTradingAgent()
  
  const [canAutoTrade, setCanAutoTrade] = useState(false)
  
  // Check if auto trading is possible
  useEffect(() => {
    const hasRequiredData = !!(fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0)
    setCanAutoTrade(isActive && hasRequiredData)
  }, [isActive, fromToken, toToken, fromAmount])
  
  const triggerAutoSwap = useCallback(async () => {
    if (!canAutoTrade || !fromToken || !toToken || !fromAmount) {
      throw new Error('Auto trading conditions not met')
    }
    
    const swapParams: SwapParameters = {
      fromToken,
      toToken,
      amount: fromAmount,
      slippage
    }
    
    return await executeSwap(swapParams)
  }, [canAutoTrade, fromToken, toToken, fromAmount, slippage, executeSwap])
  
  return {
    canAutoTrade,
    triggerAutoSwap,
    isActive
  }
}

/**
 * Hook for monitoring agent performance
 */
export const useAgentPerformance = (refreshInterval = 30000) => {
  const { performance, refreshPerformance } = useTradingAgent()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Auto-refresh performance metrics
  useEffect(() => {
    if (!refreshInterval) return
    
    const interval = setInterval(async () => {
      setIsRefreshing(true)
      try {
        await refreshPerformance()
      } finally {
        setIsRefreshing(false)
      }
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [refreshInterval, refreshPerformance])
  
  const manualRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      return await refreshPerformance()
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshPerformance])
  
  return {
    performance,
    isRefreshing,
    manualRefresh
  }
}