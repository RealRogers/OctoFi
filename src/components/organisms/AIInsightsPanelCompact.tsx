/**
 * AIInsightsPanelCompact Component
 * Compact version of AIInsightsPanel optimized for medium column (30% width)
 */

import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Shield,
  Bot,
  Activity
} from 'lucide-react';
import { TokenPair, MarketPrediction, RiskScore, SwapParameters, SentimentAnalysis } from '@/services/types';
import { aiInsightsService } from '@/services';
import { useSwapStore, useAppStore } from '@/services/store';
import PredictionCard from '@/components/atoms/PredictionCard';
import RiskIndicator from '@/components/atoms/RiskIndicator';
import ConfidenceScore from '@/components/atoms/ConfidenceScore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AIInsightsPanelCompactProps {
  tokenPair?: TokenPair;
  swapParams?: SwapParameters;
  className?: string;
}

const AIInsightsPanelCompact: React.FC<AIInsightsPanelCompactProps> = ({
  tokenPair,
  swapParams,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);

  const { 
    currentPrediction, 
    riskAssessment, 
    setPrediction, 
    setRiskAssessment,
    addAIUpdate 
  } = useSwapStore();
  
  const { isAIServiceAvailable } = useAppStore();

  // Fetch AI insights when token pair changes
  useEffect(() => {
    if (tokenPair && isAIServiceAvailable) {
      fetchAIInsights();
    }
  }, [tokenPair, isAIServiceAvailable]);

  // Subscribe to AI updates
  useEffect(() => {
    if (!isAIServiceAvailable) return;

    const subscription = aiInsightsService.subscribeToUpdates((update) => {
      addAIUpdate(update);
      setLastUpdate(new Date());
      
      if (update.type === 'prediction' && update.data) {
        setPrediction(update.data);
      }
    });

    return () => subscription.unsubscribe();
  }, [isAIServiceAvailable, addAIUpdate, setPrediction]);

  const fetchAIInsights = async () => {
    if (!tokenPair) return;

    setIsLoading(true);
    setError(null);

    try {
      const [prediction, risk, sentimentData] = await Promise.all([
        aiInsightsService.getPrediction(tokenPair),
        swapParams ? aiInsightsService.getRiskAssessment(swapParams) : Promise.resolve(null),
        aiInsightsService.getSentiment?.(tokenPair) || Promise.resolve(null)
      ]);

      setPrediction(prediction);
      if (risk) {
        setRiskAssessment(risk);
      }
      if (sentimentData) {
        setSentiment(sentimentData);
      }
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AI insights';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (tokenPair) {
      fetchAIInsights();
    }
  };

  const getPredictionColor = (direction?: string) => {
    switch (direction) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPredictionIcon = (direction?: string) => {
    switch (direction) {
      case 'bullish': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'bearish': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default: return <Activity className="w-3 h-3 text-gray-400" />;
    }
  };

  // Don't render if AI service is not available
  if (!isAIServiceAvailable) {
    return (
      <Card className={cn('glass-card h-full', className)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-xs text-red-400">AI service unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render if no token pair is selected
  if (!tokenPair) {
    return (
      <Card className={cn('glass-card h-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="w-4 h-4 text-blue-400" />
            AI Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <Bot className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Select tokens</p>
            <p className="text-xs text-gray-500">to view insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-card h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-blue-400" />
            AI Insights
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                {lastUpdate.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
              ) : (
                <RefreshCw className="w-3 h-3 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error State */}
        {error && (
          <div className="text-center py-4">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-xs text-red-400">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="mt-2 text-xs"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !currentPrediction && (
          <div className="text-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Analyzing market...</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (currentPrediction || riskAssessment) && (
          <div className="space-y-4">
            {/* Prediction Summary */}
            {currentPrediction && (
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPredictionIcon(currentPrediction.direction)}
                    <span className="text-xs font-medium text-gray-400">Prediction</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      currentPrediction.direction === 'bullish' ? 'border-green-500/30 text-green-400' :
                      currentPrediction.direction === 'bearish' ? 'border-red-500/30 text-red-400' :
                      'border-gray-500/30 text-gray-400'
                    )}
                  >
                    {currentPrediction.direction}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Confidence</span>
                    <span className="text-xs font-medium text-white">
                      {currentPrediction.confidence}%
                    </span>
                  </div>
                  <Progress 
                    value={currentPrediction.confidence} 
                    className="h-1.5 bg-gray-800"
                  />
                  
                  {currentPrediction.priceTarget && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Target</span>
                      <span className="text-xs font-medium text-white">
                        ${currentPrediction.priceTarget.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Risk Assessment */}
            {riskAssessment && (
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-medium text-gray-400">Risk Level</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Overall Risk</span>
                    <Badge 
                      variant="outline"
                      className={cn(
                        'text-xs',
                        riskAssessment.overall === 'low' ? 'border-green-500/30 text-green-400' :
                        riskAssessment.overall === 'medium' ? 'border-yellow-500/30 text-yellow-400' :
                        'border-red-500/30 text-red-400'
                      )}
                    >
                      {riskAssessment.overall}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidity:</span>
                      <span className="text-white">{riskAssessment.liquidity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volatility:</span>
                      <span className="text-white">{riskAssessment.volatility}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sentiment Breakdown */}
            {sentiment && (
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-medium text-gray-400">Sentiment Analysis</span>
                </div>
                
                <div className="space-y-2">
                  <TooltipProvider>
                    {/* Social Sentiment */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Users className="w-2.5 h-2.5 text-blue-400" />
                          <span className="text-xs text-gray-400">Social</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-2 h-2 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Social media sentiment</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="text-xs text-white">
                          {((sentiment.factors.social + 1) * 50).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={(sentiment.factors.social + 1) * 50} 
                        className="h-1 bg-gray-800"
                      />
                    </div>

                    {/* Technical Analysis */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                          <span className="text-xs text-gray-400">Technical</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-2 h-2 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Technical indicators</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="text-xs text-white">
                          {((sentiment.factors.technical + 1) * 50).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={(sentiment.factors.technical + 1) * 50} 
                        className="h-1 bg-gray-800"
                      />
                    </div>

                    {/* Fundamental Analysis */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-2.5 h-2.5 text-orange-400" />
                          <span className="text-xs text-gray-400">Fundamental</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-2 h-2 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Project fundamentals</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="text-xs text-white">
                          {((sentiment.factors.fundamental + 1) * 50).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={(sentiment.factors.fundamental + 1) * 50} 
                        className="h-1 bg-gray-800"
                      />
                    </div>
                  </TooltipProvider>

                  {/* Overall Sentiment */}
                  <div className="pt-2 border-t border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Overall</span>
                    <Badge 
                      variant="outline"
                      className={cn(
                        'text-xs',
                        sentiment.sentiment === 'positive' ? 'border-green-500/30 text-green-400' :
                        sentiment.sentiment === 'negative' ? 'border-red-500/30 text-red-400' :
                        'border-gray-500/30 text-gray-400'
                      )}
                    >
                      {sentiment.sentiment}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !currentPrediction && !riskAssessment && (
          <div className="text-center py-6">
            <Brain className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No insights available</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="mt-2 text-xs"
            >
              Refresh Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanelCompact;