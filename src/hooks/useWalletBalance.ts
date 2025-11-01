/**
 * useWalletBalance Hook
 * Hook for fetching token balances
 */

import { useQuery } from '@tanstack/react-query'
import { TokenBalance } from '@/types/staking'
import { blockchainService } from '@/services/blockchainService'
import { QUERY_STALE_TIME, QUERY_REFETCH_INTERVAL } from '@/lib/stakingConstants'
import { formatTokenAmount } from '@/lib/stakingUtils'

/**
 * Hook for fetching user's token balance
 * @param tokenAddress - Token contract address
 * @param userAddress - User's wallet address
 * @returns Token balance data
 */
export const useWalletBalance = (
  tokenAddress?: string,
  userAddress?: string
) => {
  const query = useQuery({
    queryKey: ['wallet', 'balance', tokenAddress, userAddress],
    queryFn: async (): Promise<TokenBalance | null> => {
      if (!tokenAddress || !userAddress) return null

      try {
        const [balance, tokenInfo] = await Promise.all([
          blockchainService.getTokenBalance(tokenAddress, userAddress),
          blockchainService.getTokenInfo(tokenAddress)
        ])

        return {
          address: tokenAddress,
          symbol: tokenInfo.symbol,
          balance,
          balanceFormatted: formatTokenAmount(balance, tokenInfo.decimals, 6),
          balanceUSD: 0 // TODO: Get price from oracle
        }
      } catch (error) {
        console.error('Error fetching balance:', error)
        return null
      }
    },
    enabled: !!tokenAddress && !!userAddress,
    staleTime: QUERY_STALE_TIME.BALANCE,
    refetchInterval: QUERY_REFETCH_INTERVAL.BALANCE
  })

  return {
    // Data
    balance: query.data,
    balanceFormatted: query.data?.balanceFormatted || '0',
    balanceUSD: query.data?.balanceUSD || 0,
    symbol: query.data?.symbol || '',
    
    // Loading states
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    
    // Error state
    error: query.error,
    
    // Refetch
    refetch: query.refetch,
    
    // Computed values
    hasBalance: query.data ? parseFloat(query.data.balanceFormatted) > 0 : false,
    hasSufficientBalance: (amount: string) => {
      if (!query.data) return false
      return parseFloat(query.data.balanceFormatted) >= parseFloat(amount)
    }
  }
}
