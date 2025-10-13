/**
 * PerformanceComparisonBars Component
 * Enhanced performance comparison with animated bars and benchmark data
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, BarChart3, Award, AlertCircle, Info } from 'lucide-react';
import { PerformanceMetrics } from '@/services/types';
import ComparisonBar from '@/components/atoms/ComparisonBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PerformanceComparisonBarsProps {
  performance: PerformanceMetrics;
  className?: string;
  showBenchmarks?: boolean;
}

interface BenchmarkData {
  name: string;
  winRate: number;
  averageReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  color: string;
  description: string;
}

const PerformanceComparisonBars: React.FC<PerformanceComparisonBarsProps> = ({
  performance,
  className,
  showBenchmarks = true
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Enhanced benchmark data with descriptions
  const benchmarks: BenchmarkData[] = useMemo(() => [
    {
      name: 'Your Agent',
      winRate: performance.winRate,
      averageReturn: performance.averageReturn,
      sharpeRatio: performance.sharpeRatio,
      maxDrawdown: performance.maxDrawdown,
      color: 'purple',
      description: 'Your AI trading agent performance'
    },
    {
      name: 'Market Average',
      winRate: 62,
      averageReturn: 8.5,
      sharpeRatio: 1.2,
      maxDrawdown: -18,
      color: 'blue',
      description: 'Average performance of similar trading strategies'
    },
    {
      name: 'Top 10%',
      winRate: 78,
      averageReturn: 18.2,
      sharpeRatio: 2.1,
      maxDrawdown: -12,
      color: 'green',
      description: 'Performance of top 10% performing agents'
    }
  ], [performance]);

  // Calculate relative performance scores
  const performanceScores = useMemo(() => {
    const topPerformer = benchmarks[2]; // Top 10%
    
    return {
      winRate: Math.min((performance.winRate / topPerformer.winRate) * 100, 100),
      averageReturn: Math.min(((performance.averageReturn + 30) / (topPerformer.averageReturn + 30)) * 100, 100),
      sharpeRatio: Math.min((performance.sharpeRatio / topPerformer.sharpeRatio) * 100, 100),
      maxDrawdown: Math.min((Math.abs(topPerformer.maxDrawdown) / Math.abs(performance.maxDrawdown || -1)) * 100, 100)
    };
  }, [performance, benchmarks]);

  // Get overall performance rating
  const getPerformanceRating = () => {
    const avgScore = (
      performanceScores.winRate + 
      performanceScores.averageReturn + 
      performanceScores.sharpeRatio + 
      performanceScores.drawdownScore
    ) / 4;

    if (avgScore >= 85) return { rating: 'Exceptional', color: 'green', icon: Award };
    if (avgScore >= 70) return { rating: 'Excellent', color: 'blue', icon: TrendingUp };
    if (avgScore >= 55) return { rating: 'Good', color: 'yellow', icon: Target };
    if (avgScore >= 40) return { rating: 'Average', color: 'orange', icon: BarChart3 };
    return { rating: 'Below Average', color: 'red', icon: AlertCircle };
  };

  const rating = getPerformanceRating();
  const RatingIcon = rating.icon;

  // Format functions
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatReturn = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  const formatRatio = (value: number) => value.toFixed(2);

  // Get metric color based on performance vs market
  const getMetricColor = (userValue: number, marketValue: number, isInverted = false) => {
    const isGood = isInverted ? userValue < marketValue : userValue > marketValue;
    return isGood ? 'green' : userValue === marketValue ? 'yellow' : 'red';
  };

  return (
    <TooltipProvider>
      <div className={cn('zone-analytics', className)}>
        <Card className="glass-card-hover">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Performance Comparison
              </CardTitle>
              
              <Badge 
                variant="outline" 
                className={cn(
                  'flex items-center gap-1 transition-all duration-200',
                  rating.color === 'green' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                  rating.color === 'blue' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                  rating.color === 'yellow' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                  rating.color === 'orange' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                  'border-red-500/30 text-red-400 bg-red-500/10'
                )}
              >
                <RatingIcon className="w-3 h-3" />
                {rating.rating}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Animated Comparison Bars */}
            <div className="space-y-5">
              <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Performance vs Benchmarks
              </h4>

              {/* Win Rate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onMouseEnter={() => setHoveredMetric('winRate')}
                onMouseLeave={() => setHoveredMetric(null)}
                className={cn(
                  "space-y-3 p-4 rounded-lg transition-all duration-200",
                  hoveredMetric === 'winRate' ? 'bg-white/5 backdrop-blur-sm' : ''
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Win Rate</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">Percentage of profitable trades vs total trades</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {formatPercentage(performance.winRate)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {benchmarks.map((benchmark, index) => (
                    <ComparisonBar
                      key={benchmark.name}
                      label={benchmark.name}
                      value={benchmark.winRate}
                      maxValue={100}
                      color={benchmark.color}
                      variant="gradient"
                      size="sm"
                      animated={true}
                      valueFormatter={formatPercentage}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Average Return */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onMouseEnter={() => setHoveredMetric('return')}
                onMouseLeave={() => setHoveredMetric(null)}
                className={cn(
                  "space-y-3 p-4 rounded-lg transition-all duration-200",
                  hoveredMetric === 'return' ? 'bg-white/5 backdrop-blur-sm' : ''
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Average Return</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">Average percentage return per trade</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    performance.averageReturn >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {formatReturn(performance.averageReturn)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {benchmarks.map((benchmark, index) => (
                    <ComparisonBar
                      key={benchmark.name}
                      label={benchmark.name}
                      value={Math.max(benchmark.averageReturn + 30, 0)} // Offset for negative values
                      maxValue={50} // Adjusted max for better visualization
                      color={benchmark.averageReturn >= 0 ? benchmark.color : 'red'}
                      variant="gradient"
                      size="sm"
                      animated={true}
                      valueFormatter={() => formatReturn(benchmark.averageReturn)}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Sharpe Ratio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onMouseEnter={() => setHoveredMetric('sharpe')}
                onMouseLeave={() => setHoveredMetric(null)}
                className={cn(
                  "space-y-3 p-4 rounded-lg transition-all duration-200",
                  hoveredMetric === 'sharpe' ? 'bg-white/5 backdrop-blur-sm' : ''
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Risk-Adjusted Return</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">Sharpe ratio - return per unit of risk taken</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {formatRatio(performance.sharpeRatio)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {benchmarks.map((benchmark, index) => (
                    <ComparisonBar
                      key={benchmark.name}
                      label={benchmark.name}
                      value={Math.max(benchmark.sharpeRatio * 25, 0)} // Scale for visualization
                      maxValue={100}
                      color={benchmark.color}
                      variant="gradient"
                      size="sm"
                      animated={true}
                      valueFormatter={() => formatRatio(benchmark.sharpeRatio)}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 rounded-lg"
            >
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Key Insights
              </h4>
              
              <div className="space-y-2 text-xs">
                {performance.winRate > benchmarks[1].winRate && (
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    Win rate exceeds market average by {(performance.winRate - benchmarks[1].winRate).toFixed(1)}%
                  </div>
                )}
                
                {performance.averageReturn > benchmarks[1].averageReturn && (
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    Returns outperform market by {(performance.averageReturn - benchmarks[1].averageReturn).toFixed(1)}%
                  </div>
                )}
                
                {performance.sharpeRatio > benchmarks[1].sharpeRatio && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Award className="w-3 h-3" />
                    Superior risk-adjusted returns (Sharpe: {performance.sharpeRatio.toFixed(2)})
                  </div>
                )}
                
                {performance.winRate < benchmarks[1].winRate && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="w-3 h-3" />
                    Win rate below market average - consider strategy optimization
                  </div>
                )}
                
                {performance.averageReturn < benchmarks[1].averageReturn && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <TrendingDown className="w-3 h-3" />
                    Returns below market average - review risk parameters
                  </div>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default PerformanceComparisonBars;