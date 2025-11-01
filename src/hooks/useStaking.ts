/**
 * useStaking Hook
 * Main orchestration hook for all staking functionality
 */

import { useCallback } from 'react'
import { useStakingPools } from './useStakingPools'
import { useStakingPositions } from './useStakingPositions'
import { 
  useStakeMutation, 
  useWithdrawMutation, 
  useClaimMutation, 
  useApproveMutation 
} from './useStakingMutations'
import { stakingService } from '@/services/stakingService'
import { TRANSACTION_CONFIG } from '@/lib/stakingConstants'

/**
 * Main staking hook that provides unified interface for all staking operations
 * @param userAddress - User's wallet address
 * @returns Complete staking interface
 */
export const useStaking = (userAddress?: string) => {
  // Queries
  const pools = useStakingPools()
  const positions = useStakingPositions(userAddress)
  
  // Mutations
  const stakeMutation = useStakeMutation()
  const withdrawMutation = useWithdrawMutation()
  const claimMutation = useClaimMutation()
  const approveMutation = useApproveMutation()

  /**
   * Stake tokens in a pool
   * Handles approval if needed
   */
  const stake = useCallback(async (poolAddress: string, amount: string) => {
    if (!userAddress) {
      throw new Error('Wallet not connected')
    }

    // Get pool info to find token address
    const pool = pools.allPools.find(p => p.address === poolAddress)
    if (!pool) {
      throw new Error('Pool not found')
    }

    // Check allowance
    const allowance = await stakingService.checkAllowance(
      pool.tokenAddress,
      userAddress,
      poolAddress
    )

    const needsApproval = parseFloat(allowance) < parseFloat(amount)

    // Approve if needed
    if (needsApproval) {
      await approveMutation.mutateAsync({
        tokenAddress: pool.tokenAddress,
        spenderAddress: poolAddress,
        amount: TRANSACTION_CONFIG.APPROVAL_AMOUNT
      })
    }

    // Execute stake
    return await stakeMutation.mutateAsync({ poolAddress, amount })
  }, [userAddress, pools.allPools, stakeMutation, approveMutation])

  /**
   * Withdraw tokens from a pool
   */
  const withdraw = useCallback(async (poolAddress: string, amount: string) => {
    return await withdrawMutation.mutateAsync({ poolAddress, amount })
  }, [withdrawMutation])

  /**
   * Claim rewards from a pool
   */
  const claim = useCallback(async (poolAddress: string) => {
    return await claimMutation.mutateAsync({ poolAddress })
  }, [claimMutation])

  /**
   * Refetch all data
   */
  const refetchAll = useCallback(() => {
    pools.refetch()
    positions.refetch()
  }, [pools, positions])

  return {
    // Data
    pools: pools.pools,
    allPools: pools.allPools,
    positions: positions.positions,
    stats: positions.stats,
    predictions: pools.predictions,
    
    // Loading states
    isLoading: pools.isLoading || positions.isLoading,
    isPoolsLoading: pools.isLoading,
    isPositionsLoading: positions.isLoading,
    isFetching: pools.isFetching || positions.isFetching,
    
    // Mutation states
    isStaking: stakeMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    isClaiming: claimMutation.isPending,
    isApproving: approveMutation.isPending,
    
    // Errors
    error: pools.error || positions.error,
    poolsError: pools.error,
    positionsError: positions.error,
    
    // Actions
    stake,
    withdraw,
    claim,
    
    // Refetch
    refetch: refetchAll,
    refetchPools: pools.refetch,
    refetchPositions: positions.refetch,
    
    // Pool controls
    poolFilters: pools.filters,
    setPoolFilters: pools.setFilters,
    updatePoolFilter: pools.updateFilter,
    resetPoolFilters: pools.resetFilters,
    poolSortBy: pools.sortBy,
    setPoolSortBy: pools.setSortBy,
    poolSortOrder: pools.sortOrder,
    setPoolSortOrder: pools.setSortOrder,
    togglePoolSortOrder: pools.toggleSortOrder,
    
    // Computed values
    hasPositions: positions.hasPositions,
    hasLockedPositions: positions.hasLockedPositions,
    canClaimAny: positions.canClaimAny,
    canWithdrawAny: positions.canWithdrawAny,
    poolCount: pools.poolCount,
    totalPoolCount: pools.totalPoolCount,
    hasPoolFilters: pools.hasFilters
  }
}
