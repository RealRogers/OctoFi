/**
 * AIRecommendationsCard Molecule Component
 * Displays AI-generated trading recommendations with priority-based styling and actions
 */

import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  X,
  Clock,
  Brain,
  Settings,
  Target,
  BarChart3,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { 
  AIRecommendation, 
  RecommendationPriority, 
  RecommendationCategory,
  RecommendationStatus 
} from '@/services/types'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface AIRecommendationsCardProps {
  recommendations: AIRecommendation[]
  onApplyRecommendation: (recommendation: AIRecommendation) => Promise<void>
  onDismissRecommendation: (recommendationId: string) => void
  onRefresh?: () => void
  className?: string
  maxVisible?: number
  showFilters?: boolean
}

const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({
  recommendations,
  onApplyRecommendation,
  onDismissRecommendation,
  onRefresh,
  className,
  maxVisible = 5,
  showFilters = true
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<RecommendationPriority | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<RecommendationCategory | 'all'>('all')
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Filter recommendations
  const filteredRecommendations = recommendations
    .filter(rec => rec.status === 'pending') // Only show pending recommendations
    .filter(rec => filterPriority === 'all' || rec.priority === filterPriority)
    .filter(rec => filterCategory === 'all' || rec.category === filterCategory)
    .sort((a, b) => {
      // Sort by priority (critical > high > medium > low)
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .slice(0, maxVisible)

  const handleApply = async (recommendation: AIRecommendation) => {
    if (!recommendation.action?.autoApplicable) {
      toast({
        title: "Manual Action Required",
        description: "This recommendation requires manual review and cannot be auto-applied",
        variant: "default",
      })
      return
    }

    setApplyingIds(prev => new Set(prev).add(recommendation.id))

    try {
      await onApplyRecommendation(recommendation)
      
      toast({
        title: "✅ Recommendation Applied",
        description: `Successfully applied: ${recommendation.title}`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "❌ Application Failed",
        description: error instanceof Error ? error.message : 'Failed to apply recommendation',
        variant: "destructive",
      })
    } finally {
      setApplyingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(recommendation.id)
        return newSet
      })
    }
  }

  const handleDismiss = (recommendationId: string) => {
    onDismissRecommendation(recommendationId)
    toast({
      title: "Recommendation Dismissed",
      description: "The recommendation has been dismissed",
      variant: "default",
    })
  }

  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getCategoryIcon = (category: RecommendationCategory) => {
    switch (category) {
      case 'strategy': return <Settings className="w-4 h-4" />
      case 'risk': return <Shield className="w-4 h-4" />
      case 'opportunity': return <Target className="w-4 h-4" />
      case 'optimization': return <BarChart3 className="w-4 h-4" />
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'increase': return <TrendingUp className="w-3 h-3 text-green-400" />
      case 'decrease': return <TrendingDown className="w-3 h-3 text-red-400" />
      case 'neutral': return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  return (
    <Card className={cn('glass-card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Recommendations
            {filteredRecommendations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredRecommendations.length}
              </Badge>
            )}
          </CardTitle>
          
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && filteredRecommendations.length > 0 && (
          <div className="flex gap-2 mt-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white"
            >
              <option value="all">All Categories</option>
              <option value="strategy">Strategy</option>
              <option value="risk">Risk</option>
              <option value="opportunity">Opportunity</option>
              <option value="optimization">Optimization</option>
            </select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No recommendations available</p>
            <p className="text-sm text-gray-500 mt-1">
              AI is analyzing market conditions for new recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="glass-card p-4 rounded-lg border-l-4 border-l-purple-500"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 glass-card rounded-lg">
                      {getCategoryIcon(recommendation.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white text-sm">
                          {recommendation.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getPriorityColor(recommendation.priority))}
                        >
                          {recommendation.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-2">
                        {recommendation.message}
                      </p>
                      
                      {/* Confidence Score */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400">Confidence:</span>
                        <Progress 
                          value={recommendation.confidence} 
                          className="h-1.5 w-16 bg-gray-800"
                        />
                        <span className="text-xs text-gray-300">
                          {recommendation.confidence}%
                        </span>
                      </div>

                      {/* Impact Indicators */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Risk:</span>
                          {getImpactIcon(recommendation.impact.risk)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Return:</span>
                          {getImpactIcon(recommendation.impact.return)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Complexity:</span>
                          <span className={cn(
                            'capitalize',
                            recommendation.impact.complexity === 'low' ? 'text-green-400' :
                            recommendation.impact.complexity === 'medium' ? 'text-yellow-400' :
                            'text-red-400'
                          )}>
                            {recommendation.impact.complexity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-3">
                    {recommendation.action?.autoApplicable && (
                      <Button
                        size="sm"
                        onClick={() => handleApply(recommendation)}
                        disabled={applyingIds.has(recommendation.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3"
                      >
                        {applyingIds.has(recommendation.id) ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Apply
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(recommendation.id)}
                      className="h-8 w-8 p-0 hover:bg-red-500/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(
                        expandedId === recommendation.id ? null : recommendation.id
                      )}
                      className="h-8 w-8 p-0"
                    >
                      {expandedId === recommendation.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === recommendation.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-400">Rationale:</span>
                        <ul className="mt-1 space-y-1">
                          {recommendation.rationale.map((reason, index) => (
                            <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {recommendation.expiresAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          Expires: {recommendation.expiresAt.toLocaleString()}
                        </div>
                      )}
                      
                      {!recommendation.action?.autoApplicable && (
                        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          Manual review required - cannot be auto-applied
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AIRecommendationsCard