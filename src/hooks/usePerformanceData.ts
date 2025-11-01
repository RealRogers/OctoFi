/**
 * usePerformanceData Hook
 * 
 * Fetches and manages performance data with smart polling.
 * Implements Page Visibility API to pause polling when tab is inactive.
 */

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { performanceService } from '@/services/performanceService'
import type { PerformanceDataPoint as ServicePerformanceDataPoint } from '@/services/performanceService'
import type { PerformanceMetrics } from '@/services/types'
import { POLLING_INTERVALS, CACHE_TIMES } from '@/constants/dashboard'
import { isValidPerformanceData } from '@/utils/validators'
import { logWarning } from '@/utils/errorHandling'

/**
 * Performance data point for historical charts (re-export from service)
 */
export type PerformanceDataPoint = ServicePerformanceDataPoint

/**
 * Options for the usePerformanceData hook
 */
export interface UsePerformanceDataOptions {
  timeframe: '24h' | '7d' | '30d' | 'all'
  isActive: boolean
  refreshPerformance?: () => Promise<PerformanceMetrics>
}

/**
 * Return type for the usePerformanceData hook
 */
export interface UsePerformanceDataReturn {
  data: PerformanceDataPoint[]
  livePerformance: PerformanceMetrics | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching and managing performance data
 * 
 * Features:
 * - Smart polling that respects browser visibility
 * - Automatic cache management
 * - Real-time performance metrics
 * - Historical data generation
 * 
 * @param options - Configuration options
 * @returns Performance data and state
 * 
 * @example
 * ```typescript
 * function Dashboard() {
 *   const { isActive, refreshPerformance } = useTradingAgent()
 *   const [timeframe, setTimeframe] = useState('7d')
 *   
 *   const {
 *     data,
 *     livePerformance,
 *     isLoading
 *   } = usePerformanceData({
 *     timeframe,
 *     isActive,
 *     refreshPerformance
 *   })
 *   
 *   return <PerformanceChart data={data} />
 * }
 * ```
 */
export function usePerformanceData(
  options: UsePerformanceDataOptions
): UsePerformanceDataReturn {
  const { timeframe, isActive, refreshPerformance } = options
  
  // Track page visibility for smart polling
  const [isVisible, setIsVisible] = useState(!document.hidden)
  
  // Track error count for exponential backoff
  const [errorCount, setErrorCount] = useState(0)

  // Listen to page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden
      setIsVisible(visible)
      
      if (visible) {
        // Reset error count when page becomes visible
        setErrorCount(0)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Calculate polling interval based on visibility and agent state
  const pollingInterval = useMemo(() => {
    if (!isVisible) {
      // Slower polling when tab is inactive
      return POLLING_INTERVALS.INACTIVE
    }
    
    if (!isActive) {
      // Slower polling when agent is inactive
      return POLLING_INTERVALS.INACTIVE
    }
    
    // Apply exponential backoff if there have been errors
    if (errorCount > 0) {
      const backoff = Math.min(
        POLLING_INTERVALS.ERROR_BACKOFF_BASE * Math.pow(2, errorCount - 1),
        POLLING_INTERVALS.ERROR_BACKOFF_MAX
      )
      return backoff
    }
    
    // Normal active polling
    return POLLING_INTERVALS.ACTIVE
  }, [isVisible, isActive, errorCount])

  // Fetch live performance data with smart polling
  const {
    data: livePerformance,
    isLoading: isLoadingLive,
    error: liveError,
    refetch: refetchLive,
  } = useQuery({
    queryKey: ['agent-performance', isActive],
    queryFn: async () => {
      if (!refreshPerformance) {
        throw new Error('refreshPerformance function not provided')
      }
      
      try {
        const performance = await refreshPerformance()
        
        // Validate the performance data
        if (!isValidPerformanceData(performance)) {
          logWarning('Invalid performance data received', { performance })
          throw new Error('Invalid performance data structure')
        }
        
        // Reset error count on successful fetch
        setErrorCount(0)
        
        return performance
      } catch (error) {
        // Increment error count for backoff
        setErrorCount(prev => prev + 1)
        throw error
      }
    },
    refetchInterval: pollingInterval,
    enabled: isActive && !!refreshPerformance,
    staleTime: CACHE_TIMES.STALE_TIME,
    cacheTime: CACHE_TIMES.CACHE_TIME,
    // Retry with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => {
      return Math.min(
        POLLING_INTERVALS.ERROR_BACKOFF_BASE * Math.pow(2, attemptIndex),
        POLLING_INTERVALS.ERROR_BACKOFF_MAX
      )
    },
  })

  // Fetch historical performance data
  const { data: historicalData = [] } = useQuery({
    queryKey: ['performance-history', timeframe],
    queryFn: async () => {
      return await performanceService.getHistoricalPerformance(timeframe)
    },
    staleTime: CACHE_TIMES.STALE_TIME,
    cacheTime: CACHE_TIMES.CACHE_TIME,
    enabled: true,
  })

  // Refetch function
  const refetch = async () => {
    await refetchLive()
  }

  return {
    data: historicalData,
    livePerformance,
    isLoading: isLoadingLive,
    error: liveError as Error | null,
    refetch,
  }
}



/**
 * Hook for managing performance data with exponential backoff on errors
 * 
 * This is a lower-level hook that can be used when you need more control
 * over the polling behavior.
 * 
 * @param queryFn - Function to fetch data
 * @param options - Query options
 * @returns Query result with smart polling
 */
export function useSmartPolling<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: {
    activeInterval: number
    inactiveInterval: number
    enabled: boolean
  }
) {
  const [isVisible, setIsVisible] = useState(!document.hidden)
  const [errorCount, setErrorCount] = useState(0)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const pollingInterval = useMemo(() => {
    if (!isVisible) {
      return options.inactiveInterval
    }
    
    if (errorCount > 0) {
      return Math.min(
        POLLING_INTERVALS.ERROR_BACKOFF_BASE * Math.pow(2, errorCount - 1),
        POLLING_INTERVALS.ERROR_BACKOFF_MAX
      )
    }
    
    return options.activeInterval
  }, [isVisible, errorCount, options.activeInterval, options.inactiveInterval])

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await queryFn()
        setErrorCount(0)
        return result
      } catch (error) {
        setErrorCount(prev => prev + 1)
        throw error
      }
    },
    refetchInterval: pollingInterval,
    enabled: options.enabled,
    staleTime: CACHE_TIMES.STALE_TIME,
    cacheTime: CACHE_TIMES.CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => {
      return Math.min(
        POLLING_INTERVALS.ERROR_BACKOFF_BASE * Math.pow(2, attemptIndex),
        POLLING_INTERVALS.ERROR_BACKOFF_MAX
      )
    },
  })
}
