/**
 * PriceImpactChart Atom Component
 * Visual chart showing price impact with warning indicators for high impact swaps
 */

import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'
import { AlertTriangle, TrendingDown, Info } from 'lucide-react'
import { LiquidityData } from '@/services/types'
import { cn } from '@/lib/utils'

interface PriceImpactChartProps {
  currentAmount: string
  priceImpact: number
  liquidityData?: LiquidityData
  className?: string
  compact?: boolean
}

const PriceImpactChart: React.FC<PriceImpactChartProps> = ({
  currentAmount,
  priceImpact,
  liquidityData,
  className,
  compact = false
}) => {
  // Generate price impact data points for the chart
  const chartData = useMemo(() => {
    const amount = parseFloat(currentAmount) || 0
    const maxAmount = Math.max(amount * 3, 1000) // Show up to 3x current amount or 1000 minimum
    
    const points = []
    const steps = compact ? 10 : 20
    
    for (let i = 0; i <= steps; i++) {
      const swapAmount = (maxAmount / steps) * i
      
      // Simulate price impact calculation based on liquidity
      // In real implementation, this would use actual DEX math
      let impact = 0
      if (swapAmount > 0) {
        const liquidityFactor = liquidityData?.totalLiquidity || 1000000
        impact = Math.pow(swapAmount / liquidityFactor, 0.7) * 100
        impact = Math.min(impact, 50) // Cap at 50%
      }
      
      points.push({
        amount: swapAmount,
        impact: impact,
        isCurrentAmount: Math.abs(swapAmount - amount) < maxAmount / (steps * 2)
      })
    }
    
    return points
  }, [currentAmount, liquidityData, compact])

  const getImpactLevel = (impact: number) => {
    if (impact <= 1) return 'low'
    if (impact <= 3) return 'medium'
    return 'high'
  }

  const getImpactColor = (impact: number) => {
    const level = getImpactLevel(impact)
    switch (level) {
      case 'low': return '#10B981' // green-500
      case 'medium': return '#F59E0B' // yellow-500
      case 'high': return '#EF4444' // red-500
    }
  }

  const impactLevel = getImpactLevel(priceImpact)

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        {/* Impact Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Price Impact</span>
          <div className="flex items-center gap-2">
            {priceImpact > 3 && <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span className={cn(
              'text-sm font-medium',
              impactLevel === 'low' ? 'text-green-400' :
              impactLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
            )}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getImpactColor(priceImpact)} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getImpactColor(priceImpact)} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="impact"
                stroke={getImpactColor(priceImpact)}
                strokeWidth={2}
                fill="url(#impactGradient)"
              />
              <ReferenceLine 
                y={3} 
                stroke="#F59E0B" 
                strokeDasharray="2 2" 
                strokeOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Warning for high impact */}
        {priceImpact > 3 && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <TrendingDown className="w-3 h-3" />
            <span>High impact may result in unfavorable rates</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-400" />
          Price Impact Analysis
        </h3>
        <div className="flex items-center gap-2">
          {priceImpact > 3 && <AlertTriangle className="w-5 h-5 text-red-400" />}
          <span className={cn(
            'text-lg font-bold',
            impactLevel === 'low' ? 'text-green-400' :
            impactLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
          )}>
            {priceImpact.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full bg-gray-900 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="impactGradientFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getImpactColor(priceImpact)} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getImpactColor(priceImpact)} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="amount" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Area
              type="monotone"
              dataKey="impact"
              stroke={getImpactColor(priceImpact)}
              strokeWidth={2}
              fill="url(#impactGradientFull)"
            />
            {/* Reference lines for impact thresholds */}
            <ReferenceLine 
              y={1} 
              stroke="#10B981" 
              strokeDasharray="2 2" 
              strokeOpacity={0.5}
              label={{ value: "Low Impact (1%)", position: "topRight", fontSize: 10, fill: "#10B981" }}
            />
            <ReferenceLine 
              y={3} 
              stroke="#F59E0B" 
              strokeDasharray="2 2" 
              strokeOpacity={0.5}
              label={{ value: "High Impact (3%)", position: "topRight", fontSize: 10, fill: "#F59E0B" }}
            />
            {/* Current amount indicator */}
            {parseFloat(currentAmount) > 0 && (
              <ReferenceLine 
                x={parseFloat(currentAmount)} 
                stroke="#3B82F6" 
                strokeWidth={2}
                label={{ value: "Current", position: "top", fontSize: 10, fill: "#3B82F6" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Level Indicator */}
      <div className="grid grid-cols-3 gap-2">
        <div className={cn(
          'p-3 rounded-lg border text-center',
          impactLevel === 'low' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-gray-800 border-gray-700 text-gray-400'
        )}>
          <div className="text-xs font-medium">Low Impact</div>
          <div className="text-xs">≤ 1%</div>
        </div>
        <div className={cn(
          'p-3 rounded-lg border text-center',
          impactLevel === 'medium' 
            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            : 'bg-gray-800 border-gray-700 text-gray-400'
        )}>
          <div className="text-xs font-medium">Medium Impact</div>
          <div className="text-xs">1% - 3%</div>
        </div>
        <div className={cn(
          'p-3 rounded-lg border text-center',
          impactLevel === 'high' 
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-gray-800 border-gray-700 text-gray-400'
        )}>
          <div className="text-xs font-medium">High Impact</div>
          <div className="text-xs">> 3%</div>
        </div>
      </div>

      {/* Warnings and Recommendations */}
      {priceImpact > 3 && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-400">High Price Impact Warning</p>
            <p className="text-sm text-red-300 mt-1">
              This swap will significantly impact the token price. Consider:
            </p>
            <ul className="text-sm text-red-300 mt-2 space-y-1">
              <li>• Reducing the swap amount</li>
              <li>• Splitting into multiple smaller swaps</li>
              <li>• Waiting for better liquidity conditions</li>
            </ul>
          </div>
        </div>
      )}

      {/* Liquidity Information */}
      {liquidityData && (
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-400">Liquidity Information</p>
            <div className="text-sm text-blue-300 mt-1 space-y-1">
              <div>Total Liquidity: ${liquidityData.liquidityUSD.toLocaleString()}</div>
              <div>24h Volume: ${liquidityData.volume24h.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="flex items-start gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-300">About Price Impact</p>
          <p className="text-sm text-gray-400 mt-1">
            Price impact shows how much your trade will move the market price. 
            Larger trades in pools with lower liquidity will have higher price impact.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PriceImpactChart