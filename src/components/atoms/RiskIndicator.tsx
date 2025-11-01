/**
 * RiskIndicator Atom Component
 * Visual risk assessment display with color-coded indicators
 */

import React from 'react'
import { Shield, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { RiskScore } from '@/services/types'
import { cn } from '@/lib/utils'

interface RiskIndicatorProps {
  riskScore: RiskScore
  className?: string
  compact?: boolean
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ 
  riskScore, 
  className, 
  compact = false 
}) => {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return 'low'
    if (score <= 70) return 'medium'
    return 'high'
  }

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400'
    if (score <= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskBg = (score: number) => {
    if (score <= 30) return 'bg-green-500/10 border-green-500/20'
    if (score <= 70) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  const getRiskIcon = (score: number) => {
    if (score <= 30) return <Shield className="w-4 h-4 text-green-400" />
    if (score <= 70) return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    return <AlertCircle className="w-4 h-4 text-red-400" />
  }

  const riskLevel = getRiskLevel(riskScore.overall)

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {getRiskIcon(riskScore.overall)}
        <span className={cn('text-sm font-medium', getRiskColor(riskScore.overall))}>
          {riskScore.overall}/100
        </span>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-lg border p-4 space-y-3',
      getRiskBg(riskScore.overall),
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Risk Assessment</span>
        </div>
        <div className="flex items-center gap-2">
          {getRiskIcon(riskScore.overall)}
          <span className={cn('text-sm font-semibold capitalize', getRiskColor(riskScore.overall))}>
            {riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {riskScore.overall}/100
        </div>
        <div className="text-xs text-gray-400">Overall Risk Score</div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 mb-2">Risk Factors</div>
        
        {Object.entries(riskScore.factors).map(([factor, score]) => (
          <div key={factor} className="flex items-center justify-between">
            <span className="text-xs text-gray-300 capitalize">
              {factor === 'smartContract' ? 'Smart Contract' : factor}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full transition-all duration-300',
                    score <= 30 ? 'bg-green-400' : score <= 70 ? 'bg-yellow-400' : 'bg-red-400'
                  )}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
              <span className={cn(
                'text-xs font-medium w-8 text-right',
                getRiskColor(score)
              )}>
                {score}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {riskScore.recommendations.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400">Recommendations</div>
          <div className="space-y-1">
            {riskScore.recommendations.map((recommendation, index) => (
              <div key={index} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RiskIndicator