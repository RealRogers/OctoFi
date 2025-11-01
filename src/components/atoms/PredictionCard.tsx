/**
 * PredictionCard Atom Component
 * Displays AI market predictions with confidence scores and rationale
 */

import React from 'react'
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle } from 'lucide-react'
import { MarketPrediction } from '@/services/types'
import { cn } from '@/lib/utils'

interface PredictionCardProps {
  prediction: MarketPrediction
  className?: string
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, className }) => {
  const getDirectionIcon = () => {
    switch (prediction.direction) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getDirectionColor = () => {
    switch (prediction.direction) {
      case 'bullish':
        return 'text-green-500'
      case 'bearish':
        return 'text-red-500'
      case 'neutral':
        return 'text-gray-400'
    }
  }

  const getDirectionBg = () => {
    switch (prediction.direction) {
      case 'bullish':
        return 'bg-green-500/10 border-green-500/20'
      case 'bearish':
        return 'bg-red-500/10 border-red-500/20'
      case 'neutral':
        return 'bg-gray-500/10 border-gray-500/20'
    }
  }

  const getRiskColor = () => {
    switch (prediction.riskLevel) {
      case 'low':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'high':
        return 'text-red-400'
    }
  }

  return (
    <div className={cn(
      'rounded-lg border p-4 space-y-3',
      getDirectionBg(),
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">AI Prediction</span>
        </div>
        <div className="flex items-center gap-1">
          {getDirectionIcon()}
          <span className={cn('text-sm font-semibold capitalize', getDirectionColor())}>
            {prediction.direction}
          </span>
        </div>
      </div>

      {/* Confidence and Expected Change */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Confidence</div>
          <div className="text-lg font-bold text-white">{prediction.confidence}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Expected Change</div>
          <div className={cn('text-lg font-bold', getDirectionColor())}>
            {prediction.expectedPriceChange > 0 ? '+' : ''}{prediction.expectedPriceChange.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Risk Level</span>
        <div className="flex items-center gap-1">
          {prediction.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 text-red-400" />}
          <span className={cn('text-xs font-medium capitalize', getRiskColor())}>
            {prediction.riskLevel}
          </span>
        </div>
      </div>

      {/* Timeframe */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Timeframe</span>
        <span className="text-xs text-gray-300">{prediction.timeframe}</span>
      </div>

      {/* Rationale (collapsible) */}
      {prediction.rationale.length > 0 && (
        <details className="group">
          <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
            View Analysis Details
          </summary>
          <div className="mt-2 space-y-1">
            {prediction.rationale.map((reason, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

export default PredictionCard