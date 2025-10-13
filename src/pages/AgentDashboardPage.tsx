import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import AgentControls from "@/components/molecules/AgentControls";
import AgentAuditTrail from "@/components/molecules/AgentAuditTrail";
import AIInsightsPanel from "@/components/molecules/AIInsightsPanel";
import AIRecommendationsCard from "@/components/molecules/AIRecommendationsCard";
import PerformanceComparison from "@/components/molecules/PerformanceComparison";
import PerformanceChart from "@/components/organisms/PerformanceChart";
import { useTradingAgent } from "@/hooks/useTradingAgent";
import { useSwapStore } from "@/services/store";
import { tradingAgentService } from "@/services/tradingAgentService";
import { aiRecommendationsService } from "@/services/aiRecommendationsService";
import { AIRecommendation } from "@/services/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useMobile } from "@/hooks/useMobile";
import { Bot, Activity, TrendingUp, Shield, Info, CheckCircle, XCircle, AlertTriangle, Settings, Brain, Clock } from "lucide-react";

const AgentDashboardPage = () => {
  const { isActive, strategy, performance, canExecuteTrades, refreshPerformance } = useTradingAgent()
  const { fromToken, toToken } = useSwapStore()
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d')
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const isMobile = useMobile(1280) // xl breakpoint
  
  const tokenPair = fromToken && toToken ? { fromToken, toToken } : undefined

  // Subscribe to agent actions for toast notifications
  useEffect(() => {
    const subscription = tradingAgentService.subscribeToActions((action) => {
      // Determine toast content based on action type and result
      if (action.result === 'success') {
        switch (action.type) {
          case 'swap':
            const swapData = action.data as any
            if (swapData?.type === 'optimization') {
              toast({
                title: "🤖 Portfolio Optimized",
                description: "AI agent successfully optimized your portfolio allocation",
                variant: "default",
              })
            } else if (swapData?.type === 'rebalancing') {
              toast({
                title: "⚖️ Portfolio Rebalanced", 
                description: "AI agent rebalanced your portfolio to maintain target allocation",
                variant: "default",
              })
            } else {
              toast({
                title: "✅ Trade Executed",
                description: `Successfully completed ${action.type} operation`,
                variant: "default",
              })
            }
            break
          case 'resume':
            toast({
              title: "🚀 Agent Activated",
              description: "AI trading agent is now active and monitoring markets",
              variant: "default",
            })
            break
          case 'pause':
            const pauseReason = (action.data as any)?.reason
            toast({
              title: "⏸️ Agent Paused",
              description: pauseReason || "AI trading agent has been paused",
              variant: "default",
            })
            break
          case 'strategy_change':
            toast({
              title: "⚙️ Strategy Updated",
              description: "Trading strategy has been successfully updated",
              variant: "default",
            })
            break
          default:
            toast({
              title: "🤖 Action Complete",
              description: `Successfully completed ${action.type}`,
              variant: "default",
            })
        }
      } else if (action.result === 'failure') {
        toast({
          title: "❌ Action Failed",
          description: action.error || `Failed to complete ${action.type}`,
          variant: "destructive",
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [toast])

  // Subscribe to AI recommendations
  useEffect(() => {
    const unsubscribe = aiRecommendationsService.subscribe((newRecommendations) => {
      setRecommendations(newRecommendations)
    })

    return unsubscribe
  }, [])

  // Generate recommendations based on current strategy and performance
  useEffect(() => {
    if (strategy && performance) {
      const strategyRecommendations = aiRecommendationsService.generateRecommendationsForStrategy(strategy)
      const performanceRecommendations = aiRecommendationsService.generateRecommendationsForPerformance(performance)
      
      // Add new recommendations (they will be filtered by the service)
      strategyRecommendations.forEach(rec => {
        if (!recommendations.find(existing => existing.title === rec.title)) {
          // This would normally be handled by the service, but for demo we'll just update state
        }
      })
    }
  }, [strategy, performance])

  // Handle recommendation actions
  const handleApplyRecommendation = async (recommendation: AIRecommendation) => {
    try {
      await aiRecommendationsService.applyRecommendation(recommendation.id)
      
      // Apply the recommendation action
      if (recommendation.action) {
        switch (recommendation.action.type) {
          case 'strategy_update':
            // Update strategy through trading agent service
            await tradingAgentService.updateStrategy({
              ...strategy,
              ...recommendation.action.payload
            })
            break
          case 'pause_agent':
            await tradingAgentService.disable()
            break
          case 'rebalance':
            await tradingAgentService.forceRebalance?.()
            break
          // Add other action types as needed
        }
      }
    } catch (error) {
      throw error // Re-throw to be handled by the component
    }
  }

  const handleDismissRecommendation = (recommendationId: string) => {
    aiRecommendationsService.dismissRecommendation(recommendationId)
  }

  const handleRefreshRecommendations = () => {
    // Force refresh recommendations
    setRecommendations(aiRecommendationsService.getRecommendations('pending'))
  }

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
      <Toaster />
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className={`font-bold text-white mb-2 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
            {isMobile ? 'AI Agent Dashboard' : 'AI Trading Agent Dashboard'}
          </h1>
          <p className={`text-gray-400 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile ? 'Monitor and control your AI agent' : 'Monitor and control your autonomous trading agent'}
          </p>
        </div>

        {/* Status Overview */}
        <TooltipProvider>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'}`}>
            <AnimatedCard delay={0.1}>
              <CardHeader className={`pb-2 ${isMobile ? 'p-3' : ''}`}>
                <CardTitle className={`text-sm font-medium text-gray-400 flex items-center gap-2 ${isMobile ? 'text-xs' : ''}`}>
                  <Bot className="w-4 h-4" />
                  <span className={isMobile ? 'hidden sm:inline' : ''}>Agent Status</span>
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
              <CardContent className={isMobile ? 'p-3 pt-0' : ''}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`font-semibold ${getStatusColor()} ${isMobile ? 'text-sm' : ''}`}>
                    {getStatusText()}
                  </span>
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <CardHeader className={`pb-2 ${isMobile ? 'p-3' : ''}`}>
                <CardTitle className={`text-sm font-medium text-gray-400 flex items-center gap-2 ${isMobile ? 'text-xs' : ''}`}>
                  <Shield className="w-4 h-4" />
                  <span className={isMobile ? 'hidden sm:inline' : ''}>Strategy</span>
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
              <CardContent className={isMobile ? 'p-3 pt-0' : ''}>
                <span className={`font-semibold text-white capitalize ${isMobile ? 'text-sm' : ''}`}>
                  {strategy?.riskTolerance || 'Not Set'}
                </span>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <CardHeader className={`pb-2 ${isMobile ? 'p-3' : ''}`}>
                <CardTitle className={`text-sm font-medium text-gray-400 flex items-center gap-2 ${isMobile ? 'text-xs' : ''}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span className={isMobile ? 'hidden sm:inline' : ''}>Total P&L</span>
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
              <CardContent className={isMobile ? 'p-3 pt-0' : ''}>
                <AnimatedNumber
                  value={livePerformance?.totalProfitLoss || performance?.totalProfitLoss || 0}
                  decimals={2}
                  prefix="$"
                  className={`font-semibold ${
                    (livePerformance?.totalProfitLoss || performance?.totalProfitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  } ${isMobile ? 'text-sm' : ''}`}
                />
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <CardHeader className={`pb-2 ${isMobile ? 'p-3' : ''}`}>
                <CardTitle className={`text-sm font-medium text-gray-400 flex items-center gap-2 ${isMobile ? 'text-xs' : ''}`}>
                  <Activity className="w-4 h-4" />
                  <span className={isMobile ? 'hidden sm:inline' : ''}>Win Rate</span>
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
              <CardContent className={isMobile ? 'p-3 pt-0' : ''}>
                <AnimatedNumber
                  value={livePerformance?.winRate || performance?.winRate || 0}
                  decimals={1}
                  suffix="%"
                  className={`font-semibold text-white ${isMobile ? 'text-sm' : ''}`}
                />
              </CardContent>
            </AnimatedCard>
          </div>
        </TooltipProvider>

        {/* Performance Chart */}
        <ErrorBoundary>
          <AnimatedCard delay={0.5}>
            <PerformanceChart 
              data={performanceData}
              assetAllocation={assetAllocation}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              className={isMobile ? 'mobile-optimized' : ''}
            />
          </AnimatedCard>
        </ErrorBoundary>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <ErrorBoundary>
            <AnimatedCard delay={0.55}>
              <AIRecommendationsCard
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
                onDismissRecommendation={handleDismissRecommendation}
                onRefresh={handleRefreshRecommendations}
                maxVisible={isMobile ? 3 : 5}
                showFilters={!isMobile}
              />
            </AnimatedCard>
          </ErrorBoundary>
        )}

        {/* Performance Comparison */}
        {performance && performance.totalTrades > 0 && (
          <ErrorBoundary>
            <AnimatedCard delay={0.58}>
              <PerformanceComparison
                performance={livePerformance || performance}
                showBenchmarks={!isMobile}
              />
            </AnimatedCard>
          </ErrorBoundary>
        )}

        {/* Main Dashboard Grid - Responsive Layout */}
        {isMobile ? (
          /* Mobile: Tabbed Layout */
          <AnimatedCard delay={0.6}>
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-card">
                <TabsTrigger value="controls" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Controls</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Insights</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="controls" className="mt-6">
                <ErrorBoundary>
                  <AgentControls />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6">
                <ErrorBoundary>
                  {tokenPair ? (
                    <AIInsightsPanel 
                      tokenPair={tokenPair}
                      className="h-full"
                    />
                  ) : (
                    <div className="h-full">
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
                    </div>
                  )}
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <ErrorBoundary>
                  <AgentAuditTrail />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </AnimatedCard>
        ) : (
          /* Desktop: Grid Layout */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Agent Controls */}
            <AnimatedCard delay={0.6} className="xl:col-span-1">
              <AgentControls />
            </AnimatedCard>

            {/* AI Insights */}
            <AnimatedCard delay={0.7} className="xl:col-span-1">
              {tokenPair ? (
                <AIInsightsPanel 
                  tokenPair={tokenPair}
                  className="h-full"
                />
              ) : (
                <div className="h-full">
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
                </div>
              )}
            </AnimatedCard>

            {/* Audit Trail */}
            <AnimatedCard delay={0.8} className="xl:col-span-1">
              <AgentAuditTrail />
            </AnimatedCard>
          </div>
        )}

        {/* Additional Information */}
        <AnimatedCard delay={0.9}>
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
        </AnimatedCard>
      </div>
    </AppLayout>
  );
};

export default AgentDashboardPage;