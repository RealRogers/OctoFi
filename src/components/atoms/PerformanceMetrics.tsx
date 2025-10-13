/**
 * PerformanceMetrics Atom Component
 * Displays trading agent performance metrics with visual indicators
 */

import React from 'react'
import { TrendingUp, TrendingDown, Target, Activity, DollarSign, Percent } from 'lucide-react'
import { PerformanceMetrics as PerformanceData } from '@/services/types'
import { formatUSDAmount, formatPercentage } from '@/services/utils'
import { cn } from '@/lib/utils'

interface PerformanceMetricsProps {
  performance: PerformanceData
  className?: string
  compact?: boolean
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  performance,
  className,
  compact = false
}) => {
  const getPerformanceColor = (value: number, isPercentage = false) => {
    const threshold = isPercentage ? 0 : 0
    if (value > threshold) return 'text-green-400'
    if (value < threshold) return 'text-red-400'
    return 'text-gray-400'
  }

  const getPerformanceIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Activity className="w-4 h-4 text-gray-400" />
  }

  const metrics = [
    {
      label: 'Total P&L',
      value: formatUSDAmount(performance.totalProfitLoss),
      icon: <DollarSign className="w-4 h-4" />,
      color: getPerformanceColor(performance.totalProfitLoss),
      trend: getPerformanceIcon(performance.totalProfitLoss)
    },
    {
      label: 'Win Rate',
      value: `${performance.winRate.toFixed(1)}%`,
      icon: <Target className="w-4 h-4" />,
      color: getPerformanceColor(performance.winRate - 50, true),
      trend: null
    },
    {
      label: 'Avg Return',
      value: formatPercentage(performance.averageReturn),
      icon: <Percent className="w-4 h-4" />,
      color: getPerformanceColor(performance.averageReturn),
      trend: getPerformanceIcon(performance.averageReturn)
    },
    {
      label: 'Sharpe Ratio',
      value: performance.sharpeRatio.toFixed(2),
      icon: <Activity className="w-4 h-4" />,
      color: getPerformanceColor(performance.sharpeRatio - 1),
      trend: null
    }
  ]

  if (compact) {
    return (
      <div className={cn('grid grid-cols-2 gap-3', className)}>
        {metrics.slice(0, 2).map((metric, index) => (
          <div key={index} className="text-center">
            <div className={cn('text-lg font-bold', metric.color)}>
              {metric.value}
            </div>
            <div className="text-xs text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
      </div>

      {/* Trading Summary */}
      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{performance.totalTrades}</div>
          <div className="text-xs text-gray-400">Total Trades</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{performance.successfulTrades}</div>
          <div className="text-xs text-gray-400">Successful</div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-full bg-gray-700', metric.color)}>
                {metric.icon}
              </div>
              <span className="text-gray-300">{metric.label}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={cn('font-semibold', metric.color)}>
                {metric.value}
              </span>
              {metric.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Metrics */}
      <div className="p-3 bg-gray-800/30 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">Risk Metrics</div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Max Drawdown</span>
          <span className={cn(
            'font-semibold',
            performance.maxDrawdown < 0 ? 'text-red-400' : 'text-gray-400'
          )}>
            {formatPercentage(performance.maxDrawdown)}
          </span>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="flex items-center justify-center p-3 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          {performance.totalProfitLoss > 0 ? (
            <>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">Profitable</span>
            </>
          ) : performance.totalProfitLoss < 0 ? (
            <>
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-red-400 font-medium">Loss</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-gray-400 font-medium">Break Even</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics