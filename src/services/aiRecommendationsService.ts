/**
 * AI Recommendations Service
 * Generates and manages AI-powered trading recommendations
 */

import { 
  AIRecommendation, 
  RecommendationPriority, 
  RecommendationCategory,
  RecommendationStatus,
  TradingStrategy,
  PerformanceMetrics
} from './types'
import { generateId } from './utils'

class AIRecommendationsService {
  private recommendations: AIRecommendation[] = []
  private subscribers: Set<(recommendations: AIRecommendation[]) => void> = new Set()

  constructor() {
    this.generateInitialRecommendations()
    
    // Simulate periodic recommendation updates
    setInterval(() => {
      this.generatePeriodicRecommendations()
    }, 30000) // Every 30 seconds
  }

  /**
   * Get all recommendations with optional filtering
   */
  getRecommendations(status?: RecommendationStatus): AIRecommendation[] {
    let filtered = [...this.recommendations]
    
    if (status) {
      filtered = filtered.filter(rec => rec.status === status)
    }
    
    // Remove expired recommendations
    const now = new Date()
    filtered = filtered.filter(rec => !rec.expiresAt || rec.expiresAt > now)
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Apply a recommendation
   */
  async applyRecommendation(recommendationId: string): Promise<void> {
    const recommendation = this.recommendations.find(r => r.id === recommendationId)
    if (!recommendation) {
      throw new Error('Recommendation not found')
    }

    if (!recommendation.action?.autoApplicable) {
      throw new Error('This recommendation cannot be auto-applied')
    }

    // Simulate applying the recommendation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Update recommendation status
    recommendation.status = 'applied'
    recommendation.appliedAt = new Date()

    this.notifySubscribers()
  }

  /**
   * Dismiss a recommendation
   */
  dismissRecommendation(recommendationId: string): void {
    const recommendation = this.recommendations.find(r => r.id === recommendationId)
    if (recommendation) {
      recommendation.status = 'dismissed'
      this.notifySubscribers()
    }
  }

  /**
   * Subscribe to recommendation updates
   */
  subscribe(callback: (recommendations: AIRecommendation[]) => void): () => void {
    this.subscribers.add(callback)
    
    // Send initial data
    callback(this.getRecommendations('pending'))
    
    return () => {
      this.subscribers.delete(callback)
    }
  }

  /**
   * Generate recommendations based on current market conditions
   */
  generateRecommendationsForStrategy(strategy: TradingStrategy): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    const now = new Date()

    // Strategy-based recommendations
    if (strategy.riskTolerance === 'aggressive') {
      recommendations.push({
        id: generateId(),
        priority: 'medium',
        category: 'risk',
        status: 'pending',
        title: 'Consider Risk Reduction',
        message: 'Current aggressive strategy may expose portfolio to high volatility',
        rationale: [
          'Market volatility has increased by 15% in the last 24 hours',
          'Aggressive strategies show higher drawdowns in current conditions',
          'Conservative approach may preserve capital during uncertainty'
        ],
        confidence: 78,
        impact: {
          risk: 'decrease',
          return: 'decrease',
          complexity: 'low'
        },
        action: {
          type: 'strategy_update',
          payload: { riskTolerance: 'moderate' },
          autoApplicable: true
        },
        expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
        createdAt: now
      })
    }

    if (strategy.maxSlippage > 2.0) {
      recommendations.push({
        id: generateId(),
        priority: 'low',
        category: 'optimization',
        status: 'pending',
        title: 'Optimize Slippage Settings',
        message: 'Current slippage tolerance may result in unnecessary costs',
        rationale: [
          'Average slippage in recent trades was only 0.8%',
          'Reducing slippage tolerance can improve trade efficiency',
          'Current market liquidity supports tighter slippage'
        ],
        confidence: 85,
        impact: {
          risk: 'neutral',
          return: 'increase',
          complexity: 'low'
        },
        action: {
          type: 'strategy_update',
          payload: { maxSlippage: 1.5 },
          autoApplicable: true
        },
        createdAt: now
      })
    }

    return recommendations
  }

  /**
   * Generate recommendations based on performance metrics
   */
  generateRecommendationsForPerformance(performance: PerformanceMetrics): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    const now = new Date()

    if (performance.winRate < 40) {
      recommendations.push({
        id: generateId(),
        priority: 'high',
        category: 'strategy',
        status: 'pending',
        title: 'Low Win Rate Detected',
        message: 'Current strategy shows suboptimal win rate, consider adjustments',
        rationale: [
          `Win rate of ${performance.winRate.toFixed(1)}% is below optimal threshold`,
          'Market conditions may have changed since strategy was set',
          'Strategy refinement could improve performance'
        ],
        confidence: 82,
        impact: {
          risk: 'neutral',
          return: 'increase',
          complexity: 'medium'
        },
        action: {
          type: 'manual_review',
          payload: { metric: 'winRate', value: performance.winRate },
          autoApplicable: false
        },
        createdAt: now
      })
    }

    if (performance.maxDrawdown < -20) {
      recommendations.push({
        id: generateId(),
        priority: 'critical',
        category: 'risk',
        status: 'pending',
        title: 'High Drawdown Alert',
        message: 'Portfolio has experienced significant drawdown, immediate action recommended',
        rationale: [
          `Maximum drawdown of ${performance.maxDrawdown.toFixed(1)}% exceeds safe limits`,
          'Risk management protocols should be activated',
          'Consider pausing agent until market stabilizes'
        ],
        confidence: 95,
        impact: {
          risk: 'decrease',
          return: 'neutral',
          complexity: 'low'
        },
        action: {
          type: 'pause_agent',
          payload: { reason: 'High drawdown protection' },
          autoApplicable: true
        },
        expiresAt: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
        createdAt: now
      })
    }

    return recommendations
  }

  /**
   * Generate market opportunity recommendations
   */
  private generateOpportunityRecommendations(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    const now = new Date()

    // Simulate market opportunities
    const opportunities = [
      {
        title: 'ETH Accumulation Opportunity',
        message: 'Technical analysis suggests ETH is oversold and due for reversal',
        confidence: 72,
        priority: 'medium' as RecommendationPriority
      },
      {
        title: 'Portfolio Rebalancing Suggested',
        message: 'Asset allocation has drifted from target, rebalancing recommended',
        confidence: 88,
        priority: 'low' as RecommendationPriority
      },
      {
        title: 'High Volatility Trading Opportunity',
        message: 'Increased volatility creates favorable conditions for active trading',
        confidence: 65,
        priority: 'medium' as RecommendationPriority
      }
    ]

    // Randomly select 1-2 opportunities
    const selectedOpportunities = opportunities
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.random() > 0.5 ? 2 : 1)

    selectedOpportunities.forEach(opp => {
      recommendations.push({
        id: generateId(),
        priority: opp.priority,
        category: 'opportunity',
        status: 'pending',
        title: opp.title,
        message: opp.message,
        rationale: [
          'AI analysis of market patterns and indicators',
          'Historical data suggests favorable risk/reward ratio',
          'Current market conditions align with opportunity criteria'
        ],
        confidence: opp.confidence,
        impact: {
          risk: 'neutral',
          return: 'increase',
          complexity: 'medium'
        },
        action: {
          type: 'manual_review',
          payload: { opportunity: opp.title },
          autoApplicable: false
        },
        expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours
        createdAt: now
      })
    })

    return recommendations
  }

  /**
   * Generate initial set of recommendations
   */
  private generateInitialRecommendations(): void {
    const now = new Date()
    
    // Add some sample recommendations
    this.recommendations = [
      {
        id: generateId(),
        priority: 'high',
        category: 'optimization',
        status: 'pending',
        title: 'Optimize Gas Strategy',
        message: 'Current gas settings may be causing unnecessary delays and costs',
        rationale: [
          'Network congestion has decreased by 25% in the last hour',
          'Lower gas prices are now sufficient for timely execution',
          'Optimizing gas strategy can reduce transaction costs by up to 15%'
        ],
        confidence: 89,
        impact: {
          risk: 'neutral',
          return: 'increase',
          complexity: 'low'
        },
        action: {
          type: 'adjust_limits',
          payload: { gasStrategy: 'standard' },
          autoApplicable: true
        },
        createdAt: now
      },
      {
        id: generateId(),
        priority: 'medium',
        category: 'opportunity',
        status: 'pending',
        title: 'DeFi Yield Opportunity',
        message: 'New high-yield farming opportunity detected with favorable risk profile',
        rationale: [
          'Liquidity pool APY increased to 12.5% with stable token pair',
          'Smart contract has been audited by reputable security firms',
          'Historical data shows consistent returns with low impermanent loss'
        ],
        confidence: 76,
        impact: {
          risk: 'neutral',
          return: 'increase',
          complexity: 'high'
        },
        action: {
          type: 'manual_review',
          payload: { protocol: 'DeFi Protocol', apy: 12.5 },
          autoApplicable: false
        },
        expiresAt: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours
        createdAt: new Date(now.getTime() - 10 * 60 * 1000) // 10 minutes ago
      }
    ]
  }

  /**
   * Generate periodic recommendations
   */
  private generatePeriodicRecommendations(): void {
    // Randomly generate new recommendations
    if (Math.random() > 0.7) { // 30% chance
      const newRecommendations = this.generateOpportunityRecommendations()
      this.recommendations.push(...newRecommendations)
      
      // Limit total recommendations
      if (this.recommendations.length > 10) {
        this.recommendations = this.recommendations.slice(-10)
      }
      
      this.notifySubscribers()
    }
  }

  /**
   * Notify all subscribers of recommendation updates
   */
  private notifySubscribers(): void {
    const pendingRecommendations = this.getRecommendations('pending')
    this.subscribers.forEach(callback => {
      try {
        callback(pendingRecommendations)
      } catch (error) {
        console.error('Error notifying recommendation subscriber:', error)
      }
    })
  }
}

// Create and export singleton instance
export const aiRecommendationsService = new AIRecommendationsService()

// Export class for testing
export { AIRecommendationsService }