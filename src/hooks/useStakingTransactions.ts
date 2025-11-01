/**
 * useStakingTransactions Hook
 * Hook for managing staking transaction history
 */

import { useQuery } from '@tanstack/react-query'
import { StakingTransaction } from '@/types/staking'
import { QUERY_STALE_TIME } from '@/lib/stakingConstants'

/**
 * Hook for fetching user's staking transaction history
 * @param userAddress - User's wallet address
 * @returns Transaction history data
 */
export const useStakingTransactions = (userAddress?: string) => {
  const query = useQuery({
    queryKey: ['staking', 'transactions', userAddress],
    queryFn: async (): Promise<StakingTransaction[]> => {
      if (!userAddress) return []
      
      // TODO: In production, fetch from blockchain events or backend
      // For now, return empty array
      return []
    },
    enabled: !!userAddress,
    staleTime: QUERY_STALE_TIME.TRANSACTIONS
  })

  // Filter transactions by type
  const stakeTransactions = query.data?.filter(tx => tx.type === 'stake') || []
  const withdrawTransactions = query.data?.filter(tx => tx.type === 'withdraw') || []
  const claimTransactions = query.data?.filter(tx => tx.type === 'claim') || []

  // Get pending transactions
  const pendingTransactions = query.data?.filter(tx => tx.status === 'pending') || []

  return {
    // Data
    transactions: query.data || [],
    stakeTransactions,
    withdrawTransactions,
    claimTransactions,
    pendingTransactions,
    
    // Loading states
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    
    // Error state
    error: query.error,
    
    // Refetch
    refetch: query.refetch,
    
    // Computed values
    hasTransactions: (query.data?.length || 0) > 0,
    hasPendingTransactions: pendingTransactions.length > 0,
    totalTransactions: query.data?.length || 0
  }
}
