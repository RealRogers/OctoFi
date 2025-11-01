/**
 * Trading Agent Service Implementation
 * Enables autonomous trading based on AI predictions and user-defined strategies
 */

import { TradingAgent } from './interfaces'
import {
    TradingStrategy,
    PerformanceMetrics,
    SwapParameters,
    TransactionResult,
    MarketPrediction,
    RiskScore,
    Subscription,
    AgentAction
} from './types'
import { config } from './config'
import { logger, errorHandler } from './errorHandler'
import { aiInsightsService } from './aiInsightsService'
import { retryWithBackoff, generateId } from './utils'

interface AgentState {
    isActive: boolean
    strategy: TradingStrategy | null
    performance: PerformanceMetrics | null
    lastAction: Date | null
    cooldownUntil: Date | null
}

class TradingAgentService implements TradingAgent {
    private state: AgentState = {
        isActive: false,
        strategy: null,
        performance: null,
        lastAction: null,
        cooldownUntil: null
    }

    private actionSubscribers: Set<(action: AgentAction) => void> = new Set()
    private tradingHistory: TransactionResult[] = []
    private aiSubscription: Subscription | null = null
    private monitoringInterval: NodeJS.Timeout | null = null

    constructor() {
        this.initializeAgent()
    }

    get isActive(): boolean {
        return this.state.isActive
    }

    get strategy(): TradingStrategy {
        return this.state.strategy || this.getDefaultStrategy()
    }

    get performance(): PerformanceMetrics {
        return this.state.performance || this.getInitialPerformance()
    }

    /**
     * Initialize the trading agent
     */
    private async initializeAgent(): Promise<void> {
        try {
            logger.info('Initializing Trading Agent Service')

            // Load persisted state if available
            this.loadPersistedState()

            // Initialize performance metrics
            if (!this.state.performance) {
                this.state.performance = this.getInitialPerformance()
            }

            logger.info('Trading Agent Service initialized successfully')
        } catch (error) {
            logger.error('Failed to initialize Trading Agent Service', error as Error)
        }
    }

    /**
     * Enable trading agent with strategy
     */
    async enable(strategy: TradingStrategy): Promise<void> {
        try {
            if (!config.agent.enabled) {
                throw new Error('Trading agent is disabled in configuration')
            }

            this.state.strategy = strategy
            this.state.isActive = true
            this.state.lastAction = new Date()

            // Subscribe to AI updates
            this.subscribeToAIUpdates()

            // Start monitoring
            this.startMonitoring()

            // Persist state
            this.persistState()

            const action: AgentAction = {
                type: 'resume',
                timestamp: new Date(),
                data: { strategy },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
            logger.info('Trading agent enabled', { strategy })
        } catch (error) {
            const action: AgentAction = {
                type: 'resume',
                timestamp: new Date(),
                data: { strategy },
                result: 'failure',
                error: error instanceof Error ? error.message : 'Unknown error'
            }

            this.notifyActionSubscribers(action)
            throw error
        }
    }

    /**
     * Disable trading agent
     */
    async disable(): Promise<void> {
        try {
            this.state.isActive = false

            // Unsubscribe from AI updates
            if (this.aiSubscription) {
                this.aiSubscription.unsubscribe()
                this.aiSubscription = null
            }

            // Stop monitoring
            this.stopMonitoring()

            // Persist state
            this.persistState()

            const action: AgentAction = {
                type: 'pause',
                timestamp: new Date(),
                data: {},
                result: 'success'
            }

            this.notifyActionSubscribers(action)
            logger.info('Trading agent disabled')
        } catch (error) {
            logger.error('Failed to disable trading agent', error as Error)
            throw error
        }
    }

    /**
     * Execute swap based on AI predictions
     */
    async executeSwap(params: SwapParameters): Promise<TransactionResult> {
        try {
            if (!this.state.isActive) {
                throw new Error('Trading agent is not active')
            }

            if (this.isInCooldown()) {
                throw new Error('Agent is in cooldown period')
            }

            // Get AI prediction and risk assessment
            const [prediction, riskScore] = await Promise.all([
                aiInsightsService.getPrediction({
                    fromToken: params.fromToken,
                    toToken: params.toToken
                }),
                aiInsightsService.getRiskAssessment(params)
            ])

            // Evaluate if swap should be executed
            const shouldExecute = this.shouldExecuteSwap(prediction, riskScore, params)

            if (!shouldExecute.execute) {
                logger.info('Agent decided not to execute swap', { reason: shouldExecute.reason })

                const action: AgentAction = {
                    type: 'swap',
                    timestamp: new Date(),
                    data: { params, prediction, riskScore, decision: shouldExecute.reason },
                    result: 'success'
                }

                this.notifyActionSubscribers(action)

                // Return a mock "skipped" transaction
                return {
                    hash: `skipped-${generateId()}`,
                    status: 'confirmed',
                    timestamp: new Date()
                }
            }

            // Execute the swap (mock implementation)
            const result = await this.performSwap(params, prediction)

            // Update performance metrics
            this.updatePerformance(result, params)

            // Set cooldown
            this.setCooldown()

            // Record in history
            this.tradingHistory.push(result)

            // Persist state
            this.persistState()

            const action: AgentAction = {
                type: 'swap',
                timestamp: new Date(),
                data: { params, prediction, riskScore, result },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
            logger.info('Agent executed swap successfully', { hash: result.hash })

            return result
        } catch (error) {
            const action: AgentAction = {
                type: 'swap',
                timestamp: new Date(),
                data: { params },
                result: 'failure',
                error: error instanceof Error ? error.message : 'Unknown error'
            }

            this.notifyActionSubscribers(action)
            logger.error('Agent swap execution failed', error as Error)
            throw error
        }
    }

    /**
     * Get current performance metrics
     */
    getPerformance(): PerformanceMetrics {
        return this.state.performance || this.getInitialPerformance()
    }

    /**
     * Update trading strategy
     */
    async updateStrategy(strategy: TradingStrategy): Promise<void> {
        try {
            const oldStrategy = this.state.strategy
            this.state.strategy = strategy
            this.persistState()

            const action: AgentAction = {
                type: 'strategy_change',
                timestamp: new Date(),
                data: { oldStrategy, newStrategy: strategy },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
            logger.info('Trading strategy updated', { strategy })
        } catch (error) {
            logger.error('Failed to update trading strategy', error as Error)
            throw error
        }
    }

    /**
     * Get trading history
     */
    async getHistory(): Promise<TransactionResult[]> {
        return [...this.tradingHistory]
    }

    /**
     * Subscribe to agent actions
     */
    subscribeToActions(callback: (action: AgentAction) => void): Subscription {
        this.actionSubscribers.add(callback)

        return {
            unsubscribe: () => {
                this.actionSubscribers.delete(callback)
            }
        }
    }

    /**
     * Manually trigger portfolio optimization
     */
    async optimizePortfolio(): Promise<void> {
        try {
            if (!this.state.isActive) {
                throw new Error('Trading agent must be active to optimize portfolio')
            }

            logger.info('Starting manual portfolio optimization')

            // Mock optimization logic
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulate optimization analysis
            const action: AgentAction = {
                type: 'swap',
                timestamp: new Date(),
                data: { 
                    type: 'optimization',
                    reason: 'Manual optimization triggered',
                    recommendations: [
                        'Increase ETH allocation by 5%',
                        'Reduce USDC to 10%',
                        'Add BTC position'
                    ]
                },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
            logger.info('Portfolio optimization completed')
        } catch (error) {
            logger.error('Portfolio optimization failed', error as Error)
            throw error
        }
    }

    /**
     * Force immediate portfolio rebalancing
     */
    async forceRebalance(): Promise<void> {
        try {
            if (!this.state.isActive) {
                throw new Error('Trading agent must be active to rebalance portfolio')
            }

            logger.info('Starting forced portfolio rebalancing')

            // Mock rebalancing logic
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Simulate rebalancing execution
            const action: AgentAction = {
                type: 'swap',
                timestamp: new Date(),
                data: { 
                    type: 'rebalancing',
                    reason: 'Manual rebalancing forced',
                    adjustments: [
                        { token: 'ETH', action: 'buy', amount: '0.5' },
                        { token: 'USDC', action: 'sell', amount: '500' }
                    ]
                },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
            
            // Update performance after rebalancing
            if (this.state.performance) {
                this.state.performance.totalTrades++
            }

            this.persistState()
            logger.info('Portfolio rebalancing completed')
        } catch (error) {
            logger.error('Portfolio rebalancing failed', error as Error)
            throw error
        }
    }

    /**
     * Subscribe to AI updates for autonomous trading
     */
    private subscribeToAIUpdates(): void {
        if (this.aiSubscription) {
            this.aiSubscription.unsubscribe()
        }

        this.aiSubscription = aiInsightsService.subscribeToUpdates((update) => {
            if (!this.state.isActive) return

            // Handle different types of AI updates
            switch (update.type) {
                case 'opportunity':
                    this.handleTradingOpportunity(update)
                    break
                case 'risk':
                    this.handleRiskAlert(update)
                    break
                default:
                    // Log other updates for monitoring
                    logger.debug('AI update received', { type: update.type, severity: update.severity })
            }
        })
    }

    /**
     * Handle trading opportunity from AI
     */
    private async handleTradingOpportunity(update: any): Promise<void> {
        try {
            if (this.isInCooldown()) return

            // Extract opportunity data
            const { tokenPair, confidence, expectedReturn } = update.data || {}

            const riskThreshold = this.getRiskToleranceScore()
            if (!tokenPair || confidence < riskThreshold) {
                return
            }

            // Create swap parameters based on opportunity
            const swapParams: SwapParameters = {
                fromToken: tokenPair.fromToken,
                toToken: tokenPair.toToken,
                amount: this.calculateOptimalAmount(expectedReturn),
                slippage: this.strategy.maxSlippage
            }

            // Execute the opportunity
            await this.executeSwap(swapParams)
        } catch (error) {
            logger.error('Failed to handle trading opportunity', error as Error)
        }
    }

    /**
     * Handle risk alert from AI
     */
    private handleRiskAlert(update: any): void {
        if (update.severity === 'critical') {
            logger.warn('Critical risk alert received, pausing agent temporarily')

            // Temporarily pause for high volatility
            const volatilityThreshold = typeof config.agent.volatilityThreshold === 'number' ? config.agent.volatilityThreshold : 0.1
            this.setCooldown(volatilityThreshold * 60000) // Convert to ms

            const action: AgentAction = {
                type: 'pause',
                timestamp: new Date(),
                data: { reason: 'Critical risk alert', alert: update },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
        }
    }

    /**
     * Start monitoring for autonomous trading
     */
    private startMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval)
        }

        this.monitoringInterval = setInterval(() => {
            this.performPeriodicCheck()
        }, 60000) // Check every minute
    }

    /**
     * Stop monitoring
     */
    private stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval)
            this.monitoringInterval = null
        }
    }

    /**
     * Perform periodic health and opportunity checks
     */
    private async performPeriodicCheck(): Promise<void> {
        try {
            if (!this.state.isActive) return

            // Check if cooldown has expired
            if (this.isInCooldown()) return

            // Update performance metrics
            this.recalculatePerformance()

            // Check for rebalancing opportunities
            await this.checkRebalancingNeeds()

            logger.debug('Periodic agent check completed')
        } catch (error) {
            logger.error('Error during periodic agent check', error as Error)
        }
    }

    /**
     * Check if rebalancing is needed
     */
    private async checkRebalancingNeeds(): Promise<void> {
        // Mock rebalancing logic
        const shouldRebalance = Math.random() < 0.1 // 10% chance for demo

        if (shouldRebalance) {
            logger.info('Agent identified rebalancing opportunity')

            const action: AgentAction = {
                type: 'swap',
                timestamp: new Date(),
                data: { type: 'rebalancing', reason: 'Portfolio drift detected' },
                result: 'success'
            }

            this.notifyActionSubscribers(action)
        }
    }

    /**
     * Determine if swap should be executed based on AI analysis
     */
    private shouldExecuteSwap(
        prediction: MarketPrediction,
        riskScore: RiskScore,
        params: SwapParameters
    ): { execute: boolean; reason: string } {
        // Check confidence threshold
        if (prediction.confidence < config.agent.riskThreshold * 100) {
            return { execute: false, reason: 'Confidence below threshold' }
        }

        // Check risk tolerance
        const riskTolerance = this.getRiskToleranceScore()
        if (riskScore.overall > riskTolerance) {
            return { execute: false, reason: 'Risk exceeds tolerance' }
        }

        // Check expected return vs strategy requirements
        const minReturn = this.getMinimumReturnThreshold()
        if (prediction.expectedPriceChange < minReturn) {
            return { execute: false, reason: 'Expected return too low' }
        }

        // Check if direction aligns with strategy
        if (prediction.direction === 'bearish' && this.strategy.riskTolerance === 'conservative') {
            return { execute: false, reason: 'Bearish prediction conflicts with conservative strategy' }
        }

        return { execute: true, reason: 'All conditions met' }
    }

    /**
     * Perform the actual swap (mock implementation)
     */
    private async performSwap(params: SwapParameters, prediction: MarketPrediction): Promise<TransactionResult> {
        // Mock swap execution with realistic delays and outcomes
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

        const success = Math.random() > 0.05 // 95% success rate
        const hash = `0x${generateId()}`

        if (!success) {
            throw new Error('Swap transaction failed')
        }

        // Calculate effective price based on prediction
        const basePrice = 1.0
        const priceVariation = (Math.random() - 0.5) * 0.02 // ±1% variation
        const effectivePrice = basePrice * (1 + priceVariation)

        return {
            hash,
            status: 'confirmed',
            gasUsed: 150000 + Math.floor(Math.random() * 50000),
            effectivePrice,
            timestamp: new Date()
        }
    }

    /**
     * Update performance metrics after a trade
     */
    private updatePerformance(result: TransactionResult, params: SwapParameters): void {
        if (!this.state.performance) {
            this.state.performance = this.getInitialPerformance()
        }

        const perf = this.state.performance
        perf.totalTrades++

        if (result.status === 'confirmed') {
            perf.successfulTrades++

            // Mock profit/loss calculation
            const profitLoss = (Math.random() - 0.3) * 100 // Slight positive bias
            perf.totalProfitLoss += profitLoss

            // Update other metrics
            perf.averageReturn = perf.totalProfitLoss / perf.totalTrades
            perf.winRate = (perf.successfulTrades / perf.totalTrades) * 100

            // Mock Sharpe ratio and max drawdown updates
            perf.sharpeRatio = Math.max(0, perf.averageReturn / 10) // Simplified calculation
            perf.maxDrawdown = Math.min(perf.maxDrawdown, profitLoss)
        }
    }

    /**
     * Recalculate performance metrics
     */
    private recalculatePerformance(): void {
        if (!this.state.performance || this.tradingHistory.length === 0) return

        // Recalculate metrics based on trading history
        const successfulTrades = this.tradingHistory.filter(t => t.status === 'confirmed').length
        this.state.performance.successfulTrades = successfulTrades
        this.state.performance.winRate = (successfulTrades / this.tradingHistory.length) * 100
    }

    /**
     * Calculate optimal amount for a trade
     */
    private calculateOptimalAmount(expectedReturn: number): string {
        const maxPosition = config.agent.maxPositionSize
        const baseAmount = 100 // Base amount in USD

        // Adjust amount based on expected return and risk tolerance
        const riskMultiplier = this.strategy.riskTolerance === 'aggressive' ? 1.5 :
            this.strategy.riskTolerance === 'moderate' ? 1.0 : 0.5

        const amount = baseAmount * riskMultiplier * Math.min(expectedReturn / 5, maxPosition)
        return Math.max(10, amount).toString() // Minimum $10
    }

    /**
     * Check if agent is in cooldown period
     */
    private isInCooldown(): boolean {
        return this.state.cooldownUntil ? new Date() < this.state.cooldownUntil : false
    }

    /**
     * Set cooldown period
     */
    private setCooldown(durationMs?: number): void {
        const duration = durationMs || config.agent.cooldownPeriod
        this.state.cooldownUntil = new Date(Date.now() + duration)
    }

    /**
     * Get risk tolerance score based on strategy
     */
    private getRiskToleranceScore(): number {
        switch (this.strategy.riskTolerance) {
            case 'conservative': return 30
            case 'moderate': return 60
            case 'aggressive': return 80
            default: return 50
        }
    }

    /**
     * Get minimum return threshold based on strategy
     */
    private getMinimumReturnThreshold(): number {
        switch (this.strategy.riskTolerance) {
            case 'conservative': return 1.0 // 1%
            case 'moderate': return 2.0 // 2%
            case 'aggressive': return 3.0 // 3%
            default: return 2.0
        }
    }

    /**
     * Get default trading strategy
     */
    private getDefaultStrategy(): TradingStrategy {
        return {
            riskTolerance: 'moderate',
            maxSlippage: 1.0,
            stopLoss: config.agent.stopLossDefault,
            takeProfit: config.agent.takeProfitDefault,
            rebalanceThreshold: config.agent.rebalanceThreshold
        }
    }

    /**
     * Get initial performance metrics
     */
    private getInitialPerformance(): PerformanceMetrics {
        return {
            totalTrades: 0,
            successfulTrades: 0,
            totalProfitLoss: 0,
            averageReturn: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            winRate: 0
        }
    }

    /**
     * Notify all action subscribers
     */
    private notifyActionSubscribers(action: AgentAction): void {
        this.actionSubscribers.forEach(callback => {
            try {
                callback(action)
            } catch (error) {
                logger.error('Error notifying agent action subscriber', error as Error)
            }
        })
    }

    /**
     * Persist agent state to localStorage
     */
    private persistState(): void {
        try {
            const stateToSave = {
                strategy: this.state.strategy,
                performance: this.state.performance,
                tradingHistory: this.tradingHistory.slice(-100) // Keep last 100 trades
            }

            localStorage.setItem('tradingAgentState', JSON.stringify(stateToSave))
        } catch (error) {
            logger.error('Failed to persist agent state', error as Error)
        }
    }

    /**
     * Load persisted state from localStorage
     */
    private loadPersistedState(): void {
        try {
            const saved = localStorage.getItem('tradingAgentState')
            if (saved) {
                const state = JSON.parse(saved)
                this.state.strategy = state.strategy
                this.state.performance = state.performance
                this.tradingHistory = state.tradingHistory || []
            }
        } catch (error) {
            logger.error('Failed to load persisted agent state', error as Error)
        }
    }
}

// Create and export singleton instance
export const tradingAgentService = new TradingAgentService()

// Export class for testing
export { TradingAgentService }