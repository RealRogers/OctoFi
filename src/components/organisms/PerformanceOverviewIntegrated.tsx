/**
 * PerformanceOverviewIntegrated Component
 * Integrated performance visualization with chart and asset allocation in 70/30 split layout
 */

import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePerformanceOverview } from '@/hooks/usePerformanceOverview';
import PerformanceSkeleton from '@/components/ui/performance-skeleton';

interface PerformanceDataPoint {
  timestamp: Date;
  profitLoss: number;
  trades: number;
  winRate: number;
  balance: number;
}

interface AssetAllocation {
  name: string;
  value: number;
  color: string;
}

interface PerformanceOverviewIntegratedProps {
  data: PerformanceDataPoint[];
  assetAllocation: AssetAllocation[];
  timeframe: '24h' | '7d' | '30d' | 'all';
  onTimeframeChange: (timeframe: '24h' | '7d' | '30d' | 'all') => void;
  isLoading?: boolean;
  className?: string;
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#ef4444'];

const PerformanceOverviewIntegrated: React.FC<PerformanceOverviewIntegratedProps> = ({
  data,
  assetAllocation,
  timeframe,
  onTimeframeChange,
  isLoading = false,
  className
}) => {
  const [activeChart, setActiveChart] = useState<'pnl' | 'balance'>('pnl');
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { isTimeframeChanging, handleTimeframeChange } = usePerformanceOverview({
    onTimeframeChange
  });

  // Format data for charts
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: new Date(point.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: timeframe === '24h' ? '2-digit' : undefined 
      }),
      profitLoss: point.profitLoss,
      balance: point.balance,
      trades: point.trades,
      winRate: point.winRate
    }));
  }, [data, timeframe]);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    if (data.length === 0) return null;

    const latest = data[data.length - 1];
    const first = data[0];
    const totalPnL = latest.profitLoss - first.profitLoss;
    const balanceChange = ((latest.balance - first.balance) / first.balance) * 100;
    const trend = totalPnL >= 0 ? 'up' : 'down';

    return { totalPnL, balanceChange, trend, currentBalance: latest.balance };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-gray-400 text-xs mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-sm font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const AssetTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-gray-400 text-sm">{data.value}% of portfolio</p>
      </div>
    );
  };

  // Show skeleton while loading
  if (isLoading || isTimeframeChanging) {
    return <PerformanceSkeleton className={className} />;
  }

  return (
    <div className={cn('zone-performance', className)}>
      <Card className="glass-card-hover h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Performance Overview
            </CardTitle>
            
            {/* Timeframe Selector */}
            <div className="flex gap-1 glass-card rounded-lg p-1">
              {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTimeframeChange(tf)}
                  disabled={isTimeframeChanging}
                  className={cn(
                    'px-3 py-1 h-8 text-xs font-medium rounded transition-all duration-300',
                    timeframe === tf
                      ? 'bg-blue-600/80 text-white backdrop-blur-sm shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  )}
                >
                  {tf.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary Metrics */}
          {metrics && (
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                {metrics.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <div>
                  <p className="text-xs text-gray-400">Period P&L</p>
                  <p className={cn(
                    'text-lg font-bold',
                    metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {formatCurrency(metrics.totalPnL)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Current Balance</p>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(metrics.currentBalance)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Balance Change</p>
                  <p className={cn(
                    'text-lg font-bold',
                    metrics.balanceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {metrics.balanceChange >= 0 ? '+' : ''}{metrics.balanceChange.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Content: 70/30 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-80">
            {/* Chart Section - 70% */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-lg p-4 h-full relative">
                <div className="gradient-overlay rounded-lg opacity-30"></div>
                
                {/* Chart Type Toggle */}
                <div className="flex gap-2 mb-4 relative z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setActiveChart('pnl');
                        setIsTransitioning(false);
                      }, 150);
                    }}
                    disabled={isTransitioning}
                    className={cn(
                      'px-3 py-1 h-7 text-xs font-medium rounded transition-all duration-300',
                      activeChart === 'pnl'
                        ? 'bg-blue-600/80 text-white backdrop-blur-sm shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    )}
                  >
                    P&L Trend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setActiveChart('balance');
                        setIsTransitioning(false);
                      }, 150);
                    }}
                    disabled={isTransitioning}
                    className={cn(
                      'px-3 py-1 h-7 text-xs font-medium rounded transition-all duration-300',
                      activeChart === 'balance'
                        ? 'bg-blue-600/80 text-white backdrop-blur-sm shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    )}
                  >
                    Balance
                  </Button>
                </div>

                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full relative z-10">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No performance data available</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Enable the agent to start tracking performance
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={cn(
                    "h-64 relative z-10 transition-opacity duration-300",
                    isTransitioning ? "opacity-50" : "opacity-100"
                  )}>
                    <ResponsiveContainer width="100%" height="100%">
                      {activeChart === 'pnl' ? (
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#9ca3af"
                            style={{ fontSize: '11px' }}
                            tick={{ fill: '#9ca3af' }}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            style={{ fontSize: '11px' }}
                            tick={{ fill: '#9ca3af' }}
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
                      ) : (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#9ca3af"
                            style={{ fontSize: '11px' }}
                            tick={{ fill: '#9ca3af' }}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            style={{ fontSize: '11px' }}
                            tick={{ fill: '#9ca3af' }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 2 }}
                            name="Balance"
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Asset Allocation Section - 30% */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-lg p-4 h-full">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Asset Allocation
                </h3>
                
                {assetAllocation.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No allocation data</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Donut Chart */}
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetAllocation}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                            onMouseEnter={(_, index) => setHoveredAsset(assetAllocation[index].name)}
                            onMouseLeave={() => setHoveredAsset(null)}
                          >
                            {assetAllocation.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || COLORS[index % COLORS.length]}
                                stroke={hoveredAsset === entry.name ? '#ffffff' : 'transparent'}
                                strokeWidth={hoveredAsset === entry.name ? 2 : 0}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<AssetTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Asset List */}
                    <div className="space-y-2">
                      {assetAllocation.map((asset, index) => (
                        <div 
                          key={asset.name}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer",
                            hoveredAsset === asset.name 
                              ? "bg-white/10 backdrop-blur-sm" 
                              : "hover:bg-white/5"
                          )}
                          onMouseEnter={() => setHoveredAsset(asset.name)}
                          onMouseLeave={() => setHoveredAsset(null)}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: asset.color || COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-white">{asset.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-300">{asset.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOverviewIntegrated;