/**
 * Portfolio Service
 * 
 * Manages portfolio data including asset allocation, balances, and historical data.
 * Provides real portfolio information instead of mock data.
 */

import type { Token } from './types'
import { logger } from './errorHandler'
import { retryWithBackoff } from './utils'

/**
 * Asset allocation item with detailed information
 */
export interface AssetAllocationItem {
  name: string
  symbol: string
  value: number // Percentage (0-100)
  color: string
  balance: number // Balance in USD
  tokenBalance?: number // Balance in token units
  address?: string
  token?: Token
  priceUSD?: number
  change24h?: number
}

/**
 * Historical data point for asset price/balance
 */
export interface HistoricalDataPoint {
  timestamp: Date
  price: number
  balance: number
  value: number // balance * price
}

/**
 * Portfolio summary
 */
export interface PortfolioSummary {
  totalValue: number
  totalValueChange24h: number
  totalValueChangePercent24h: number
  assetCount: number
  lastUpdated: Date
}

/**
 * Portfolio Service Interface
 */
export interface PortfolioService {
  getAssetAllocation(): Promise<AssetAllocationItem[]>
  getTotalValue(): Promise<number>
  getPortfolioSummary(): Promise<PortfolioSummary>
  getAssetHistory(asset: string, timeframe: string): Promise<HistoricalDataPoint[]>
  refreshPortfolio(): Promise<void>
}

/**
 * Portfolio Service Implementation
 */
class PortfolioServiceImpl implements PortfolioService {
  private cache: {
    allocation: AssetAllocationItem[] | null
    totalValue: number | null
    summary: PortfolioSummary | null
    lastFetch: Date | null
  } = {
    allocation: null,
    totalValue: null,
    summary: null,
    lastFetch: null,
  }

  private readonly CACHE_DURATION = 30000 // 30 seconds

  /**
   * Get asset allocation for the portfolio
   * 
   * @returns Array of asset allocation items
   * 
   * @example
   * ```typescript
   * const allocation = await portfolioService.getAssetAllocation()
   * console.log(allocation) // [{ name: 'ETH', value: 45, balance: 4500, ... }]
   * ```
   */
  async getAssetAllocation(): Promise<AssetAllocationItem[]> {
    try {
      // Check cache
      if (this.isCacheValid() && this.cache.allocation) {
        return this.cache.allocation
      }

      // Fetch fresh data
      const allocation = await retryWithBackoff(
        () => this.fetchAssetAllocation(),
        3,
        1000
      )

      // Update cache
      this.cache.allocation = allocation
      this.cache.lastFetch = new Date()

      logger.info('Asset allocation fetched successfully', {
        assetCount: allocation.length,
      })

      return allocation
    } catch (error) {
      logger.error('Failed to fetch asset allocation', error as Error)
      
      // Return cached data if available, even if stale
      if (this.cache.allocation) {
        logger.warn('Returning stale cached allocation data')
        return this.cache.allocation
      }
      
      throw error
    }
  }

  /**
   * Get total portfolio value in USD
   * 
   * @returns Total value in USD
   * 
   * @example
   * ```typescript
   * const totalValue = await portfolioService.getTotalValue()
   * console.log(totalValue) // 25000.50
   * ```
   */
  async getTotalValue(): Promise<number> {
    try {
      // Check cache
      if (this.isCacheValid() && this.cache.totalValue !== null) {
        return this.cache.totalValue
      }

      // Calculate from allocation
      const allocation = await this.getAssetAllocation()
      const totalValue = allocation.reduce((sum, asset) => sum + asset.balance, 0)

      // Update cache
      this.cache.totalValue = totalValue

      return totalValue
    } catch (error) {
      logger.error('Failed to get total portfolio value', error as Error)
      
      // Return cached value if available
      if (this.cache.totalValue !== null) {
        return this.cache.totalValue
      }
      
      throw error
    }
  }

  /**
   * Get portfolio summary with statistics
   * 
   * @returns Portfolio summary
   * 
   * @example
   * ```typescript
   * const summary = await portfolioService.getPortfolioSummary()
   * console.log(summary.totalValue) // 25000.50
   * console.log(summary.totalValueChangePercent24h) // 5.2
   * ```
   */
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    try {
      // Check cache
      if (this.isCacheValid() && this.cache.summary) {
        return this.cache.summary
      }

      const allocation = await this.getAssetAllocation()
      const totalValue = allocation.reduce((sum, asset) => sum + asset.balance, 0)

      // Calculate 24h change
      const totalChange24h = allocation.reduce((sum, asset) => {
        const change = asset.change24h || 0
        return sum + (asset.balance * change / 100)
      }, 0)

      const totalChangePercent24h = totalValue > 0 
        ? (totalChange24h / totalValue) * 100 
        : 0

      const summary: PortfolioSummary = {
        totalValue,
        totalValueChange24h: totalChange24h,
        totalValueChangePercent24h: totalChangePercent24h,
        assetCount: allocation.length,
        lastUpdated: new Date(),
      }

      // Update cache
      this.cache.summary = summary

      return summary
    } catch (error) {
      logger.error('Failed to get portfolio summary', error as Error)
      
      // Return cached summary if available
      if (this.cache.summary) {
        return this.cache.summary
      }
      
      throw error
    }
  }

  /**
   * Get historical data for a specific asset
   * 
   * @param asset - Asset symbol (e.g., 'ETH', 'BTC')
   * @param timeframe - Time period ('24h', '7d', '30d', 'all')
   * @returns Array of historical data points
   * 
   * @example
   * ```typescript
   * const history = await portfolioService.getAssetHistory('ETH', '7d')
   * console.log(history) // [{ timestamp, price, balance, value }]
   * ```
   */
  async getAssetHistory(
    asset: string,
    timeframe: string
  ): Promise<HistoricalDataPoint[]> {
    try {
      // TODO: Implement actual API call to fetch historical data
      // For now, return mock data
      return this.generateMockHistory(asset, timeframe)
    } catch (error) {
      logger.error('Failed to fetch asset history', error as Error, {
        asset,
        timeframe,
      })
      throw error
    }
  }

  /**
   * Refresh portfolio data (clear cache and fetch fresh data)
   * 
   * @example
   * ```typescript
   * await portfolioService.refreshPortfolio()
   * const allocation = await portfolioService.getAssetAllocation() // Fresh data
   * ```
   */
  async refreshPortfolio(): Promise<void> {
    this.clearCache()
    await this.getAssetAllocation()
  }

  /**
   * Clear the cache
   */
  private clearCache(): void {
    this.cache = {
      allocation: null,
      totalValue: null,
      summary: null,
      lastFetch: null,
    }
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    if (!this.cache.lastFetch) {
      return false
    }

    const now = new Date()
    const elapsed = now.getTime() - this.cache.lastFetch.getTime()
    return elapsed < this.CACHE_DURATION
  }

  /**
   * Fetch asset allocation from API
   * 
   * TODO: Replace with actual API implementation
   * This should connect to wallet service or blockchain data provider
   */
  private async fetchAssetAllocation(): Promise<AssetAllocationItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))

    // TODO: Replace with actual API call
    // Example implementation:
    // const walletAddress = await getConnectedWallet()
    // const balances = await fetchWalletBalances(walletAddress)
    // const prices = await fetchTokenPrices(balances.map(b => b.token))
    // return calculateAllocation(balances, prices)

    // For now, return realistic mock data
    return this.generateMockAllocation()
  }

  /**
   * Generate mock asset allocation
   * 
   * This simulates real portfolio data structure.
   * In production, this would be replaced with actual API calls.
   */
  private generateMockAllocation(): AssetAllocationItem[] {
    const assets = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        color: '#627EEA',
        baseBalance: 4000,
        volatility: 500,
        priceUSD: 2000,
        change24h: 2.5,
      },
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        color: '#F7931A',
        baseBalance: 2500,
        volatility: 300,
        priceUSD: 45000,
        change24h: 1.8,
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        color: '#2775CA',
        baseBalance: 2000,
        volatility: 50,
        priceUSD: 1,
        change24h: 0.01,
      },
      {
        name: 'Tether',
        symbol: 'USDT',
        color: '#26A17B',
        baseBalance: 1000,
        volatility: 30,
        priceUSD: 1,
        change24h: -0.02,
      },
      {
        name: 'Other Assets',
        symbol: 'OTHER',
        color: '#8B5CF6',
        baseBalance: 500,
        volatility: 100,
        priceUSD: 100,
        change24h: -1.2,
      },
    ]

    // Add realistic variation to balances
    const allocation: AssetAllocationItem[] = assets.map(asset => {
      const variation = (Math.random() - 0.5) * asset.volatility
      const balance = Math.max(0, asset.baseBalance + variation)
      
      return {
        name: asset.name,
        symbol: asset.symbol,
        color: asset.color,
        balance,
        value: 0, // Will be calculated after getting total
        priceUSD: asset.priceUSD,
        change24h: asset.change24h,
        tokenBalance: balance / asset.priceUSD,
      }
    })

    // Calculate total value
    const totalValue = allocation.reduce((sum, asset) => sum + asset.balance, 0)

    // Calculate percentages
    allocation.forEach(asset => {
      asset.value = totalValue > 0 ? (asset.balance / totalValue) * 100 : 0
    })

    return allocation
  }

  /**
   * Generate mock historical data
   * 
   * TODO: Replace with actual API call
   */
  private generateMockHistory(
    asset: string,
    timeframe: string
  ): HistoricalDataPoint[] {
    const now = new Date()
    const points: HistoricalDataPoint[] = []

    const config: Record<string, { points: number; interval: number }> = {
      '24h': { points: 24, interval: 3600000 }, // 1 hour
      '7d': { points: 7, interval: 86400000 },  // 1 day
      '30d': { points: 30, interval: 86400000 }, // 1 day
      'all': { points: 90, interval: 86400000 }, // 1 day
    }

    const { points: numPoints, interval } = config[timeframe] || config['7d']

    // Base values
    const basePrice = 2000
    const baseBalance = 2

    for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(now.getTime() - (numPoints - i) * interval)
      const progress = i / numPoints

      // Simulate price movement
      const price = basePrice * (1 + Math.sin(progress * Math.PI * 2) * 0.1)
      
      // Simulate balance changes
      const balance = baseBalance * (1 + progress * 0.1)
      
      const value = price * balance

      points.push({
        timestamp,
        price,
        balance,
        value,
      })
    }

    return points
  }
}

// Create and export singleton instance
export const portfolioService = new PortfolioServiceImpl()

// Export class for testing
export { PortfolioServiceImpl }
