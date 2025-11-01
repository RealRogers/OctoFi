/**
 * useRecommendations Hook
 * 
 * Manages AI recommendations state and actions.
 * Fixes the broken recommendations logic from the original component.
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { aiRecommendationsService } from '@/services/aiRecommendationsService'
import { tradingAgentService } from '@/services/tradingAgentService'
import type { 
  AIRecommendation, 
  TradingStrategy, 
  PerformanceMetrics 
} from '@/services/types'
import { handleDashboardError } from '@/utils/errorHandling'
import { validateRecommendation } from '@/utils/validators'
import { TOAST_DURATIONS } from '@/constants/dashboard'

/**
 * Options for the useRecommendations hook
 */
export interface UseRecommendationsOptions {
  strategy?: TradingStrategy
  performance?: PerformanceMetrics
  autoGenerate?: boolean
}

/**
 * Return type for the useRecommendations hook
 */
export interface UseRecommendationsReturn {
  recommendations: AIRecommendation[]
  isLoading: boolean
  error: Error | null
  applyRecommendation: (id: string) => Promise<void>
  dismissRecommendation: (id: string) => void
  refreshRecommendations: () => void
}

/**
 * Custom hook for managing AI recommendations
 * 
 * Subscribes to recommendation updates, generates recommendations based on
 * strategy and performance, and provides actions to apply or dismiss them.
 * 
 * @param options - Configuration options
 * @returns Recommendations state and actions
 * 
 * @example
 * ```typescript
 * function Dashboard() {
 *   const { strategy, performance } = useTradingAgent()
 *   const {
 *     recommendations,
 *     isLoading,
 *     applyRecommendation,
 *     dismissRecommendation
 *   } = useRecommendations({ strategy, performance })
 *   
 *   return (
 *     <div>
 *       {recommendations.map(rec => (
 *         <RecommendationCard
 *           key={rec.id}
 *           recommendation={rec}
 *           onApply={() => applyRecommendation(rec.id)}
 *           onDismiss={() => dismissRecommendation(rec.id)}
 *         />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useRecommendations(
  options: UseRecommendationsOptions = {}
): UseRecommendationsReturn {
  const { strategy, performance, autoGenerate = true } = options
  const { toast } = useToast()
  
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Subscribe to recommendation updates from the service
  useEffect(() => {
    setIsLoading(true)
    
    const unsubscribe = aiRecommendationsService.subscribe((newRecommendations) => {
      // Validate recommendations before setting state
      const validRecommendations = newRecommendations.filter(rec => {
        const isValid = validateRecommendation(rec)
        if (!isValid) {
          console.warn('Invalid recommendation received:', rec)
        }
        return isValid
      })
      
      setRecommendations(validRecommendations)
      setIsLoading(false)
      setError(null)
    })

    return () => {
      unsubscribe()
    }
  }, []) // Empty dependency array - only subscribe once

  // Generate recommendations based on strategy and performance
  useEffect(() => {
    if (!autoGenerate) return
    if (!strategy && !performance) return

    try {
      const generatedRecommendations: AIRecommendation[] = []

      // Generate strategy-based recommendations
      if (strategy) {
        const strategyRecs = aiRecommendationsService.generateRecommendationsForStrategy(strategy)
        generatedRecommendations.push(...strategyRecs)
      }

      // Generate performance-based recommendations
      if (performance) {
        const performanceRecs = aiRecommendationsService.generateRecommendationsForPerformance(performance)
        generatedRecommendations.push(...performanceRecs)
      }

      // Filter out duplicates based on title (simple deduplication)
      const uniqueRecommendations = generatedRecommendations.filter((rec, index, self) => {
        return index === self.findIndex(r => r.title === rec.title)
      })

      // Merge with existing recommendations, avoiding duplicates
      setRecommendations(prevRecommendations => {
        const existingTitles = new Set(prevRecommendations.map(r => r.title))
        const newRecs = uniqueRecommendations.filter(rec => !existingTitles.has(rec.title))
        
        if (newRecs.length > 0) {
          return [...prevRecommendations, ...newRecs]
        }
        
        return prevRecommendations
      })
    } catch (err) {
      const error = err as Error
      console.error('Failed to generate recommendations:', error)
      setError(error)
    }
  }, [strategy, performance, autoGenerate]) // Include all dependencies

  /**
   * Apply a recommendation
   */
  const applyRecommendation = useCallback(async (id: string) => {
    try {
      const recommendation = recommendations.find(r => r.id === id)
      if (!recommendation) {
        throw new Error('Recommendation not found')
      }

      // Apply the recommendation through the service
      await aiRecommendationsService.applyRecommendation(id)

      // Execute the recommendation action if present
      if (recommendation.action) {
        await executeRecommendationAction(recommendation)
      }

      // Show success toast
      toast({
        title: '✅ Recommendation Applied',
        description: `Successfully applied: ${recommendation.title}`,
        variant: 'default',
        duration: TOAST_DURATIONS.MEDIUM,
      })
    } catch (err) {
      const error = err as Error
      handleDashboardError(
        error,
        { 
          component: 'useRecommendations', 
          action: 'applyRecommendation',
          metadata: { recommendationId: id }
        },
        toast
      )
      throw error // Re-throw for caller to handle if needed
    }
  }, [recommendations, toast])

  /**
   * Dismiss a recommendation
   */
  const dismissRecommendation = useCallback((id: string) => {
    try {
      aiRecommendationsService.dismissRecommendation(id)
      
      // Optimistically update local state
      setRecommendations(prev => prev.filter(rec => rec.id !== id))
    } catch (err) {
      const error = err as Error
      console.error('Failed to dismiss recommendation:', error)
      setError(error)
    }
  }, [])

  /**
   * Manually refresh recommendations
   */
  const refreshRecommendations = useCallback(() => {
    try {
      setIsLoading(true)
      const freshRecommendations = aiRecommendationsService.getRecommendations('pending')
      setRecommendations(freshRecommendations)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      const error = err as Error
      console.error('Failed to refresh recommendations:', error)
      setError(error)
      setIsLoading(false)
    }
  }, [])

  return {
    recommendations,
    isLoading,
    error,
    applyRecommendation,
    dismissRecommendation,
    refreshRecommendations,
  }
}

/**
 * Execute the action associated with a recommendation
 * 
 * @param recommendation - The recommendation to execute
 */
async function executeRecommendationAction(recommendation: AIRecommendation): Promise<void> {
  if (!recommendation.action) return

  const { type, payload } = recommendation.action

  switch (type) {
    case 'strategy_update':
      // Update strategy through trading agent service
      const currentStrategy = tradingAgentService.strategy
      const updatedStrategy = { ...currentStrategy, ...payload }
      await tradingAgentService.updateStrategy(updatedStrategy)
      break

    case 'pause_agent':
      // Pause the trading agent
      await tradingAgentService.disable()
      break

    case 'rebalance':
      // Trigger portfolio rebalancing
      if ('forceRebalance' in tradingAgentService && typeof tradingAgentService.forceRebalance === 'function') {
        await tradingAgentService.forceRebalance()
      }
      break

    case 'adjust_limits':
      // Adjust trading limits
      const strategy = tradingAgentService.strategy
      const adjustedStrategy = { ...strategy, ...payload }
      await tradingAgentService.updateStrategy(adjustedStrategy)
      break

    case 'manual_review':
      // Manual review actions don't auto-execute
      console.info('Manual review required for recommendation:', recommendation.title)
      break

    default:
      console.warn('Unknown recommendation action type:', type)
  }
}
