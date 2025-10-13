import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import AgentControls from "@/components/molecules/AgentControls";
import AgentAuditTrail from "@/components/molecules/AgentAuditTrail";
import AIInsightsPanel from "@/components/molecules/AIInsightsPanel";
import PerformanceChart from "@/components/organisms/PerformanceChart";
import { useTradingAgent } from "@/hooks/useTradingAgent";
import { useSwapStore } from "@/services/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Activity, TrendingUp, Shield, Info } from "lucide-react";

const AgentDashboardPage = () => {
  const { isActive, strategy, performance, canExecuteTrades, refreshPerformance } = useTradingAgent()
  const { fromToken, toToken } = useSwapStore()
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d')
  
  const tokenPair = fromToken && toToken ? { fromToken, toToken } : undefined

  // Real-time polling for performance data
  const { data: livePerformance } = useQuery({
    queryKey: ['agent-performance'],
    queryFn: async () => {
      return await refreshPerformance()
    },
    refetchInterval: 10000, // Poll every 10 seconds
    enabled: isActive
  })

  // Generate mock historical data for the chart
  const performanceData = useMemo(() => {
    const now = new Date()
    const data = []
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
    const points = timeframe === '24h' ? 24 : days
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i) * (timeframe === '24h' ? 3600000 : 86400000))
      data.push({
        timestamp,
        profitLoss: (performance?.totalProfitLoss || 0) * (i / points) + Math.random() * 100 - 50,
        trades: Math.floor(Math.random() * 5),
        winRate: 50 + Math.random() * 30,
        balance: 10000 + (performance?.totalProfitLoss || 0) * (i / points)
      })
    }
    return data
  }, [performance, timeframe])

  // Asset allocation data
  const assetAllocation = useMemo(() => [
    { name: 'ETH', value: 45, color: '#3b82f6' },
    { name: 'BTC', value: 30, color: '#f59e0b' },
    { name: 'USDC', value: 15, color: '#10b981' },
    { name: 'Other', value: 10, color: '#8b5cf6' }
  ], [])

  const getStatusColor = () => {
    if (!canExecuteTrades()) return 'text-gray-400'
    return isActive ? 'text-green-400' : 'text-yellow-400'
  }

  const getStatusText = () => {
    if (!canExecuteTrades()) return 'Inactive'
    return isActive ? 'Active & Trading' : 'Ready'
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">AI Trading Agent Dashboard</h1>
          <p className="text-gray-400">Monitor and control your autonomous trading agent</p>
        </div>

        {/* Status Overview */}
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Agent Status
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Current operational status of your AI trading agent</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`font-semibold ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Strategy
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Current risk strategy configured for your agent</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="font-semibold text-white capitalize">
                  {strategy?.riskTolerance || 'Not Set'}
                </span>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Total P&L
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Total profit and loss from all agent-executed trades</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className={`font-semibold ${
                  (livePerformance?.totalProfitLoss || performance?.totalProfitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${(livePerformance?.totalProfitLoss || performance?.totalProfitLoss || 0).toFixed(2)}
                </span>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Win Rate
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Percentage of profitable trades vs total trades</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="font-semibold text-white">
                  {(livePerformance?.winRate || performance?.winRate || 0).toFixed(1)}%
                </span>
              </CardContent>
            </Card>
          </div>
        </TooltipProvider>

        {/* Performance Chart */}
        <PerformanceChart 
          data={performanceData}
          assetAllocation={assetAllocation}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Agent Controls */}
          <div className="xl:col-span-1">
            <AgentControls />
          </div>

          {/* AI Insights */}
          <div className="xl:col-span-1">
            {tokenPair ? (
              <AIInsightsPanel 
                tokenPair={tokenPair}
                className="h-full"
              />
            ) : (
              <Card className="bg-gray-800/50 border-gray-700 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    AI Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Select tokens in the swap interface</p>
                    <p className="text-sm text-gray-500 mt-1">to view AI market insights</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Audit Trail */}
          <div className="xl:col-span-1">
            <AgentAuditTrail />
          </div>
        </div>

        {/* Additional Information */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle>About Your AI Trading Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300">
                Your AI trading agent uses advanced machine learning algorithms to analyze market conditions, 
                predict price movements, and execute trades automatically based on your configured strategy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Features:</span>
                  <ul className="mt-1 space-y-1 text-gray-300">
                    <li>• Real-time market analysis</li>
                    <li>• Risk-based decision making</li>
                    <li>• Automatic stop-loss & take-profit</li>
                    <li>• Portfolio rebalancing</li>
                  </ul>
                </div>
                <div>
                  <span className="text-gray-400">Safety Measures:</span>
                  <ul className="mt-1 space-y-1 text-gray-300">
                    <li>• Configurable risk limits</li>
                    <li>• Cooldown periods</li>
                    <li>• Volatility monitoring</li>
                    <li>• Manual override controls</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AgentDashboardPage;