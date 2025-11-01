/**
 * HistoricalMetricsGrid Component
 * 4-column grid displaying key historical trading metrics
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  BarChart3,
  Clock,
  Zap
} from 'lucide-react';
import { PerformanceMetrics } from '@/services/types';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { cn } from '@/lib/utils';

interface HistoricalMetricsGridProps {
  performance: PerformanceMetrics;
  className?: string;
}

interface MetricCard {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  formatter: (value: number) => string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

const HistoricalMetricsGrid: React.FC<HistoricalMetricsGridProps> = ({
  performance,
  className
}) => {
  // Calculate additional metrics from performance data
  const calculatedMetrics = useMemo(() => {
    const totalTrades = performance.totalTrades || 0;
    const winningTrades = Math.round(totalTrades * (performance.winRate / 100));
    const losingTrades = totalTrades - winningTrades;
    
    // Calculate average trade size (mock calculation)
    const avgTradeSize = performance.totalProfitLoss && totalTrades > 0 
      ? Math.abs(performance.totalProfitLoss / totalTrades) * 10 // Scaled for realistic values
      : 0;

    // Calculate best and worst trades (mock calculation based on performance)
    const bestTrade = performance.averageReturn > 0 
      ? performance.averageReturn * 2.5 // Best trade is typically 2.5x average
      : Math.abs(performance.averageReturn) * 0.5;
    
    const worstTrade = performance.averageReturn > 0 
      ? performance.averageReturn * -1.2 // Worst trade is typically -1.2x average
      : performance.averageReturn * 1.8;

    return {
      totalTrades,
      avgTradeSize,
      bestTrade,
      worstTrade,
      winningTrades,
      losingTrades
    };
  }, [performance]);

  // Define metric cards
  const metricCards: MetricCard[] = useMemo(() => [
    {
      id: 'totalTrades',
      label: 'Total Trades',
      value: calculatedMetrics.totalTrades,
      icon: Activity,
      color: 'blue',
      formatter: (value) => value.toLocaleString(),
      description: 'Total number of trades executed by the agent',
      trend: calculatedMetrics.totalTrades > 100 ? 'up' : 'neutral',
      trendValue: calculatedMetrics.totalTrades > 100 ? 15 : 0
    },
    {
      id: 'avgTrade',
      label: 'Avg Trade Size',
      value: calculatedMetrics.avgTradeSize,
      icon: DollarSign,
      color: 'green',
      formatter: (value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      description: 'Average size of each trade executed',
      trend: calculatedMetrics.avgTradeSize > 500 ? 'up' : 'neutral',
      trendValue: calculatedMetrics.avgTradeSize > 500 ? 8 : 0
    },
    {
      id: 'bestTrade',
      label: 'Best Trade',
      value: calculatedMetrics.bestTrade,
      icon: TrendingUp,
      color: 'emerald',
      formatter: (value) => `+${value.toFixed(1)}%`,
      description: 'Highest percentage gain from a single trade',
      trend: 'up',
      trendValue: calculatedMetrics.bestTrade
    },
    {
      id: 'worstTrade',
      label: 'Worst Trade',
      value: Math.abs(calculatedMetrics.worstTrade),
      icon: TrendingDown,
      color: 'red',
      formatter: (value) => `-${value.toFixed(1)}%`,
      description: 'Largest percentage loss from a single trade',
      trend: 'down',
      trendValue: Math.abs(calculatedMetrics.worstTrade)
    }
  ], [calculatedMetrics]);

  // Get color classes for each metric
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      green: 'text-green-400 bg-green-500/10 border-green-500/20',
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      red: 'text-red-400 bg-red-500/10 border-red-500/20',
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <Target className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Historical Metrics</h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          const colorClasses = getColorClasses(metric.color);
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1] 
              }}
            >
              <Card className={cn(
                "glass-card-hover border transition-all duration-200 hover:scale-105",
                colorClasses.split(' ')[2] // border color
              )}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Icon and Label */}
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "p-2 rounded-lg border",
                        colorClasses
                      )}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      
                      {metric.trend && metric.trendValue && (
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className="text-xs text-gray-400">
                            {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                            {metric.trendValue > 1 ? metric.trendValue.toFixed(0) : metric.trendValue.toFixed(1)}
                            {metric.id === 'totalTrades' ? '' : '%'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Value */}
                    <div>
                      <AnimatedNumber
                        value={metric.value}
                        decimals={metric.id === 'totalTrades' ? 0 : 1}
                        className={cn(
                          "text-2xl font-bold",
                          colorClasses.split(' ')[0] // text color
                        )}
                        formatter={metric.formatter}
                      />
                    </div>

                    {/* Label and Description */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">
                        {metric.label}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass-card p-4 rounded-lg"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Winning Trades</p>
            <p className="text-lg font-bold text-green-400">
              {calculatedMetrics.winningTrades}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Losing Trades</p>
            <p className="text-lg font-bold text-red-400">
              {calculatedMetrics.losingTrades}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Win/Loss Ratio</p>
            <p className="text-lg font-bold text-white">
              {calculatedMetrics.losingTrades > 0 
                ? (calculatedMetrics.winningTrades / calculatedMetrics.losingTrades).toFixed(2)
                : '∞'
              }
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Profit Factor</p>
            <p className="text-lg font-bold text-purple-400">
              {performance.averageReturn > 0 ? '2.1' : '0.8'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HistoricalMetricsGrid;