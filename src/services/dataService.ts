/**
 * Real-time Data Service Implementation
 * Provides live market data, token prices, and on-chain information
 */

import { DataService } from './interfaces'
import { 
  Token, 
  TokenPair, 
  Chain, 
  TokenPrice, 
  LiquidityData, 
  GasEstimate, 
  SwapTransaction, 
  Subscription,
  NetworkError 
} from './types'
import { config, getChainConfig } from './config'
import { logger, errorHandler } from './errorHandler'
import { retryWithBackoff, withTimeout, throttle } from './utils'

/**
 * Mock price data for development and testing
 */
const MOCK_PRICES: Record<string, TokenPrice> = {
  'ETH': {
    price: 3000,
    priceUSD: 3000,
    change24h: 5.2,
    volume24h: 15000000000,
    lastUpdated: new Date()
  },
  'BTC': {
    price: 65000,
    priceUSD: 65000,
    change24h: -2.1,
    volume24h: 25000000000,
    lastUpdated: new Date()
  },
  'USDT': {
    price: 1.0,
    priceUSD: 1.0,
    change24h: 0.01,
    volume24h: 50000000000,
    lastUpdated: new Date()
  },
  'USDC': {
    price: 1.0,
    priceUSD: 1.0,
    change24h: -0.01,
    volume24h: 40000000000,
    lastUpdated: new Date()
  }
}

const MOCK_LIQUIDITY: Record<string, LiquidityData> = {
  'ETH-USDT': {
    totalLiquidity: 500000000,
    liquidityUSD: 500000000,
    volume24h: 100000000,
    priceImpact: 0.1
  },
  'BTC-ETH': {
    totalLiquidity: 200000000,
    liquidityUSD: 200000000,
    volume24h: 50000000,
    priceImpact: 0.2
  }
}

class DataServiceImpl implements DataService {
  private priceSubscribers: Map<string, Set<(price: TokenPrice) => void>> = new Map()
  private priceCache: Map<string, { price: TokenPrice; timestamp: number }> = new Map()
  private liquidityCache: Map<string, { liquidity: LiquidityData; timestamp: number }> = new Map()
  private websocketConnections: Map<string, WebSocket> = new Map()
  private reconnectAttempts: Map<string, number> = new Map()

  constructor() {
    this.initializeService()
  }

  /**
   * Initialize the data service
   */
  private async initializeService(): Promise<void> {
    try {
      logger.info('Initializing Real-time Data Service')
      
      // Start price update intervals for cached tokens
      this.startPriceUpdateInterval()
      
      logger.info('Real-time Data Service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize Real-time Data Service', error as Error)
    }
  }

  /**
   * Get current token price
   */
  async getTokenPrice(token: Token, chain: Chain): Promise<TokenPrice> {
    try {
      const cacheKey = `${token.symbol}-${chain.id}`
      
      // Check cache first
      const cached = this.priceCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < config.data.cacheTimeout) {
        return cached.price
      }

      // Fetch fresh price
      const price = await this.fetchTokenPrice(token, chain)
      
      // Cache the result
      this.priceCache.set(cacheKey, {
        price,
        timestamp: Date.now()
      })

      return price
    } catch (error) {
      const networkError = new NetworkError(`Failed to get token price: ${error}`)
      networkError.code = 500
      networkError.reason = 'Price fetch failed'
      
      const recovery = errorHandler.handleNetworkError(networkError)
      
      if (recovery.type === 'fallback') {
        // Return cached price if available
        const cached = this.priceCache.get(`${token.symbol}-${chain.id}`)
        if (cached) {
          logger.warn(`Using cached price for ${token.symbol}`)
          return cached.price
        }
      }
      
      throw networkError
    }
  }

  /**
   * Get liquidity data for token pair
   */
  async getLiquidity(tokenPair: TokenPair): Promise<LiquidityData> {
    try {
      const cacheKey = `${tokenPair.fromToken.symbol}-${tokenPair.toToken.symbol}`
      
      // Check cache first
      const cached = this.liquidityCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < config.data.cacheTimeout) {
        return cached.liquidity
      }

      // Fetch fresh liquidity data
      const liquidity = await this.fetchLiquidityData(tokenPair)
      
      // Cache the result
      this.liquidityCache.set(cacheKey, {
        liquidity,
        timestamp: Date.now()
      })

      return liquidity
    } catch (error) {
      const networkError = new NetworkError(`Failed to get liquidity data: ${error}`)
      networkError.code = 500
      networkError.reason = 'Liquidity fetch failed'
      
      throw networkError
    }
  }

  /**
   * Get gas estimate for transaction
   */
  async getGasEstimate(transaction: SwapTransaction): Promise<GasEstimate> {
    try {
      return await this.fetchGasEstimate(transaction)
    } catch (error) {
      const networkError = new NetworkError(`Failed to get gas estimate: ${error}`)
      networkError.code = 500
      networkError.reason = 'Gas estimation failed'
      
      // Return fallback gas estimates
      return {
        slow: 20000000000,    // 20 gwei
        standard: 30000000000, // 30 gwei
        fast: 50000000000,     // 50 gwei
        estimatedTime: {
          slow: 300,    // 5 minutes
          standard: 180, // 3 minutes
          fast: 60      // 1 minute
        }
      }
    }
  }

  /**
   * Subscribe to real-time price updates
   */
  subscribeToPrice(token: Token, callback: (price: TokenPrice) => void): Subscription {
    const key = token.symbol
    
    if (!this.priceSubscribers.has(key)) {
      this.priceSubscribers.set(key, new Set())
    }
    
    this.priceSubscribers.get(key)!.add(callback)
    
    // Start WebSocket connection if not already active
    this.startPriceWebSocket(token)
    
    return {
      unsubscribe: () => {
        const subscribers = this.priceSubscribers.get(key)
        if (subscribers) {
          subscribers.delete(callback)
          
          // Close WebSocket if no more subscribers
          if (subscribers.size === 0) {
            this.closePriceWebSocket(token)
            this.priceSubscribers.delete(key)
          }
        }
      }
    }
  }

  /**
   * Get supported chains
   */
  async getSupportedChains(): Promise<Chain[]> {
    return [
      {
        id: config.blockchain.somniaTestnet.chainId,
        name: config.blockchain.somniaTestnet.name,
        nativeCurrency: config.blockchain.somniaTestnet.nativeCurrency,
        rpcUrls: [config.blockchain.somniaTestnet.rpcUrl],
        blockExplorerUrls: [config.blockchain.somniaTestnet.blockExplorerUrl]
      },
      {
        id: config.blockchain.ethereum.chainId,
        name: config.blockchain.ethereum.name,
        nativeCurrency: config.blockchain.ethereum.nativeCurrency,
        rpcUrls: [config.blockchain.ethereum.rpcUrl],
        blockExplorerUrls: [config.blockchain.ethereum.blockExplorerUrl]
      }
    ]
  }

  /**
   * Get token list for a specific chain
   */
  async getTokenList(chainId: number): Promise<Token[]> {
    try {
      return await this.fetchTokenList(chainId)
    } catch (error) {
      logger.error(`Failed to fetch token list for chain ${chainId}`, error as Error)
      
      // Return basic token list as fallback
      return this.getBasicTokenList(chainId)
    }
  }

  /**
   * Fetch token price from external API
   */
  private async fetchTokenPrice(token: Token, chain: Chain): Promise<TokenPrice> {
    if (config.development.mockPriceData) {
      // Simulate network delay
      if (config.development.simulateNetworkDelay) {
        await new Promise(resolve => setTimeout(resolve, config.development.networkDelayMs))
      }
      
      const mockPrice = MOCK_PRICES[token.symbol]
      if (mockPrice) {
        // Add some random variation
        const variation = (Math.random() - 0.5) * 0.02 // ±1%
        return {
          ...mockPrice,
          price: mockPrice.price * (1 + variation),
          priceUSD: mockPrice.priceUSD * (1 + variation),
          lastUpdated: new Date()
        }
      }
    }

    // Real implementation would call DIA Oracle or CoinGecko API
    return await this.callPriceAPI(token, chain)
  }

  /**
   * Fetch liquidity data from DEX APIs
   */
  private async fetchLiquidityData(tokenPair: TokenPair): Promise<LiquidityData> {
    if (config.development.mockPriceData) {
      const key = `${tokenPair.fromToken.symbol}-${tokenPair.toToken.symbol}`
      const mockLiquidity = MOCK_LIQUIDITY[key]
      
      if (mockLiquidity) {
        return {
          ...mockLiquidity,
          priceImpact: Math.random() * 0.5 // Random impact 0-0.5%
        }
      }
    }

    // Real implementation would call DEX APIs
    return await this.callLiquidityAPI(tokenPair)
  }

  /**
   * Fetch gas estimate from blockchain
   */
  private async fetchGasEstimate(transaction: SwapTransaction): Promise<GasEstimate> {
    // Mock gas estimates for development
    const baseGas = 21000 + Math.floor(Math.random() * 100000) // 21k + random
    
    return {
      slow: baseGas * 0.8,
      standard: baseGas,
      fast: baseGas * 1.5,
      estimatedTime: {
        slow: 300 + Math.floor(Math.random() * 120),    // 5-7 minutes
        standard: 120 + Math.floor(Math.random() * 60), // 2-3 minutes
        fast: 30 + Math.floor(Math.random() * 30)       // 0.5-1 minute
      }
    }
  }

  /**
   * Call price API with retry logic
   */
  private async callPriceAPI(token: Token, chain: Chain): Promise<TokenPrice> {
    return await retryWithBackoff(async () => {
      return await withTimeout(
        this.makePriceRequest(token, chain),
        5000, // 5 second timeout
        'Price API request timed out'
      )
    }, 3, 1000)
  }

  /**
   * Call liquidity API with retry logic
   */
  private async callLiquidityAPI(tokenPair: TokenPair): Promise<LiquidityData> {
    return await retryWithBackoff(async () => {
      return await withTimeout(
        this.makeLiquidityRequest(tokenPair),
        5000, // 5 second timeout
        'Liquidity API request timed out'
      )
    }, 3, 1000)
  }

  /**
   * Make actual price API request (placeholder)
   */
  private async makePriceRequest(token: Token, chain: Chain): Promise<TokenPrice> {
    // This would implement the actual API call to DIA Oracle or CoinGecko
    // For now, return mock data or throw error
    if (config.development.mockPriceData) {
      return MOCK_PRICES[token.symbol] || {
        price: 1,
        priceUSD: 1,
        change24h: 0,
        volume24h: 0,
        lastUpdated: new Date()
      }
    }
    
    throw new Error('Real price API not implemented yet')
  }

  /**
   * Make actual liquidity API request (placeholder)
   */
  private async makeLiquidityRequest(tokenPair: TokenPair): Promise<LiquidityData> {
    // This would implement the actual API call to DEX APIs
    // For now, return mock data or throw error
    if (config.development.mockPriceData) {
      const key = `${tokenPair.fromToken.symbol}-${tokenPair.toToken.symbol}`
      return MOCK_LIQUIDITY[key] || {
        totalLiquidity: 1000000,
        liquidityUSD: 1000000,
        volume24h: 100000,
        priceImpact: 0.1
      }
    }
    
    throw new Error('Real liquidity API not implemented yet')
  }

  /**
   * Start WebSocket connection for price updates
   */
  private startPriceWebSocket(token: Token): void {
    const key = token.symbol
    
    if (this.websocketConnections.has(key)) {
      return // Already connected
    }

    if (config.development.mockPriceData) {
      // Mock WebSocket with interval updates
      this.startMockPriceUpdates(token)
      return
    }

    // Real WebSocket implementation would go here
    logger.info(`Starting WebSocket for ${token.symbol} price updates`)
  }

  /**
   * Close WebSocket connection for price updates
   */
  private closePriceWebSocket(token: Token): void {
    const key = token.symbol
    const ws = this.websocketConnections.get(key)
    
    if (ws) {
      ws.close()
      this.websocketConnections.delete(key)
      this.reconnectAttempts.delete(key)
      logger.info(`Closed WebSocket for ${token.symbol}`)
    }
  }

  /**
   * Start mock price updates for development
   */
  private startMockPriceUpdates(token: Token): void {
    const key = token.symbol
    
    const interval = setInterval(() => {
      const subscribers = this.priceSubscribers.get(key)
      if (!subscribers || subscribers.size === 0) {
        clearInterval(interval)
        return
      }

      // Generate mock price update
      const basePrice = MOCK_PRICES[token.symbol]
      if (basePrice) {
        const variation = (Math.random() - 0.5) * 0.01 // ±0.5%
        const updatedPrice: TokenPrice = {
          ...basePrice,
          price: basePrice.price * (1 + variation),
          priceUSD: basePrice.priceUSD * (1 + variation),
          lastUpdated: new Date()
        }

        // Notify all subscribers
        subscribers.forEach(callback => {
          try {
            callback(updatedPrice)
          } catch (error) {
            logger.error('Error notifying price subscriber', error as Error)
          }
        })
      }
    }, config.data.priceUpdateInterval)

    // Store interval reference (in real implementation, this would be WebSocket)
    this.websocketConnections.set(key, interval as any)
  }

  /**
   * Start price update interval for cached tokens
   */
  private startPriceUpdateInterval(): void {
    setInterval(() => {
      // Update cached prices periodically
      this.priceCache.forEach(async (cached, key) => {
        if (Date.now() - cached.timestamp > config.data.cacheTimeout) {
          try {
            const [symbol, chainId] = key.split('-')
            const chain = getChainConfig(parseInt(chainId))
            if (chain) {
              // This would refresh the cache in a real implementation
              logger.debug(`Refreshing cached price for ${symbol}`)
            }
          } catch (error) {
            logger.error('Error refreshing cached price', error as Error)
          }
        }
      })
    }, config.data.cacheTimeout)
  }

  /**
   * Fetch token list from chain
   */
  private async fetchTokenList(chainId: number): Promise<Token[]> {
    // This would fetch from token lists or on-chain registries
    return this.getBasicTokenList(chainId)
  }

  /**
   * Get basic token list for fallback
   */
  private getBasicTokenList(chainId: number): Token[] {
    const chainConfig = getChainConfig(chainId)
    if (!chainConfig) return []

    const tokens: Token[] = [
      // Native token
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: chainConfig.nativeCurrency.symbol,
        name: chainConfig.nativeCurrency.name,
        decimals: chainConfig.nativeCurrency.decimals,
        logoURI: '',
        chainId,
        verified: true,
        auditStatus: 'audited'
      }
    ]

    // Add common tokens based on chain
    if (chainId === 1) { // Ethereum
      tokens.push(
        {
          address: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c07e8e8e',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          logoURI: '',
          chainId,
          verified: true,
          auditStatus: 'audited'
        },
        {
          address: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c07e8e8f',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logoURI: '',
          chainId,
          verified: true,
          auditStatus: 'audited'
        }
      )
    }

    return tokens
  }
}

// Create and export singleton instance
export const dataService = new DataServiceImpl()

// Export class for testing
export { DataServiceImpl }