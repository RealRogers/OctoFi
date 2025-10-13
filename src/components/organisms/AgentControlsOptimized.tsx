/**
 * AgentControlsOptimized Component
 * Optimized version of AgentControls for the wider column in asymmetric grid (40% width)
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Settings, 
  BarChart3, 
  AlertCircle, 
  Zap, 
  RefreshCcw, 
  Loader2,
  Shield,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { TradingStrategy, AgentAction } from '@/services/types';
import { tradingAgentService } from '@/services/tradingAgentService';
import { useTradingAgentStore, useAppStore } from '@/services/store';
import { useToast } from '@/components/ui/use-toast';
import AgentToggle from '@/components/atoms/AgentToggle';
import StrategySelector from '@/components/atoms/StrategySelector';
import PerformanceMetrics from '@/components/atoms/PerformanceMetrics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AgentControlsOptimizedProps {
  className?: string;
}

const AgentControlsOptimized: React.FC<AgentControlsOptimizedProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);

  const { 
    isActive, 
    strategy, 
    performance, 
    setActive, 
    setStrategy, 
    setPerformance 
  } = useTradingAgentStore();

  const { isWalletConnected } = useAppStore();
  const { toast } = useToast();

  // Sync with service state
  useEffect(() => {
    setActive(tradingAgentService.isActive);
    setStrategy(tradingAgentService.strategy);
    setPerformance(tradingAgentService.performance);
  }, [setActive, setStrategy, setPerformance]);

  // Subscribe to agent actions
  useEffect(() => {
    const subscription = tradingAgentService.subscribeToActions((action) => {
      if (action.type === 'resume' && action.result === 'success') {
        setActive(true);
      } else if (action.type === 'pause' && action.result === 'success') {
        setActive(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setActive]);

  const handleToggleAgent = async (active: boolean) => {
    if (!isWalletConnected) {
      setError('Please connect your wallet to use the trading agent');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (active) {
        await tradingAgentService.enable(strategy || getDefaultStrategy());
      } else {
        await tradingAgentService.disable();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle agent';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategyChange = async (newStrategy: TradingStrategy) => {
    setIsLoading(true);
    setError(null);

    try {
      await tradingAgentService.updateStrategy(newStrategy);
      setStrategy(newStrategy);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update strategy';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultStrategy = (): TradingStrategy => ({
    riskTolerance: 'moderate',
    maxSlippage: 1.0,
    stopLoss: 0.05,
    takeProfit: 0.15,
    rebalanceThreshold: 0.02
  });

  const handleOptimizePortfolio = async () => {
    setIsOptimizing(true);
    setError(null);

    toast({
      title: "🔄 Starting Optimization",
      description: "AI agent is analyzing your portfolio for optimization opportunities...",
      variant: "default",
    });

    try {
      await tradingAgentService.optimizePortfolio?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize portfolio';
      setError(errorMessage);
      
      toast({
        title: "❌ Optimization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleForceRebalance = async () => {
    setIsRebalancing(true);
    setError(null);

    toast({
      title: "🔄 Starting Rebalance",
      description: "AI agent is rebalancing your portfolio to target allocation...",
      variant: "default",
    });

    try {
      await tradingAgentService.forceRebalance?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rebalance portfolio';
      setError(errorMessage);
      
      toast({
        title: "❌ Rebalancing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRebalancing(false);
    }
  };

  return (
    <Card className={cn('glass-card h-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            Agent Controls
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                ACTIVE
              </Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Wallet Connection Warning */}
        {!isWalletConnected && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                Connect your wallet to enable the trading agent
              </span>
            </div>
          </div>
        )}

        {/* Agent Toggle Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Agent Status</span>
          </div>
          <AgentToggle
            isActive={isActive}
            isLoading={isLoading}
            disabled={!isWalletConnected}
            onToggle={handleToggleAgent}
          />
        </div>

        {/* Strategy Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Trading Strategy</span>
          </div>
          <StrategySelector
            strategy={strategy || getDefaultStrategy()}
            onStrategyChange={handleStrategyChange}
            disabled={isLoading || !isWalletConnected}
          />
        </div>

        {/* Risk Limits Section */}
        {strategy && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Risk Limits</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Max Trade Size</div>
                <div className="text-sm font-medium text-white">
                  ${(strategy.maxSlippage * 1000).toFixed(0)}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                <div className="text-sm font-medium text-white">
                  {(strategy.stopLoss * 100).toFixed(1)}%
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Take Profit</div>
                <div className="text-sm font-medium text-white">
                  {(strategy.takeProfit * 100).toFixed(1)}%
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Rebalance Threshold</div>
                <div className="text-sm font-medium text-white">
                  {(strategy.rebalanceThreshold * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics Section */}
        {performance && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Performance Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <div className="text-xs text-gray-400">Total P&L</div>
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  performance.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  ${performance.totalProfitLoss.toFixed(2)}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-sm font-medium text-white">
                  {performance.winRate.toFixed(1)}%
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3 h-3 text-purple-400" />
                  <div className="text-xs text-gray-400">Total Trades</div>
                </div>
                <div className="text-sm font-medium text-white">
                  {performance.totalTrades}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-3 h-3 text-orange-400" />
                  <div className="text-xs text-gray-400">Sharpe Ratio</div>
                </div>
                <div className="text-sm font-medium text-white">
                  {performance.sharpeRatio?.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Actions Section */}
        {isActive && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Manual Actions</span>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleOptimizePortfolio}
                disabled={isOptimizing || isRebalancing || !isWalletConnected}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                size="sm"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing Portfolio...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Portfolio Now
                  </>
                )}
              </Button>

              <Button
                onClick={handleForceRebalance}
                disabled={isOptimizing || isRebalancing || !isWalletConnected}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                size="sm"
              >
                {isRebalancing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rebalancing Portfolio...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Force Rebalance
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Manually trigger portfolio optimization or force immediate rebalancing to target allocation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentControlsOptimized;