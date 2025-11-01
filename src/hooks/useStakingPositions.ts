/**
 * useStakingPositions Hook
 * Hook for managing user's staking positions
 */

import { useQuery } from '@tanstack/react-query'
import { StakingPosition, UseStakingPositionsOptions } from '@/types/staking'
import { stakingService } from '@/services/stakingService'
import { QUERY_STALE_TIME, QUERY_REFETCH_INTERVAL } from '@/lib/stakingConstants'
import { calculateWeightedAPY } from '@/lib/stakingUtils'

/**
 * Hook for fetching and managing user's staking positions
 * @param userAddress - User's wallet address
 * @param options - Hook options
 * @returns Positions data and stats
 */
export const useStakingPositions = (
  userAddress?: string,
  options?: UseStakingPositionsOptions
) => {
  const { enabled = true, refetchInterval } = options || {}

  const query = useQuery({
    queryKey: ['staking', 'positions', userAddress],
    queryFn: async () => {
      if (!userAddress) return []
      return await stakingService.getUserPositions(userAddress)
    },
    enabled: !!userAddress && enabled,
    staleTime: QUERY_STALE_TIME.POSITIONS,
    refetchInterval: refetchInterval || QUERY_REFETCH_INTERVAL.POSITIONS
  })

  // Calculate aggregated stats
  const stats = {
    totalStakedUSD: query.data?.reduce((sum, pos) => sum + pos.stakedAmountUSD, 0) || 0,
    totalRewardsUSD: query.data?.reduce((sum, pos) => sum + pos.rewardsEarnedUSD, 0) || 0,
    averageAPY: query.data ? calculateWeightedAPY(query.data) : 0,
    activePositions: query.data?.length || 0,
    lockedPositions: query.data?.filter(pos => pos.isLocked).length || 0,
    unlockedPositions: query.data?.filter(pos => !pos.isLocked).length || 0
  }

  return {
    // Data
    positions: query.data || [],
    stats,
    
    // Loading states
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    
    // Error state
    error: query.error,
    
    // Refetch
    refetch: query.refetch,
    
    // Computed values
    hasPositions: (query.data?.length || 0) > 0,
    hasLockedPositions: stats.lockedPositions > 0,
    canClaimAny: query.data?.some(pos => pos.canClaim) || false,
    canWithdrawAny: query.data?.some(pos => pos.canWithdraw) || false
  }
}
