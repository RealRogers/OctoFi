/**
 * useStakingPools Hook
 * Hook for managing staking pools data with filtering and sorting
 */

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  StakingPool, 
  PoolFilters, 
  PoolSortBy, 
  SortOrder,
  UseStakingPoolsOptions,
  APYPrediction
} from '@/types/staking'
import { stakingService } from '@/services/stakingService'
import { aiPredictionService } from '@/services/aiPredictionService'
import { QUERY_STALE_TIME, QUERY_REFETCH_INTERVAL } from '@/lib/stakingConstants'

/**
 * Hook for managing staking pools with filtering, sorting, and AI predictions
 * @param options - Hook options
 * @returns Pools data and controls
 */
export const useStakingPools = (options?: UseStakingPoolsOptions) => {
  const { enabled = true, refetchInterval } = options || {}

  // Filter and sort state
  const [filters, setFilters] = useState<PoolFilters>({
    search: '',
    minAPY: 0,
    maxAPY: 100,
    minTVL: 0,
    lockPeriod: 'all',
    showAIPredictions: false
  })

  const [sortBy, setSortBy] = useState<PoolSortBy>('apy')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Fetch pools
  const poolsQuery = useQuery({
    queryKey: ['staking', 'pools'],
    queryFn: () => stakingService.getAllPools(),
    staleTime: QUERY_STALE_TIME.POOLS,
    refetchInterval: refetchInterval || QUERY_REFETCH_INTERVAL.POOLS,
    enabled
  })

  // Fetch AI predictions for all pools
  const predictionsQuery = useQuery({
    queryKey: ['staking', 'predictions'],
    queryFn: async () => {
      if (!poolsQuery.data) return {}
      
      const results = await Promise.allSettled(
        poolsQuery.data.map(pool => aiPredictionService.predictAPY(pool.address))
      )
      
      return results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled' && poolsQuery.data) {
          acc[poolsQuery.data[index].address] = result.value
        }
        return acc
      }, {} as Record<string, APYPrediction>)
    },
    enabled: !!poolsQuery.data && enabled,
    staleTime: QUERY_STALE_TIME.PREDICTIONS
  })

  // Filter and sort pools
  const filteredPools = useMemo(() => {
    if (!poolsQuery.data) return []

    let result = [...poolsQuery.data]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(pool => 
        pool.name.toLowerCase().includes(searchLower) ||
        pool.symbol.toLowerCase().includes(searchLower)
      )
    }

    // Apply APY filter
    result = result.filter(pool => 
      pool.apy >= filters.minAPY && pool.apy <= filters.maxAPY
    )

    // Apply TVL filter
    result = result.filter(pool => pool.tvl >= filters.minTVL)

    // Apply lock period filter
    if (filters.lockPeriod !== 'all') {
      if (filters.lockPeriod === 'none') {
        result = result.filter(pool => pool.lockPeriod === 0)
      } else {
        const days = parseInt(filters.lockPeriod)
        const seconds = days * 24 * 60 * 60
        result = result.filter(pool => pool.lockPeriod === seconds)
      }
    }

    // Apply AI predictions filter
    if (filters.showAIPredictions && predictionsQuery.data) {
      result = result.filter(pool => !!predictionsQuery.data?.[pool.address])
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'apy':
          comparison = a.apy - b.apy
          break
        case 'tvl':
          comparison = a.tvl - b.tvl
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'created':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [poolsQuery.data, filters, sortBy, sortOrder, predictionsQuery.data])

  // Helper functions
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      minAPY: 0,
      maxAPY: 100,
      minTVL: 0,
      lockPeriod: 'all',
      showAIPredictions: false
    })
  }

  const updateFilter = <K extends keyof PoolFilters>(
    key: K,
    value: PoolFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return {
    // Data
    pools: filteredPools,
    allPools: poolsQuery.data || [],
    predictions: predictionsQuery.data || {},
    
    // Loading states
    isLoading: poolsQuery.isLoading,
    isPredictionsLoading: predictionsQuery.isLoading,
    isFetching: poolsQuery.isFetching,
    
    // Error states
    error: poolsQuery.error,
    predictionsError: predictionsQuery.error,
    
    // Filter state
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    
    // Sort state
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    toggleSortOrder,
    
    // Refetch
    refetch: poolsQuery.refetch,
    refetchPredictions: predictionsQuery.refetch,
    
    // Computed values
    poolCount: filteredPools.length,
    totalPoolCount: poolsQuery.data?.length || 0,
    hasFilters: filters.search !== '' || 
                filters.minAPY !== 0 || 
                filters.maxAPY !== 100 || 
                filters.minTVL !== 0 || 
                filters.lockPeriod !== 'all' ||
                filters.showAIPredictions
  }
}
