/**
 * PerformanceComparison Molecule Component
 * Displays performance metrics compared to benchmarks and market averages
 */

import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown, Target, BarChart3, Award, AlertCircle } from 'lucide-react'
import { PerformanceMetrics } from '@/services/types'
import ComparisonBar from '@/components/atoms/ComparisonBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PerformanceComparisonProps {
  performance: PerformanceMetrics
  className?: string
  showBenchmarks?: boolean
}

interface BenchmarkData {
  name: string
  winRate: number
  averageReturn: number
  sharpeRatio: number
  maxDrawdown: number
  color: string
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  performance,
  className,
  showBenchmarks = true
}) => {
  // Mock benchmark data (in a real app, this would come from an API)
  const benchmarks: BenchmarkData[] = useMemo(() => [
    {
      name: 'Market Average',
      winRate: 55,
      averageReturn: 8.2,
      sharpeRatio: 1.1,
      maxDrawdown: -15,
      color: 'blue'
    },
    {
      name: 'Top Performers',
      winRate: 72,
      averageReturn: 15.8,
      sharpeRatio: 1.8,
      maxDrawdown: -8,
      color: 'green'
    },
    {
      name: 'Conservative Funds',
      winRate: 48,
      averageReturn: 4.5,
      sharpeRatio: 0.8,
      maxDrawdown: -12,
      color: 'yellow'
    }
  ], [])

  // Calculate performance scores relative to benchmarks
  const performanceScores = useMemo(() => {
    const marketAvg = benchmarks[0]
    const topPerformers = benchmarks[1]
    
    return {
      winRateScore: Math.min((performance.winRate / topPerformers.winRate) * 100, 100),
      returnScore: Math.min(((performance.averageReturn + 20) / (topPerformers.averageReturn + 20)) * 100, 100), // Offset for negative returns
      sharpeScore: Math.min((performance.sharpeRatio / topPerformers.sharpeRatio) * 100, 100),
      drawdownScore: Math.min((Math.abs(topPerformers.maxDrawdown) / Math.abs(performance.maxDrawdown || -1)) * 100, 100)
    }
  }, [performance, benchmarks])

  // Get performance rating
  const getPerformanceRating = () => {
    const avgScore = (
      performanceScores.winRateScore + 
      performanceScores.returnScore + 
      performanceScores.sharpeScore + 
      performanceScores.drawdownScore
    ) / 4

    if (avgScore >= 80) return { rating: 'Excellent', color: 'green', icon: Award }
    if (avgScore >= 65) return { rating: 'Good', color: 'blue', icon: TrendingUp }
    if (avgScore >= 50) return { rating: 'Average', color: 'yellow', icon: Target }
    return { rating: 'Below Average', color: 'red', icon: AlertCircle }
  }

  const rating = getPerformanceRating()
  const RatingIcon = rating.icon

  // Format percentage values
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatReturn = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  const formatRatio = (value: number) => value.toFixed(2)

  return (
    <Card className={cn('glass-card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Performance Comparison
          </CardTitle>
          
          <Badge 
            variant="outline" 
            className={cn(
              'flex items-center gap-1',
              rating.color === 'green' ? 'border-green-500/30 text-green-400' :
              rating.color === 'blue' ? 'border-blue-500/30 text-blue-400' :
              rating.color === 'yellow' ? 'border-yellow-500/30 text-yellow-400' :
              'border-red-500/30 text-red-400'
            )}
          >
            <RatingIcon className="w-3 h-3" />
            {rating.rating}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Performance Metrics Comparison */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Your Performance vs Market
          </h4>

          {/* Win Rate Comparison */}
          <div className="space-y-2">
            <ComparisonBar
              label="Win Rate"
              value={performanceScores.winRateScore}
              color="green"
              variant="gradient"
              valueFormatter={() => formatPercentage(performance.winRate)}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Market Avg: {formatPercentage(benchmarks[0].winRate)}</span>
              <span>Top: {formatPercentage(benchmarks[1].winRate)}</span>
            </div>
          </div>

          {/* Average Return Comparison */}
          <div className="space-y-2">
            <ComparisonBar
              label="Average Return"
              value={performanceScores.returnScore}
              color="blue"
              variant="gradient"
              valueFormatter={() => formatReturn(performance.averageReturn)}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Market Avg: {formatReturn(benchmarks[0].averageReturn)}</span>
              <span>Top: {formatReturn(benchmarks[1].averageReturn)}</span>
            </div>
          </div>

          {/* Sharpe Ratio Comparison */}
          <div className="space-y-2">
            <ComparisonBar
              label="Risk-Adjusted Return (Sharpe)"
              value={performanceScores.sharpeScore}
              color="purple"
              variant="gradient"
              valueFormatter={() => formatRatio(performance.sharpeRatio)}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Market Avg: {formatRatio(benchmarks[0].sharpeRatio)}</span>
              <span>Top: {formatRatio(benchmarks[1].sharpeRatio)}</span>
            </div>
          </div>

          {/* Max Drawdown Comparison (inverted - lower is better) */}
          <div className="space-y-2">
            <ComparisonBar
              label="Drawdown Control"
              value={performanceScores.drawdownScore}
              color="orange"
              variant="gradient"
              valueFormatter={() => formatReturn(performance.maxDrawdown)}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Market Avg: {formatReturn(benchmarks[0].maxDrawdown)}</span>
              <span>Best: {formatReturn(benchmarks[1].maxDrawdown)}</span>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison Table */}
        {showBenchmarks && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">
              Benchmark Comparison
            </h4>
            
            <div className="glass-card p-3 rounded-lg">
              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-400 mb-2">
                <span>Strategy</span>
                <span>Win Rate</span>
                <span>Avg Return</span>
                <span>Sharpe</span>
                <span>Max DD</span>
              </div>
              
              {/* Your Performance */}
              <div className="grid grid-cols-5 gap-2 text-xs text-white bg-purple-500/10 p-2 rounded mb-1">
                <span className="font-medium">Your Agent</span>
                <span>{formatPercentage(performance.winRate)}</span>
                <span className={performance.averageReturn >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatReturn(performance.averageReturn)}
                </span>
                <span>{formatRatio(performance.sharpeRatio)}</span>
                <span className="text-orange-400">{formatReturn(performance.maxDrawdown)}</span>
              </div>
              
              {/* Benchmarks */}
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 text-xs text-gray-300 p-2 hover:bg-gray-800/30 rounded">
                  <span>{benchmark.name}</span>
                  <span>{formatPercentage(benchmark.winRate)}</span>
                  <span className={benchmark.averageReturn >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatReturn(benchmark.averageReturn)}
                  </span>
                  <span>{formatRatio(benchmark.sharpeRatio)}</span>
                  <span className="text-orange-400">{formatReturn(benchmark.maxDrawdown)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="glass-card p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Performance Insights
          </h4>
          
          <div className="space-y-2 text-xs text-gray-300">
            {performance.winRate > benchmarks[0].winRate && (
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-3 h-3" />
                Win rate exceeds market average by {(performance.winRate - benchmarks[0].winRate).toFixed(1)}%
              </div>
            )}
            
            {performance.averageReturn > benchmarks[0].averageReturn && (
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-3 h-3" />
                Returns outperform market by {(performance.averageReturn - benchmarks[0].averageReturn).toFixed(1)}%
              </div>
            )}
            
            {performance.sharpeRatio > benchmarks[0].sharpeRatio && (
              <div className="flex items-center gap-2 text-green-400">
                <Award className="w-3 h-3" />
                Superior risk-adjusted returns (Sharpe: {performance.sharpeRatio.toFixed(2)})
              </div>
            )}
            
            {Math.abs(performance.maxDrawdown) < Math.abs(benchmarks[0].maxDrawdown) && (
              <div className="flex items-center gap-2 text-green-400">
                <Target className="w-3 h-3" />
                Better drawdown control than market average
              </div>
            )}
            
            {performance.winRate < benchmarks[0].winRate && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-3 h-3" />
                Win rate below market average - consider strategy optimization
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceComparison