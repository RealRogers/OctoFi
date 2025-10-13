/**
 * Core type definitions for the AI-Enhanced Swap Interface
 * These types define the data structures used across all services
 */

// Core Token and Chain Types
export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  chainId: number
  verified: boolean
  auditStatus?: 'audited' | 'unaudited' | 'warning'
}

export interface Chain {
  id: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export interface TokenPair {
  fromToken: Token
  toToken: Token
}

// AI Service Types
export interface MarketPrediction {
  direction: 'bullish' | 'bearish' | 'neutral'
  confidence: number // 0-100
  timeframe: string
  rationale: string[]
  expectedPriceChange: number
  riskLevel: 'low' | 'medium' | 'high'
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number // -1 to 1
  factors: {
    social: number
    technical: number
    fundamental: number
  }
  sources: string[]
}

export interface RiskScore {
  overall: number // 0-100
  factors: {
    volatility: number
    liquidity: number
    smartContract: number
    market: number
  }
  recommendations: string[]
}

export interface AIUpdate {
  type: 'prediction' | 'risk' | 'opportunity'
  severity: 'info' | 'warning' | 'critical'
  message: string
  data: any
  timestamp: Date
}

// Data Service Types
export interface TokenPrice {
  price: number
  priceUSD: number
  change24h: number
  volume24h: number
  lastUpdated: Date
}

export interface LiquidityData {
  totalLiquidity: number
  liquidityUSD: number
  volume24h: number
  priceImpact: number
}

export interface GasEstimate {
  slow: number
  standard: number
  fast: number
  estimatedTime: {
    slow: number
    standard: number
    fast: number
  }
}

// Swap and Transaction Types
export interface SwapParameters {
  fromToken: Token
  toToken: Token
  amount: string
  slippage: number
  recipient?: string
  deadline?: number
}

export interface SwapTransaction {
  from: string
  to: string
  value: string
  data: string
  gasLimit: string
  gasPrice: string
}

export interface TransactionResult {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  gasUsed?: number
  effectivePrice?: number
  timestamp: Date
}

// Trading Agent Types
export interface TradingStrategy {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  maxSlippage: number
  stopLoss: number
  takeProfit: number
  rebalanceThreshold: number
}

export interface PerformanceMetrics {
  totalTrades: number
  successfulTrades: number
  totalProfitLoss: number
  averageReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
}

// State Management Types
export interface SwapFormState {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  slippage: number
  gasPrice: 'slow' | 'standard' | 'fast'
  crossChain: boolean
  aiRecommendations: MarketPrediction[]
}

// Error Types
export class NetworkError extends Error {
  code: number
  reason: string

  constructor(message: string, code: number = 500, reason: string = 'Network error') {
    super(message)
    this.name = 'NetworkError'
    this.code = code
    this.reason = reason
  }
}

export class AIError extends Error {
  service: string
  retryable: boolean

  constructor(message: string, service: string = 'unknown', retryable: boolean = true) {
    super(message)
    this.name = 'AIError'
    this.service = service
    this.retryable = retryable
  }
}

export class TransactionError extends Error {
  code: string
  reason: string
  transaction?: SwapTransaction

  constructor(message: string, code: string = 'UNKNOWN', reason: string = 'Transaction error', transaction?: SwapTransaction) {
    super(message)
    this.name = 'TransactionError'
    this.code = code
    this.reason = reason
    this.transaction = transaction
  }
}

// Subscription Types
export interface Subscription {
  unsubscribe: () => void
}

// Recovery Action Types
export type RecoveryAction = 
  | { type: 'retry'; delay: number }
  | { type: 'fallback'; alternative: string }
  | { type: 'manual'; instructions: string[] }

// Agent Action Types
export interface AgentAction {
  type: 'swap' | 'pause' | 'resume' | 'strategy_change'
  timestamp: Date
  data: any
  result?: 'success' | 'failure'
  error?: string
}

// AI Recommendation Types
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical'
export type RecommendationCategory = 'strategy' | 'risk' | 'opportunity' | 'optimization'
export type RecommendationStatus = 'pending' | 'applied' | 'dismissed' | 'expired'

export interface AIRecommendation {
  id: string
  priority: RecommendationPriority
  category: RecommendationCategory
  status: RecommendationStatus
  title: string
  message: string
  rationale: string[]
  confidence: number // 0-100
  impact: {
    risk: 'decrease' | 'neutral' | 'increase'
    return: 'decrease' | 'neutral' | 'increase'
    complexity: 'low' | 'medium' | 'high'
  }
  action?: {
    type: 'strategy_update' | 'rebalance' | 'pause_agent' | 'adjust_limits' | 'manual_review'
    payload: any
    autoApplicable: boolean
  }
  expiresAt?: Date
  createdAt: Date
  appliedAt?: Date
}

export interface RecommendationFilters {
  priority?: RecommendationPriority[]
  category?: RecommendationCategory[]
  status?: RecommendationStatus[]
  timeRange?: {
    start: Date
    end: Date
  }
}

export interface RecommendationMetrics {
  totalRecommendations: number
  appliedRecommendations: number
  dismissedRecommendations: number
  averageConfidence: number
  categoryBreakdown: Record<RecommendationCategory, number>
  priorityBreakdown: Record<RecommendationPriority, number>
}