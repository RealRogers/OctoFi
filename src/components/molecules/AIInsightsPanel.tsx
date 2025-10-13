/**
 * AIInsightsPanel Molecule Component
 * Displays comprehensive AI insights including predictions, risk assessment, and confidence scores
 */

import React, { useEffect, useState } from 'react'
import { Brain, Loader2, AlertCircle, RefreshCw, TrendingUp, Users, BarChart3, Shield } from 'lucide-react'
import { TokenPair, MarketPrediction, RiskScore, SwapParameters, SentimentAnalysis } from '@/services/types'
import { aiInsightsService } from '@/services'
import { useSwapStore, useAppStore } from '@/services/store'
import PredictionCard from '@/components/atoms/PredictionCard'
import RiskIndicator from '@/components/atoms/RiskIndicator'
import ConfidenceScore from '@/components/atoms/ConfidenceScore'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AIInsightsPanelProps {
  tokenPair?: TokenPair
  swapParams?: SwapParameters
  className?: string
  compact?: boolean
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  tokenPair,
  swapParams,
  className,
  compact = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null)

  const { 
    currentPrediction, 
    riskAssessment, 
    setPrediction, 
    setRiskAssessment,
    addAIUpdate 
  } = useSwapStore()
  
  const { isAIServiceAvailable } = useAppStore()

  // Fetch AI insights when token pair changes
  useEffect(() => {
    if (tokenPair && isAIServiceAvailable) {
      fetchAIInsights()
    }
  }, [tokenPair, isAIServiceAvailable])

  // Subscribe to AI updates
  useEffect(() => {
    if (!isAIServiceAvailable) return

    const subscription = aiInsightsService.subscribeToUpdates((update) => {
      addAIUpdate(update)
      setLastUpdate(new Date())
      
      // Update prediction if it's a prediction update
      if (update.type === 'prediction' && update.data) {
        setPrediction(update.data)
      }
    })

    return () => subscription.unsubscribe()
  }, [isAIServiceAvailable, addAIUpdate, setPrediction])

  const fetchAIInsights = async () => {
    if (!tokenPair) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch prediction, risk assessment, and sentiment in parallel
      const [prediction, risk, sentimentData] = await Promise.all([
        aiInsightsService.getPrediction(tokenPair),
        swapParams ? aiInsightsService.getRiskAssessment(swapParams) : Promise.resolve(null),
        aiInsightsService.getSentiment?.(tokenPair) || Promise.resolve(null)
      ])

      setPrediction(prediction)
      if (risk) {
        setRiskAssessment(risk)
      }
      if (sentimentData) {
        setSentiment(sentimentData)
      }
      setLastUpdate(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AI insights'
      setError(errorMessage)
      console.error('AI Insights error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    if (tokenPair) {
      fetchAIInsights()
    }
  }

  // Don't render if AI service is not available
  if (!isAIServiceAvailable) {
    return (
      <div className={cn(
        'rounded-lg border border-gray-700 bg-gray-800/50 p-4',
        className
      )}>
        <div className="flex items-center gap-2 text-gray-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">AI insights temporarily unavailable</span>
        </div>
      </div>
    )
  }

  // Don't render if no token pair is selected
  if (!tokenPair) {
    return (
      <div className={cn(
        'rounded-lg border border-gray-700 bg-gray-800/50 p-4',
        className
      )}>
        <div className="flex items-center gap-2 text-gray-400">
          <Brain className="w-4 h-4" />
          <span className="text-sm">Select tokens to view AI insights</span>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={cn(
        'rounded-lg border border-gray-700 bg-gray-800/50 p-3',
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">AI Insights</span>
          </div>
          
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <button
              onClick={handleRefresh}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>

        {error ? (
          <div className="mt-2 text-xs text-red-400">{error}</div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            {currentPrediction && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Prediction:</span>
                <span className={cn(
                  'text-xs font-medium capitalize',
                  currentPrediction.direction === 'bullish' ? 'text-green-400' :
                  currentPrediction.direction === 'bearish' ? 'text-red-400' : 'text-gray-400'
                )}>
                  {currentPrediction.direction}
                </span>
              </div>
            )}
            
            {riskAssessment && (
              <RiskIndicator riskScore={riskAssessment} compact />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-lg border border-gray-700 bg-gray-800/50 p-4 space-y-4',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI Market Insights</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-gray-400">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <RefreshCw className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !currentPrediction && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-gray-400">Analyzing market conditions...</span>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (currentPrediction || riskAssessment) && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Prediction Card */}
            {currentPrediction && (
              <div className="space-y-3">
                <PredictionCard prediction={currentPrediction} />
                <div className="flex justify-center">
                  <ConfidenceScore 
                    confidence={currentPrediction.confidence}
                    label="AI Confidence"
                    size="md"
                  />
                </div>
              </div>
            )}

            {/* Risk Assessment */}
            {riskAssessment && (
              <RiskIndicator riskScore={riskAssessment} />
            )}
          </div>

          {/* AI Confidence Breakdown */}
          {sentiment && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-semibold text-white">AI Analysis Breakdown</h4>
              </div>
              
              <div className="space-y-3">
                <TooltipProvider>
                  {/* Social Factor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs text-gray-300">Social Sentiment</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="w-3 h-3 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Based on social media, forums, and community activity</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-xs font-medium text-white">
                        {((sentiment.factors.social + 1) * 50).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={(sentiment.factors.social + 1) * 50} 
                      className="h-2 bg-gray-800"
                    />
                  </div>

                  {/* Technical Factor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-gray-300">Technical Analysis</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="w-3 h-3 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Based on price patterns, indicators, and chart analysis</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-xs font-medium text-white">
                        {((sentiment.factors.technical + 1) * 50).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={(sentiment.factors.technical + 1) * 50} 
                      className="h-2 bg-gray-800"
                    />
                  </div>

                  {/* Fundamental Factor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs text-gray-300">Fundamental Metrics</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="w-3 h-3 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Based on tokenomics, team, roadmap, and project fundamentals</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-xs font-medium text-white">
                        {((sentiment.factors.fundamental + 1) * 50).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={(sentiment.factors.fundamental + 1) * 50} 
                      className="h-2 bg-gray-800"
                    />
                  </div>
                </TooltipProvider>

                {/* Overall Sentiment */}
                <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Overall Sentiment</span>
                  </div>
                  <span className={cn(
                    'text-sm font-bold capitalize',
                    sentiment.sentiment === 'positive' ? 'text-green-400' :
                    sentiment.sentiment === 'negative' ? 'text-red-400' : 'text-gray-400'
                  )}>
                    {sentiment.sentiment}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && !currentPrediction && !riskAssessment && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No AI insights available</p>
          <p className="text-sm text-gray-500 mt-1">
            Try refreshing or check your token selection
          </p>
        </div>
      )}
    </div>
  )
}

export default AIInsightsPanel