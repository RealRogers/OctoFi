/**
 * PerformanceChart Organism Component
 * Advanced performance visualization with time-series data and multiple chart types
 */

import React, { useState, useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceDataPoint {
  timestamp: Date
  profitLoss: number
  trades: number
  winRate: number
  balance: number
}

interface AssetAllocation {
  name: string
  value: number
  color: string
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
  assetAllocation?: AssetAllocation[]
  timeframe: '24h' | '7d' | '30d' | 'all'
  onTimeframeChange?: (timeframe: '24h' | '7d' | '30d' | 'all') => void
  className?: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  assetAllocation = [],
  timeframe,
  onTimeframeChange,
  className
}) => {
  const [activeChart, setActiveChart] = useState<'pnl' | 'trades' | 'winrate' | 'allocation'>('pnl')

  // Format data for charts
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: new Date(point.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: timeframe === '24h' ? '2-digit' : undefined 
      }),
      profitLoss: point.profitLoss,
      trades: point.trades,
      winRate: point.winRate,
      balance: point.balance
    }))
  }, [data, timeframe])

  // Calculate summary metrics
  const metrics = useMemo(() => {
    if (data.length === 0) return null

    const latest = data[data.length - 1]
    const first = data[0]
    const totalPnL = latest.profitLoss - first.profitLoss
    const totalTrades = data.reduce((sum, d) => sum + d.trades, 0)
    const avgWinRate = data.reduce((sum, d) => sum + d.winRate, 0) / data.length
    const trend = totalPnL >= 0 ? 'up' : 'down'

    return { totalPnL, totalTrades, avgWinRate, trend }
  }, [data])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-sm font-medium">
              {entry.name}: {
                entry.name.includes('Rate') 
                  ? `${entry.value.toFixed(1)}%` 
                  : entry.name === 'Trades'
                  ? entry.value
                  : formatCurrency(entry.value)
              }
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn('bg-gray-800/50 border-gray-700', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Performance Analytics
          </CardTitle>
          
          {/* Timeframe Selector */}
          <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange?.(tf)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded transition-colors',
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Metrics */}
        {metrics && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              {metrics.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <div>
                <p className="text-xs text-gray-400">Total P&L</p>
                <p className={cn(
                  'text-sm font-bold',
                  metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {formatCurrency(metrics.totalPnL)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Total Trades</p>
                <p className="text-sm font-bold text-white">{metrics.totalTrades}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Avg Win Rate</p>
                <p className="text-sm font-bold text-white">{metrics.avgWinRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart Type Selector */}
        <div className="flex gap-2 border-b border-gray-700 pb-2">
          {[
            { id: 'pnl', label: 'P&L Trend', icon: TrendingUp },
            { id: 'trades', label: 'Trade Volume', icon: Activity },
            { id: 'winrate', label: 'Win Rate', icon: Calendar },
            ...(assetAllocation.length > 0 ? [{ id: 'allocation', label: 'Asset Allocation', icon: DollarSign }] : [])
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveChart(id as any)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeChart === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="h-64">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No performance data available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Enable the agent to start tracking performance
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'pnl' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="profitLoss" 
                    stroke="#10b981" 
                    fill="url(#profitGradient)"
                    strokeWidth={2}
                    name="Profit/Loss"
                  />
                </AreaChart>
              ) : activeChart === 'trades' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="trades" fill="#3b82f6" name="Trades" />
                </BarChart>
              ) : activeChart === 'winrate' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="winRate" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    name="Win Rate"
                  />
                </LineChart>
              ) : (
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceChart
