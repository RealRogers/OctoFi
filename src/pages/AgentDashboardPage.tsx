import { useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import AgentControls from "@/components/molecules/AgentControls";
import AgentAuditTrail from "@/components/molecules/AgentAuditTrail";
import AIInsightsPanel from "@/components/molecules/AIInsightsPanel";
import AIRecommendationsCard from "@/components/molecules/AIRecommendationsCard";
import PerformanceComparison from "@/components/molecules/PerformanceComparison";
import PerformanceChart from "@/components/organisms/PerformanceChart";
import { useTradingAgent } from "@/hooks/useTradingAgent";
import { useSwapStore } from "@/services/store";
import { useAgentNotifications } from "@/hooks/useAgentNotifications";
import { useRecommendations } from "@/hooks/useRecommendations";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { useAssetAllocation } from "@/hooks/useAssetAllocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useMobile } from "@/hooks/useMobile";
import { Bot, Activity, TrendingUp, Shield, Info, Settings, Brain, Clock, Sparkles, RefreshCw, BarChart3 } from "lucide-react";
import { ANIMATION_DELAYS, BREAKPOINTS } from "@/constants/dashboard";
import { EmptyState } from "@/components/ui/empty-state";
import { isValidPerformanceData, isValidStrategy } from "@/utils/validators";
import { logWarning } from "@/utils/errorHandling";

const AgentDashboardPage = () => {
  const { isActive, strategy, performance, canExecuteTrades, refreshPerformance } = useTradingAgent()
  const { fromToken, toToken } = useSwapStore()
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d')
  const isMobile = useMobile(BREAKPOINTS.DESKTOP)
  
  const tokenPair = fromToken && toToken ? { fromToken, toToken } : undefined

  // Use custom hooks for business logic
  useAgentNotifications()
  
  const {
    recommendations,
    isLoading: isLoadingRecommendations,
    applyRecommendation,
    dismissRecommendation,
    refreshRecommendations,
  } = useRecommendations({
    strategy,
    performance,
    autoGenerate: true,
  })

  const {
    data: performanceData,
    livePerformance,
    isLoading: isLoadingPerformance,
  } = usePerformanceData({
    timeframe,
    isActive,
    refreshPerformance,
  })

  const {
    allocation: assetAllocation,
    isLoading: isLoadingAllocation,
  } = useAssetAllocation()

  // Memoized callbacks
  const handleApplyRecommendation = useCallback(async (id: string) => {
    await applyRecommendation(id)
  }, [applyRecommendation])

  const handleDismissRecommendation = useCallback((id: string) => {
    dismissRecommendation(id)
  }, [dismissRecommendation])

  const handleRefreshRecommendations = useCallback(() => {
    refreshRecommendations()
  }, [refreshRecommendations])

  // Helper functions
  const getStatusColor = () => {
    if (!canExecuteTrades()) return 'text-gray-400'
    return isActive ? 'text-green-400' : 'text-yellow-400'
  }

  const getStatusText = () => {
    if (!canExecuteTrades()) return 'Inactive'
    return isActive ? 'Active & Trading' : 'Ready'
  }

  // Validate and use live performance if available, otherwise fall back to cached
  const rawPerformance = livePerformance || performance
  
  // Validate performance data before using it
  const currentPerformance = rawPerformance && isValidPerformanceData(rawPerformance) 
    ? rawPerformance 
    : null
  
  // Log warning if performance data is invalid
  if (rawPerformance && !currentPerformance) {
    logWarning('Invalid performance data received', { rawPerformance })
  }
  
  // Validate strategy data
  const validatedStrategy = strategy && isValidStrategy(strategy) 
    ? strategy 
    : null
  
  // Log warning if strategy data is invalid
  if (strategy && !validatedStrategy) {
    logWarning('Invalid strategy data received', { strategy })
  }

  return (
    <AppLayout>
      <Toaster />
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="responsive-heading text-white mb-2">
            {isMobile ? 'AI Agent Dashboard' : 'AI Trading Agent Dashboard'}
          </h1>
          <p className="responsive-subheading text-gray-400">
            {isMobile ? 'Monitor and control your AI agent' : 'Monitor and control your autonomous trading agent'}
          </p>
        </div>

        {/* Status Overview */}
        <TooltipProvider>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'}`}>
            <AnimatedCard delay={ANIMATION_DELAYS.STATUS_CARD_1}>
              <CardHeader className="card-header-responsive">
                <CardTitle className="status-card-title">
                  <Bot className="w-4 h-4" />
                  <span className="hide-mobile-inline">Agent Status</span>
                  <Tooltip>
                    <TooltipTrigger aria-label="More information about agent status">
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent role="tooltip">
                      <p className="text-xs max-w-xs">Current operational status of your AI trading agent</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content-responsive">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`status-card-value ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={ANIMATION_DELAYS.STATUS_CARD_2}>
              <CardHeader className="card-header-responsive">
                <CardTitle className="status-card-title">
                  <Shield className="w-4 h-4" />
                  <span className="hide-mobile-inline">Strategy</span>
                  <Tooltip>
                    <TooltipTrigger aria-label="More information about strategy">
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent role="tooltip">
                      <p className="text-xs max-w-xs">Current risk strategy configured for your agent</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content-responsive">
                <span className="status-card-value text-white capitalize">
                  {validatedStrategy?.riskTolerance || 'Not Set'}
                </span>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={ANIMATION_DELAYS.STATUS_CARD_3}>
              <CardHeader className="card-header-responsive">
                <CardTitle className="status-card-title">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hide-mobile-inline">Total P&L</span>
                  <Tooltip>
                    <TooltipTrigger aria-label="More information about total profit and loss">
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent role="tooltip">
                      <p className="text-xs max-w-xs">Total profit and loss from all agent-executed trades</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content-responsive">
                <AnimatedNumber
                  value={currentPerformance?.totalProfitLoss || 0}
                  decimals={2}
                  prefix="$"
                  className={`status-card-value ${
                    (currentPerformance?.totalProfitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                  ariaLabel={`Total profit and loss: ${(currentPerformance?.totalProfitLoss || 0) >= 0 ? 'positive' : 'negative'} $${Math.abs(currentPerformance?.totalProfitLoss || 0).toFixed(2)}`}
                />
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={ANIMATION_DELAYS.STATUS_CARD_4}>
              <CardHeader className="card-header-responsive">
                <CardTitle className="status-card-title">
                  <Activity className="w-4 h-4" />
                  <span className="hide-mobile-inline">Win Rate</span>
                  <Tooltip>
                    <TooltipTrigger aria-label="More information about win rate">
                      <Info className="w-3 h-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent role="tooltip">
                      <p className="text-xs max-w-xs">Percentage of profitable trades vs total trades</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content-responsive">
                <AnimatedNumber
                  value={currentPerformance?.winRate || 0}
                  decimals={1}
                  suffix="%"
                  className="status-card-value text-white"
                  ariaLabel={`Win rate: ${(currentPerformance?.winRate || 0).toFixed(1)} percent`}
                />
              </CardContent>
            </AnimatedCard>
          </div>
        </TooltipProvider>

        {/* Performance Chart */}
        <ErrorBoundary>
          <AnimatedCard delay={ANIMATION_DELAYS.PERFORMANCE_CHART}>
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
        <ErrorBoundary>
          <AnimatedCard delay={ANIMATION_DELAYS.RECOMMENDATIONS}>
            {(recommendations?.length ?? 0) > 0 ? (
              <AIRecommendationsCard
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
                onDismissRecommendation={handleDismissRecommendation}
                onRefresh={handleRefreshRecommendations}
                maxVisible={isMobile ? 3 : 5}
                showFilters={!isMobile}
              />
            ) : (
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Brain}
                    title="No Recommendations Available"
                    description="The AI is currently analyzing market conditions and your trading performance. New recommendations will appear here when opportunities are identified."
                    action={{
                      label: "Refresh Recommendations",
                      onClick: handleRefreshRecommendations,
                      variant: "default"
                    }}
                    size={isMobile ? "sm" : "md"}
                    glowColor="purple"
                  />
                </CardContent>
              </Card>
            )}
          </AnimatedCard>
        </ErrorBoundary>

        {/* Performance Comparison */}
        <ErrorBoundary>
          <AnimatedCard delay={ANIMATION_DELAYS.COMPARISON}>
            {currentPerformance && (currentPerformance?.totalTrades ?? 0) > 0 ? (
              <PerformanceComparison
                performance={currentPerformance}
                showBenchmarks={!isMobile}
              />
            ) : (
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={TrendingUp}
                    title="No Trading Data Yet"
                    description="Performance comparison data will appear here after your AI agent executes its first trade. Start trading to see how your agent performs against market benchmarks."
                    size={isMobile ? "sm" : "md"}
                    glowColor="blue"
                  />
                </CardContent>
              </Card>
            )}
          </AnimatedCard>
        </ErrorBoundary>

        {/* Main Dashboard Grid - Responsive Layout */}
        {isMobile ? (
          /* Mobile: Tabbed Layout */
          <AnimatedCard delay={ANIMATION_DELAYS.CONTROLS}>
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-card" role="tablist" aria-label="Dashboard sections">
                <TabsTrigger 
                  value="controls" 
                  className="flex items-center gap-2"
                  role="tab"
                  aria-controls="controls-panel"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Controls</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="flex items-center gap-2"
                  role="tab"
                  aria-controls="insights-panel"
                >
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Insights</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2"
                  role="tab"
                  aria-controls="history-panel"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="controls" className="mt-6" id="controls-panel" role="tabpanel">
                <ErrorBoundary>
                  <AgentControls />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6" id="insights-panel" role="tabpanel">
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
              
              <TabsContent value="history" className="mt-6" id="history-panel" role="tabpanel">
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
            <AnimatedCard delay={ANIMATION_DELAYS.CONTROLS} className="xl:col-span-1">
              <AgentControls />
            </AnimatedCard>

            {/* AI Insights */}
            <AnimatedCard delay={ANIMATION_DELAYS.INSIGHTS} className="xl:col-span-1">
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
            <AnimatedCard delay={ANIMATION_DELAYS.AUDIT} className="xl:col-span-1">
              <AgentAuditTrail />
            </AnimatedCard>
          </div>
        )}

        {/* Additional Information */}
        <AnimatedCard delay={ANIMATION_DELAYS.INFO}>
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
