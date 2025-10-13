/**
 * AgentControls Molecule Component
 * Complete trading agent control panel with toggle, strategy selection, and performance metrics
 */

import React, { useState, useEffect } from 'react'
import { Bot, Settings, BarChart3, AlertCircle, Clock, Zap, RefreshCcw, Loader2 } from 'lucide-react'
import { TradingStrategy, AgentAction } from '@/services/types'
import { tradingAgentService } from '@/services/tradingAgentService'
import { useTradingAgentStore, useAppStore } from '@/services/store'
import AgentToggle from '@/components/atoms/AgentToggle'
import StrategySelector from '@/components/atoms/StrategySelector'
import PerformanceMetrics from '@/components/atoms/PerformanceMetrics'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AgentControlsProps {
  className?: string
  compact?: boolean
}

const AgentControls: React.FC<AgentControlsProps> = ({
  className,
  compact = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentActions, setRecentActions] = useState<AgentAction[]>([])
  const [activeTab, setActiveTab] = useState<'controls' | 'performance' | 'activity'>('controls')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isRebalancing, setIsRebalancing] = useState(false)

  const { 
    isActive, 
    strategy, 
    performance, 
    setActive, 
    setStrategy, 
    setPerformance 
  } = useTradingAgentStore()

  const { isWalletConnected } = useAppStore()

  // Subscribe to agent actions
  useEffect(() => {
    const subscription = tradingAgentService.subscribeToActions((action) => {
      setRecentActions(prev => [action, ...prev].slice(0, 10)) // Keep last 10 actions
      
      // Update store state based on action
      if (action.type === 'resume' && action.result === 'success') {
        setActive(true)
      } else if (action.type === 'pause' && action.result === 'success') {
        setActive(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setActive])

  // Sync with service state
  useEffect(() => {
    setActive(tradingAgentService.isActive)
    setStrategy(tradingAgentService.strategy)
    setPerformance(tradingAgentService.performance)
  }, [setActive, setStrategy, setPerformance])

  const handleToggleAgent = async (active: boolean) => {
    if (!isWalletConnected) {
      setError('Please connect your wallet to use the trading agent')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (active) {
        await tradingAgentService.enable(strategy || getDefaultStrategy())
      } else {
        await tradingAgentService.disable()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle agent'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStrategyChange = async (newStrategy: TradingStrategy) => {
    setIsLoading(true)
    setError(null)

    try {
      await tradingAgentService.updateStrategy(newStrategy)
      setStrategy(newStrategy)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update strategy'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultStrategy = (): TradingStrategy => ({
    riskTolerance: 'moderate',
    maxSlippage: 1.0,
    stopLoss: 0.05,
    takeProfit: 0.15,
    rebalanceThreshold: 0.02
  })

  const handleOptimizePortfolio = async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      // Trigger portfolio optimization
      await tradingAgentService.optimizePortfolio?.()
      
      // Show success feedback
      console.log('Portfolio optimization triggered')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize portfolio'
      setError(errorMessage)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleForceRebalance = async () => {
    setIsRebalancing(true)
    setError(null)

    try {
      // Force immediate rebalancing
      await tradingAgentService.forceRebalance?.()
      
      // Show success feedback
      console.log('Portfolio rebalancing triggered')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rebalance portfolio'
      setError(errorMessage)
    } finally {
      setIsRebalancing(false)
    }
  }

  const formatActionTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp)
  }

  const getActionIcon = (type: AgentAction['type']) => {
    switch (type) {
      case 'swap':
        return <BarChart3 className="w-3 h-3" />
      case 'pause':
        return <Clock className="w-3 h-3" />
      case 'resume':
        return <Bot className="w-3 h-3" />
      case 'strategy_change':
        return <Settings className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const getActionColor = (action: AgentAction) => {
    if (action.result === 'failure') return 'text-red-400'
    switch (action.type) {
      case 'swap':
        return 'text-blue-400'
      case 'resume':
        return 'text-green-400'
      case 'pause':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <AgentToggle
          isActive={isActive}
          isLoading={isLoading}
          disabled={!isWalletConnected}
          onToggle={handleToggleAgent}
        />
        
        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
            {error}
          </div>
        )}
        
        {isActive && performance && (
          <PerformanceMetrics performance={performance} compact />
        )}
      </div>
    )
  }

  return (
    <div className={cn('bg-gray-800/50 border border-gray-700 rounded-lg', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Trading Agent</h3>
          {isActive && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'controls', label: 'Controls', icon: Settings },
          { id: 'performance', label: 'Performance', icon: BarChart3 },
          { id: 'activity', label: 'Activity', icon: Clock }
        ].map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                  : 'text-gray-400 hover:text-gray-300'
              )}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Controls Tab */}
        {activeTab === 'controls' && (
          <div className="space-y-4">
            <AgentToggle
              isActive={isActive}
              isLoading={isLoading}
              disabled={!isWalletConnected}
              onToggle={handleToggleAgent}
            />

            {!isWalletConnected && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">
                    Connect your wallet to enable the trading agent
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Trading Strategy</label>
              <StrategySelector
                strategy={strategy || getDefaultStrategy()}
                onStrategyChange={handleStrategyChange}
                disabled={isLoading || !isWalletConnected}
              />
            </div>

            {/* Manual Action Buttons */}
            {isActive && (
              <div className="space-y-2 pt-4 border-t border-gray-700">
                <label className="text-sm text-gray-400 mb-2 block">Manual Actions</label>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleOptimizePortfolio}
                    disabled={isOptimizing || isRebalancing || !isWalletConnected}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize Now
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleForceRebalance}
                    disabled={isOptimizing || isRebalancing || !isWalletConnected}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    {isRebalancing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rebalancing...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Force Rebalance
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Manually trigger portfolio optimization or force immediate rebalancing
                </p>
              </div>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div>
            {performance ? (
              <PerformanceMetrics performance={performance} />
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No performance data available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Enable the agent to start tracking performance
                </p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div>
            {recentActions.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-400 mb-3">Recent Activity</div>
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                    <div className={cn('p-1 rounded', getActionColor(action))}>
                      {getActionIcon(action.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white capitalize">
                        {action.type.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatActionTime(action.timestamp)}
                      </div>
                    </div>
                    <div className={cn(
                      'text-xs px-2 py-1 rounded',
                      action.result === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    )}>
                      {action.result}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No recent activity</p>
                <p className="text-sm text-gray-500 mt-1">
                  Agent actions will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentControls