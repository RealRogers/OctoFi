/**
 * useAssetAllocation Hook
 * 
 * Fetches real portfolio allocation data.
 * Replaces hardcoded mock data with actual portfolio information.
 */

import { useQuery } from '@tanstack/react-query'
import { portfolioService } from '@/services/portfolioService'
import type { AssetAllocationItem as ServiceAssetAllocationItem } from '@/services/portfolioService'
import { CACHE_TIMES } from '@/constants/dashboard'
import { logWarning } from '@/utils/errorHandling'

/**
 * Asset allocation item (re-export from service)
 */
export type AssetAllocationItem = ServiceAssetAllocationItem

/**
 * Return type for the useAssetAllocation hook
 */
export interface UseAssetAllocationReturn {
  allocation: AssetAllocationItem[]
  isLoading: boolean
  error: Error | null
  totalValue: number
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching portfolio asset allocation
 * 
 * Fetches real portfolio data instead of using hardcoded mock values.
 * Provides loading and error states for better UX.
 * 
 * @returns Asset allocation data and state
 * 
 * @example
 * ```typescript
 * function Dashboard() {
 *   const {
 *     allocation,
 *     isLoading,
 *     totalValue
 *   } = useAssetAllocation()
 *   
 *   if (isLoading) return <Skeleton />
 *   
 *   return (
 *     <PieChart data={allocation} total={totalValue} />
 *   )
 * }
 * ```
 */
export function useAssetAllocation(): UseAssetAllocationReturn {
  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['asset-allocation'],
    queryFn: fetchAssetAllocation,
    staleTime: CACHE_TIMES.STALE_TIME,
    cacheTime: CACHE_TIMES.CACHE_TIME,
    retry: 2,
    retryDelay: 1000,
  })

  const refetch = async () => {
    await refetchQuery()
  }

  return {
    allocation: data?.allocation || [],
    isLoading,
    error: error as Error | null,
    totalValue: data?.totalValue || 0,
    refetch,
  }
}

/**
 * Fetch asset allocation from portfolio service
 * 
 * @returns Asset allocation data
 */
async function fetchAssetAllocation(): Promise<{
  allocation: AssetAllocationItem[]
  totalValue: number
}> {
  try {
    // Fetch from portfolio service
    const allocation = await portfolioService.getAssetAllocation()
    const totalValue = await portfolioService.getTotalValue()
    
    return {
      allocation,
      totalValue,
    }
  } catch (error) {
    logWarning('Failed to fetch asset allocation', { error })
    throw error
  }
}



/**
 * Validate asset allocation data
 * 
 * @param data - Data to validate
 * @returns True if valid
 */
function isValidAllocationData(data: unknown): data is {
  allocation: AssetAllocationItem[]
  totalValue: number
} {
  if (!data || typeof data !== 'object') {
    return false
  }

  const obj = data as Record<string, unknown>

  if (!Array.isArray(obj.allocation) || typeof obj.totalValue !== 'number') {
    return false
  }

  // Validate each allocation item
  return obj.allocation.every(item => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as any).name === 'string' &&
      typeof (item as any).value === 'number' &&
      typeof (item as any).color === 'string' &&
      typeof (item as any).balance === 'number' &&
      (item as any).value >= 0 &&
      (item as any).value <= 100
    )
  })
}

/**
 * Calculate total percentage from allocation items
 * 
 * @param allocation - Allocation items
 * @returns Total percentage (should be ~100)
 */
export function calculateTotalPercentage(allocation: AssetAllocationItem[]): number {
  return allocation.reduce((sum, item) => sum + item.value, 0)
}

/**
 * Sort allocation by value (descending)
 * 
 * @param allocation - Allocation items
 * @returns Sorted allocation
 */
export function sortAllocationByValue(
  allocation: AssetAllocationItem[]
): AssetAllocationItem[] {
  return [...allocation].sort((a, b) => b.value - a.value)
}

/**
 * Get top N assets by allocation
 * 
 * @param allocation - Allocation items
 * @param n - Number of top assets to return
 * @returns Top N assets
 */
export function getTopAssets(
  allocation: AssetAllocationItem[],
  n: number
): AssetAllocationItem[] {
  return sortAllocationByValue(allocation).slice(0, n)
}

/**
 * Format allocation for display
 * 
 * @param allocation - Allocation items
 * @returns Formatted allocation with percentages
 */
export function formatAllocationForDisplay(
  allocation: AssetAllocationItem[]
): Array<AssetAllocationItem & { displayValue: string }> {
  return allocation.map(item => ({
    ...item,
    displayValue: `${item.value.toFixed(1)}%`,
  }))
}
