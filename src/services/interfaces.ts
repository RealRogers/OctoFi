/**
 * Service interfaces for the AI-Enhanced Swap Interface
 * These interfaces define the contracts for all services
 */

import {
  Token,
  TokenPair,
  Chain,
  MarketPrediction,
  SentimentAnalysis,
  RiskScore,
  AIUpdate,
  TokenPrice,
  LiquidityData,
  GasEstimate,
  SwapParameters,
  SwapTransaction,
  TransactionResult,
  TradingStrategy,
  PerformanceMetrics,
  Subscription,
  NetworkError,
  AIError,
  TransactionError,
  RecoveryAction
} from './types'

// AI Insights Service Interface
export interface AIInsightsService {
  /**
   * Get market prediction for a token pair
   */
  getPrediction(tokenPair: TokenPair): Promise<MarketPrediction>
  
  /**
   * Get market sentiment analysis for a specific token
   */
  getMarketSentiment(token: Token): Promise<SentimentAnalysis>
  
  /**
   * Assess risk for swap parameters
   */
  getRiskAssessment(swapParams: SwapParameters): Promise<RiskScore>
  
  /**
   * Subscribe to real-time AI updates
   */
  subscribeToUpdates(callback: (update: AIUpdate) => void): Subscription
  
  /**
   * Check if AI service is available
   */
  isAvailable(): Promise<boolean>
}

// Real-time Data Service Interface
export interface DataService {
  /**
   * Get current token price
   */
  getTokenPrice(token: Token, chain: Chain): Promise<TokenPrice>
  
  /**
   * Get liquidity data for token pair
   */
  getLiquidity(tokenPair: TokenPair): Promise<LiquidityData>
  
  /**
   * Get gas estimate for transaction
   */
  getGasEstimate(transaction: SwapTransaction): Promise<GasEstimate>
  
  /**
   * Subscribe to real-time price updates
   */
  subscribeToPrice(token: Token, callback: (price: TokenPrice) => void): Subscription
  
  /**
   * Get supported chains
   */
  getSupportedChains(): Promise<Chain[]>
  
  /**
   * Get token list for a specific chain
   */
  getTokenList(chainId: number): Promise<Token[]>
}

// Wallet Integration Service Interface
export interface WalletService {
  /**
   * Connect to wallet
   */
  connect(): Promise<string>
  
  /**
   * Disconnect wallet
   */
  disconnect(): Promise<void>
  
  /**
   * Get connected account address
   */
  getAccount(): Promise<string | null>
  
  /**
   * Get current chain ID
   */
  getChainId(): Promise<number>
  
  /**
   * Switch to specific chain
   */
  switchChain(chainId: number): Promise<void>
  
  /**
   * Execute swap transaction
   */
  executeSwap(params: SwapParameters): Promise<TransactionResult>
  
  /**
   * Get token balance
   */
  getTokenBalance(token: Token, account: string): Promise<string>
  
  /**
   * Subscribe to account changes
   */
  subscribeToAccount(callback: (account: string | null) => void): Subscription
  
  /**
   * Subscribe to chain changes
   */
  subscribeToChain(callback: (chainId: number) => void): Subscription
}

// Trading Agent Service Interface
export interface TradingAgent {
  isActive: boolean
  strategy: TradingStrategy
  performance: PerformanceMetrics
  
  /**
   * Enable trading agent with strategy
   */
  enable(strategy: TradingStrategy): Promise<void>
  
  /**
   * Disable trading agent
   */
  disable(): Promise<void>
  
  /**
   * Execute swap based on AI predictions
   */
  executeSwap(params: SwapParameters): Promise<TransactionResult>
  
  /**
   * Get current performance metrics
   */
  getPerformance(): PerformanceMetrics
  
  /**
   * Update trading strategy
   */
  updateStrategy(strategy: TradingStrategy): Promise<void>
  
  /**
   * Get trading history
   */
  getHistory(): Promise<TransactionResult[]>
  
  /**
   * Subscribe to agent actions
   */
  subscribeToActions(callback: (action: AgentAction) => void): Subscription
  
  /**
   * Manually trigger portfolio optimization
   */
  optimizePortfolio(): Promise<void>
  
  /**
   * Force immediate portfolio rebalancing
   */
  forceRebalance(): Promise<void>
}

// Error Handler Interface
export interface ErrorHandler {
  /**
   * Handle network-related errors
   */
  handleNetworkError(error: NetworkError): RecoveryAction
  
  /**
   * Handle AI service errors
   */
  handleAIServiceError(error: AIError): RecoveryAction
  
  /**
   * Handle transaction errors
   */
  handleTransactionError(error: TransactionError): RecoveryAction
  
  /**
   * Log error for debugging
   */
  logError(error: Error, context: string): void
}

// Logger Interface
export interface Logger {
  /**
   * Log info message
   */
  info(message: string, data?: any): void
  
  /**
   * Log warning message
   */
  warn(message: string, data?: any): void
  
  /**
   * Log error message
   */
  error(message: string, error?: Error, data?: any): void
  
  /**
   * Log debug message
   */
  debug(message: string, data?: any): void
}

// Additional Types for Agent Actions
export interface AgentAction {
  type: 'swap' | 'pause' | 'resume' | 'strategy_change'
  timestamp: Date
  data: any
  result?: 'success' | 'failure'
  error?: string
}