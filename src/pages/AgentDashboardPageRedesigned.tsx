/**
 * AgentDashboardPage - Redesigned
 * New layout with 5 zones, accessibility, and performance optimizations
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// Layout and utilities
import AppLayout from '@/components/AppLayout';
import { useOptimizedGrid } from '@/lib/gridOptimizations';
import { useReducedMotion } from '@/lib/reducedMotionUtils';
import { useCLSMonitoring } from '@/lib/layoutOptimizations';
import { useSkipLinks, useAriaLiveRegion } from '@/lib/accessibilityUtils';

// Zone components
import HeroStatusBar from '@/components/organisms/HeroStatusBar';
import PerformanceOverviewIntegrated from '@/components/organisms/PerformanceOverviewIntegrated';
import AIIntelligenceLayer from '@/components/organisms/AIIntelligenceLayer';
import ExtendedAnalyticsZone from '@/components/organisms/ExtendedAnalyticsZone';

// Existing components (for Zone 4 - will be replaced when Zone 4 is implemented)
import AgentControls from '@/components/molecules/AgentControls';
import AgentAuditTrail from '@/components/molecules/AgentAuditTrail';
import AIInsightsPanel from '@/components/molecules/AIInsightsPanel';

// Error boundaries
import {
  HeroErrorBoundary,
  PerformanceErrorBoundary,
  AILayerErrorBoundary,
  ControlsErrorBoundary,
  AnalyticsErrorBoundary
} from '@/components/ui/zone-error-boundary';

// Accessible components
import { AccessibleSection } from '@/components/ui/accessible-components';

// Hooks and services
import { useTradingAgent } from '@/hooks/useTradingAgent';
import { useSwapStore } from '@/services/store';
import { tradingAgentService } from '@/services/tradingAgentService';
import { aiRecommendationsService } from '@/services/aiRecommendationsService';
import { AIRecommendation } from '@/services/types';
import { useToast } from '@/components/ui/use-toast';

// UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { useMobile } from '@/hooks/useMobile';
import { Settings, Brain, Clock } from 'lucide-react';

const AgentDashboardPageRedesigned: React.FC = () => {
  // Hooks
  const { isActive, strategy, performance, canExecuteTrades, refreshPerformance } = useTradingAgent();
  const { fromToken, toToken } = useSwapStore();
  const { toast } = useToast();
  const isMobile = useMobile(1280); // xl breakpoint
  const prefersReducedMotion = useReducedMotion();
  
  // State
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  
  // Accessibility
  const { SkipLinksComponent } = useSkipLinks();
  const { announce, LiveRegionComponent } = useAriaLiveRegion();
  
  // Performance monitoring
  const { cls } = useCLSMonitoring((cls) => {
    if (cls > 0.1) {
      console.warn(`CLS threshold exceeded: ${cls}`);
    }
  });
  
  // Grid optimization
  const { getGridConfig } = useOptimizedGrid();
  
  const tokenPair = fromToken && toToken ? { fromToken, toToken } : undefined;

  // Subscribe to agent actions for toast notifications
  useEffect(() => {
    const subscription = tradingAgentService.subscribeToActions((action) => {
      // Announce to screen readers
      let announcement = '';
      
      if (action.result === 'success') {
        switch (action.type) {
          case 'swap':
            const swapData = action.data as any;
            if (swapData?.type === 'optimization') {
              announcement = 'Portfolio optimized successfully';
              toast({
                title: "🤖 Portfolio Optimized",
                description: "AI agent successfully optimized your portfolio allocation",
                variant: "default",
              });
            } else if (swapData?.type === 'rebalancing') {
              announcement = 'Portfolio rebalanced successfully';
              toast({
                title: "⚖️ Portfolio Rebalanced", 
                description: "AI agent rebalanced your portfolio to maintain target allocation",
                variant: "default",
              });
            } else {
              announcement = 'Trade executed successfully';
              toast({
                title: "✅ Trade Executed",
                description: `Successfully completed ${action.type} operation`,
                variant: "default",
              });
            }
            break;
          case 'resume':
            announcement = 'AI trading agent activated';
            toast({
              title: "🚀 Agent Activated",
              description: "AI trading agent is now active and monitoring markets",
              variant: "default",
            });
            break;
          case 'pause':
            const pauseReason = (action.data as any)?.reason;
            announcement = 'AI trading agent paused';
            toast({
              title: "⏸️ Agent Paused",
              description: pauseReason || "AI trading agent has been paused",
              variant: "default",
            });
            break;
          case 'strategy_change':
            announcement = 'Trading strategy updated';
            toast({
              title: "⚙️ Strategy Updated",
              description: "Trading strategy has been successfully updated",
              variant: "default",
            });
            break;
          default:
            announcement = `${action.type} completed successfully`;
            toast({
              title: "🤖 Action Complete",
              description: `Successfully completed ${action.type}`,
              variant: "default",
            });
        }
      } else if (action.result === 'failure') {
        announcement = `${action.type} failed`;
        toast({
          title: "❌ Action Failed",
          description: action.error || `Failed to complete ${action.type}`,
          variant: "destructive",
        });
      }
      
      if (announcement) {
        announce(announcement, action.result === 'failure' ? 'assertive' : 'polite');
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, announce]);

  // Subscribe to AI recommendations
  useEffect(() => {
    const unsubscribe = aiRecommendationsService.subscribe((newRecommendations) => {
      setRecommendations(newRecommendations);
      
      // Announce new critical recommendations
      const criticalRecs = newRecommendations.filter(r => r.priority === 'critical');
      if (criticalRecs.length > 0) {
        announce(`${criticalRecs.length} critical AI recommendations available`, 'assertive');
      }
    });

    return unsubscribe;
  }, [announce]);

  // Real-time polling for performance data
  const { data: livePerformance, isLoading: isPerformanceLoading } = useQuery({
    queryKey: ['agent-performance'],
    queryFn: async () => {
      return await refreshPerformance();
    },
    refetchInterval: 10000, // Poll every 10 seconds
    enabled: isActive
  });

  // Generate mock historical data for the chart
  const performanceData = useMemo(() => {
    const now = new Date();
    const data = [];
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const points = timeframe === '24h' ? 24 : days;
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i) * (timeframe === '24h' ? 3600000 : 86400000));
      data.push({
        timestamp,
        profitLoss: (performance?.totalProfitLoss || 0) * (i / points) + Math.random() * 100 - 50,
        trades: Math.floor(Math.random() * 5),
        winRate: 50 + Math.random() * 30,
        balance: 10000 + (performance?.totalProfitLoss || 0) * (i / points)
      });
    }
    return data;
  }, [performance, timeframe]);

  // Asset allocation data
  const assetAllocation = useMemo(() => [
    { name: 'ETH', value: 45, color: '#3b82f6' },
    { name: 'BTC', value: 30, color: '#f59e0b' },
    { name: 'USDC', value: 15, color: '#10b981' },
    { name: 'Other', value: 10, color: '#8b5cf6' }
  ], []);

  // Handle recommendation actions
  const handleApplyRecommendation = async (recommendation: AIRecommendation) => {
    try {
      await aiRecommendationsService.applyRecommendation(recommendation.id);
      
      if (recommendation.action) {
        switch (recommendation.action.type) {
          case 'strategy_update':
            await tradingAgentService.updateStrategy({
              ...strategy,
              ...recommendation.action.payload
            });
            break;
          case 'pause_agent':
            await tradingAgentService.disable();
            break;
          case 'rebalance':
            await tradingAgentService.forceRebalance?.();
            break;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDismissRecommendation = (recommendationId: string) => {
    aiRecommendationsService.dismissRecommendation(recommendationId);
  };

  const handleRefreshRecommendations = () => {
    setRecommendations(aiRecommendationsService.getRecommendations('pending'));
  };

  // Hero status bar handlers
  const handlePauseAgent = async () => {
    await tradingAgentService.disable();
  };

  const handleResumeAgent = async () => {
    await tradingAgentService.enable();
  };

  const handleOpenSettings = () => {
    // Navigate to settings or open settings modal
    console.log('Open settings');
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.01 : 0.1,
        delayChildren: prefersReducedMotion ? 0.01 : 0.1
      }
    }
  };

  const zoneVariants = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.4 }
  };

  return (
    <AppLayout>
      {/* Skip Links */}
      <SkipLinksComponent />
      
      {/* Live Region for Announcements */}
      <LiveRegionComponent />
      
      {/* Toast Notifications */}
      <Toaster />
      
      {/* Main Dashboard Container */}
      <motion.div
        className="dashboard-layout space-y-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Zone 1: Hero Status Bar */}
        <motion.div variants={zoneVariants}>
          <AccessibleSection
            id="hero-section"
            title="Agent Status and Key Metrics"
            description="Current status of your AI trading agent and key performance metrics"
            level={1}
            className="zone-hero"
          >
            <HeroErrorBoundary>
              <HeroStatusBar
                isActive={isActive}
                canExecuteTrades={canExecuteTrades}
                strategy={strategy}
                totalProfitLoss={livePerformance?.totalProfitLoss || performance?.totalProfitLoss || 0}
                winRate={livePerformance?.winRate || performance?.winRate || 0}
                change24h={2.3} // Mock 24h change
                lastAction={
                  isActive ? {
                    type: 'Portfolio optimization',
                    timestamp: new Date(Date.now() - 120000) // 2 minutes ago
                  } : undefined
                }
                onPause={handlePauseAgent}
                onResume={handleResumeAgent}
                onSettings={handleOpenSettings}
              />
            </HeroErrorBoundary>
          </AccessibleSection>
        </motion.div>

        {/* Zone 2: Performance Overview */}
        <motion.div variants={zoneVariants}>
          <AccessibleSection
            id="performance-section"
            title="Performance Overview"
            description="Charts and metrics showing your agent's trading performance over time"
            level={2}
            className="zone-performance"
          >
            <PerformanceErrorBoundary>
              <PerformanceOverviewIntegrated
                data={performanceData}
                assetAllocation={assetAllocation}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                isLoading={isPerformanceLoading}
              />
            </PerformanceErrorBoundary>
          </AccessibleSection>
        </motion.div>

        {/* Zone 3: AI Intelligence Layer (Conditional) */}
        {recommendations.length > 0 && (
          <motion.div variants={zoneVariants}>
            <AccessibleSection
              title="AI Recommendations"
              description="Intelligent recommendations from your AI trading agent"
              level={2}
              className="zone-ai-layer"
            >
              <AILayerErrorBoundary>
                <AIIntelligenceLayer
                  recommendations={recommendations}
                  onApplyRecommendation={handleApplyRecommendation}
                  onDismissRecommendation={handleDismissRecommendation}
                  onRefresh={handleRefreshRecommendations}
                  maxVisible={3}
                />
              </AILayerErrorBoundary>
            </AccessibleSection>
          </motion.div>
        )}

        {/* Zone 4: Control & Analysis Grid */}
        <motion.div variants={zoneVariants}>
          <AccessibleSection
            id="controls-section"
            title="Agent Controls and Analysis"
            description="Control your trading agent and view detailed analysis"
            level={2}
          >
            {isMobile ? (
              /* 
               * Mobile Layout: Tabbed Interface
               * 
               * Rationale: On mobile screens (<768px), the 3-column asymmetric grid
               * would be too cramped. Instead, we use a tabbed interface that:
               * 
               * 1. Maintains access to all functionality
               * 2. Optimizes for touch interaction
               * 3. Saves vertical space
               * 4. Prioritizes most common actions
               * 
               * Tab Order Priority:
               * - Controls: Primary actions (pause, strategy, manual trades)
               * - AI Insights: Decision support (market analysis, confidence)
               * - History: Reference information (audit trail, past actions)
               * 
               * This order reflects typical mobile usage patterns where users
               * want quick access to controls, then insights for decisions,
               * and history for reference.
               */
              <div className="zone-controls-tabs">
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
                    <ControlsErrorBoundary>
                      <AgentControls />
                    </ControlsErrorBoundary>
                  </TabsContent>
                  
                  <TabsContent value="insights" className="mt-6">
                    <ControlsErrorBoundary>
                      {tokenPair ? (
                        <AIInsightsPanel 
                          tokenPair={tokenPair}
                          className="h-full"
                        />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400">Select tokens in the swap interface</p>
                          <p className="text-sm text-gray-500 mt-1">to view AI market insights</p>
                        </div>
                      )}
                    </ControlsErrorBoundary>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-6">
                    <ControlsErrorBoundary>
                      <AgentAuditTrail />
                    </ControlsErrorBoundary>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* 
               * Desktop/Tablet Layout: Asymmetric Grid System
               * 
               * This is a temporary implementation using Tailwind classes.
               * The final implementation should use the CSS Grid system defined
               * in dashboard-layout.css with the asymmetric proportions:
               * 
               * Desktop (≥1280px): 2fr 1fr 1.5fr (40% : 20% : 30% + gaps)
               * - Controls: 40% width - Needs space for form elements, dropdowns
               * - Trail: 20% width - Compact list items, minimal space needed  
               * - Insights: 30% width - Charts and metrics, medium space optimal
               * 
               * Tablet (768-1279px): Stacked layout
               * - Controls: Full width (priority for primary actions)
               * - Trail + Insights: 50/50 split (equal secondary importance)
               * 
               * Each column is wrapped in ErrorBoundary for graceful degradation
               * if any individual component fails.
               */
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="zone-controls xl:col-span-1">
                  <ControlsErrorBoundary>
                    <AgentControls />
                  </ControlsErrorBoundary>
                </div>

                <div className="zone-insights xl:col-span-1">
                  <ControlsErrorBoundary>
                    {tokenPair ? (
                      <AIInsightsPanel 
                        tokenPair={tokenPair}
                        className="h-full"
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Select tokens in the swap interface</p>
                        <p className="text-sm text-gray-500 mt-1">to view AI market insights</p>
                      </div>
                    )}
                  </ControlsErrorBoundary>
                </div>

                <div className="zone-trail xl:col-span-1">
                  <ControlsErrorBoundary>
                    <AgentAuditTrail />
                  </ControlsErrorBoundary>
                </div>
              </div>
            )}
          </AccessibleSection>
        </motion.div>

        {/* Zone 5: Extended Analytics */}
        {performance && performance.totalTrades > 0 && (
          <motion.div variants={zoneVariants}>
            <AccessibleSection
              id="analytics-section"
              title="Extended Analytics"
              description="Detailed performance analysis and historical metrics"
              level={2}
              className="zone-analytics"
            >
              <AnalyticsErrorBoundary>
                <ExtendedAnalyticsZone
                  performance={livePerformance || performance}
                  lazyLoad={true}
                />
              </AnalyticsErrorBoundary>
            </AccessibleSection>
          </motion.div>
        )}
      </motion.div>
      
      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-400">
          <div>CLS: {cls.toFixed(4)}</div>
          <div>Reduced Motion: {prefersReducedMotion ? 'Yes' : 'No'}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
        </div>
      )}
    </AppLayout>
  );
};

export default AgentDashboardPageRedesigned;