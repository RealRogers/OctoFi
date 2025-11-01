/**
 * Pool Service
 * Service for pool data management and caching
 */

import { StakingPool, APYDataPoint, PoolStats, CachedData } from '@/types/staking'
import { stakingService } from './stakingService'

/**
 * Pool Service Class
 */
class PoolService {
  private cache: Map<string, CachedData<any>> = new Map()
  private readonly DEFAULT_CACHE_TTL = 60000 // 1 minute

  // ==========================================================================
  // Pool Data
  // ==========================================================================

  /**
   * Fetch pool data with caching
   * @param poolAddress - Pool contract address
   * @returns Pool information
   */
  async fetchPoolData(poolAddress: string): Promise<StakingPool> {
    const cacheKey = `pool_${poolAddress}`
    const cached = this.getCached<StakingPool>(cacheKey, this.DEFAULT_CACHE_TTL)
    
    if (cached) {
      return cached
    }

    const pool = await stakingService.getPool(poolAddress)
    this.setCache(cacheKey, pool)
    
    return pool
  }

  /**
   * Get historical APY data for a pool
   * @param poolAddress - Pool contract address
   * @param days - Number of days of history
   * @returns Array of APY data points
   */
  async getHistoricalAPY(poolAddress: string, days: number): Promise<APYDataPoint[]> {
    const cacheKey = `apy_history_${poolAddress}_${days}`
    const cached = this.getCached<APYDataPoint[]>(cacheKey, 300000) // 5 min cache
    
    if (cached) {
      return cached
    }

    // In production, this would fetch from a backend or subgraph
    // For now, generate mock historical data
    const currentPool = await this.fetchPoolData(poolAddress)
    const dataPoints: APYDataPoint[] = []
    
    const now = new Date()
    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // Simulate APY fluctuation
      const variance = (Math.random() - 0.5) * 2 // -1 to 1
      const apy = Math.max(0, currentPool.apy + variance)
      
      dataPoints.push({ date, apy })
    }

    this.setCache(cacheKey, dataPoints)
    return dataPoints
  }

  /**
   * Get pool statistics
   * @param poolAddress - Pool contract address
   * @returns Pool statistics
   */
  async getPoolStats(poolAddress: string): Promise<PoolStats> {
    const cacheKey = `pool_stats_${poolAddress}`
    const cached = this.getCached<PoolStats>(cacheKey, this.DEFAULT_CACHE_TTL)
    
    if (cached) {
      return cached
    }

    // In production, this would fetch from a backend or subgraph
    // For now, return mock data
    const pool = await this.fetchPoolData(poolAddress)
    
    const stats: PoolStats = {
      totalStakers: pool.totalStakers,
      averageStake: (pool.tvl / Math.max(pool.totalStakers, 1)).toFixed(2),
      totalRewardsDistributed: '0', // Would track this
      uptimePercentage: 99.9
    }

    this.setCache(cacheKey, stats)
    return stats
  }

  // ==========================================================================
  // Cache Management
  // ==========================================================================

  /**
   * Get cached data if not expired
   * @param key - Cache key
   * @param maxAge - Maximum age in milliseconds
   * @returns Cached data or null
   */
  private getCached<T>(key: string, maxAge: number): T | null {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }

    const now = Date.now()
    if (now > cached.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  /**
   * Set cache data
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds
   */
  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_CACHE_TTL): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    })
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clear cache for specific pool
   * @param poolAddress - Pool contract address
   */
  clearPoolCache(poolAddress: string): void {
    const keysToDelete: string[] = []
    
    this.cache.forEach((_, key) => {
      if (key.includes(poolAddress)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }
}

// Export singleton instance
export const poolService = new PoolService()
