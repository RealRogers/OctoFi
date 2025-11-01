/**
 * StakeModal Component
 * Modal for staking tokens in a pool
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { StakingPool, StakeFormData } from '@/types/staking'
import { useWalletBalance } from '@/hooks/useWalletBalance'
import { useStakeMutation, useApproveMutation } from '@/hooks/useStakingMutations'
import { stakingService } from '@/services/stakingService'
import { createStakeValidator } from '@/lib/stakingValidators'
import { calculateRewards, formatUSD, formatPercentage } from '@/lib/stakingUtils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface StakeModalProps {
  pool: StakingPool
  userAddress?: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const StakeModal: React.FC<StakeModalProps> = ({
  pool,
  userAddress,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [needsApproval, setNeedsApproval] = useState(false)
  const [isCheckingApproval, setIsCheckingApproval] = useState(false)

  // Fetch user's token balance
  const { balance, balanceFormatted, isLoading: isLoadingBalance } = useWalletBalance(
    pool.tokenAddress,
    userAddress
  )

  // Mutations
  const stakeMutation = useStakeMutation()
  const approveMutation = useApproveMutation()

  // Form setup with dynamic validation
  const validator = createStakeValidator(
    balanceFormatted || '0',
    pool.minStake,
    pool.maxStake
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<StakeFormData>({
    resolver: zodResolver(validator),
    defaultValues: { amount: '' }
  })

  const amount = watch('amount')

  // Check approval status when amount changes
  useEffect(() => {
    const checkApproval = async () => {
      if (!amount || !userAddress || parseFloat(amount) <= 0) {
        setNeedsApproval(false)
        return
      }

      setIsCheckingApproval(true)
      try {
        const allowance = await stakingService.checkAllowance(
          pool.tokenAddress,
          userAddress,
          pool.address
        )
        
        const needsApproval = parseFloat(allowance) < parseFloat(amount)
        setNeedsApproval(needsApproval)
      } catch (error) {
        console.error('Error checking approval:', error)
      } finally {
        setIsCheckingApproval(false)
      }
    }

    checkApproval()
  }, [amount, userAddress, pool.tokenAddress, pool.address])

  // Calculate estimated rewards
  const estimatedMonthlyRewards = amount 
    ? calculateRewards(amount, pool.apy, 30)
    : '0'

  const estimatedYearlyRewards = amount
    ? calculateRewards(amount, pool.apy, 365)
    : '0'

  // Handle max button
  const handleMax = () => {
    if (balanceFormatted) {
      setValue('amount', balanceFormatted)
    }
  }

  // Handle approval
  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        tokenAddress: pool.tokenAddress,
        spenderAddress: pool.address
      })
      setNeedsApproval(false)
    } catch (error) {
      console.error('Approval failed:', error)
    }
  }

  // Handle stake
  const onSubmit = async (data: StakeFormData) => {
    try {
      await stakeMutation.mutateAsync({
        poolAddress: pool.address,
        amount: data.amount
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Stake failed:', error)
    }
  }

  const isLoading = stakeMutation.isPending || approveMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stake {pool.symbol}</DialogTitle>
          <DialogDescription>
            Stake your tokens to earn {formatPercentage(pool.apy)} APY
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pool Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <img 
              src={pool.logoUrl} 
              alt={pool.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold">{pool.name}</div>
              <div className="text-sm text-muted-foreground">
                APY: {formatPercentage(pool.apy)}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Amount</Label>
              <div className="text-sm text-muted-foreground">
                Balance: {isLoadingBalance ? '...' : balanceFormatted} {pool.symbol}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.0"
                {...register('amount')}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleMax}
                disabled={isLoading || isLoadingBalance}
              >
                Max
              </Button>
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Preview Section */}
          {amount && parseFloat(amount) > 0 && (
            <>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Monthly Rewards</span>
                  <span className="font-medium">{estimatedMonthlyRewards} {pool.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Yearly Rewards</span>
                  <span className="font-medium">{estimatedYearlyRewards} {pool.symbol}</span>
                </div>
                {pool.lockPeriod > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lock Period</span>
                    <span className="font-medium">{pool.lockPeriod / (24 * 60 * 60)} days</span>
                  </div>
                )}
                {pool.entryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Fee</span>
                    <span className="font-medium">{formatPercentage(pool.entryFee)}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            
            {needsApproval ? (
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isLoading || isCheckingApproval}
                className="flex-1"
              >
                {approveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  'Approve'
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !amount || parseFloat(amount) <= 0}
                className="flex-1"
              >
                {stakeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Staking...
                  </>
                ) : (
                  'Stake'
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
