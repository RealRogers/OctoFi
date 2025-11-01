/**
 * Staking Mutation Hooks
 * Hooks for staking operations (stake, withdraw, claim, approve)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { stakingService } from '@/services/stakingService'
import { useToast } from '@/hooks/use-toast'
import { SUCCESS_MESSAGES } from '@/lib/stakingConstants'

/**
 * Hook for staking tokens
 */
export const useStakeMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      poolAddress, 
      amount 
    }: { 
      poolAddress: string
      amount: string 
    }) => {
      const tx = await stakingService.stake(poolAddress, amount)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['staking', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['staking', 'pools'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
      
      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.STAKE_SUCCESS
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to stake tokens',
        variant: 'destructive'
      })
    }
  })
}

/**
 * Hook for withdrawing tokens
 */
export const useWithdrawMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      poolAddress, 
      amount 
    }: { 
      poolAddress: string
      amount: string 
    }) => {
      const tx = await stakingService.withdraw(poolAddress, amount)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
      
      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.WITHDRAW_SUCCESS
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to withdraw tokens',
        variant: 'destructive'
      })
    }
  })
}

/**
 * Hook for claiming rewards
 */
export const useClaimMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ poolAddress }: { poolAddress: string }) => {
      const tx = await stakingService.claimRewards(poolAddress)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
      
      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.CLAIM_SUCCESS
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to claim rewards',
        variant: 'destructive'
      })
    }
  })
}

/**
 * Hook for approving tokens
 */
export const useApproveMutation = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      tokenAddress, 
      spenderAddress, 
      amount 
    }: { 
      tokenAddress: string
      spenderAddress: string
      amount?: string 
    }) => {
      const tx = await stakingService.approveToken(tokenAddress, spenderAddress, amount)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.APPROVE_SUCCESS
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve token',
        variant: 'destructive'
      })
    }
  })
}
