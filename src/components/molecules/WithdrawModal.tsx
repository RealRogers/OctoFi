/**
 * WithdrawModal Component
 * Modal for withdrawing staked tokens
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertTriangle } from 'lucide-react'
import { StakingPosition, WithdrawFormData } from '@/types/staking'
import { useWithdrawMutation } from '@/hooks/useStakingMutations'
import { createWithdrawValidator } from '@/lib/stakingValidators'
import { calculateTimeRemaining, formatPercentage, calculateFees } from '@/lib/stakingUtils'
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
import { Alert, AlertDescription } from '@/components/ui/alert'

interface WithdrawModalProps {
  position: StakingPosition
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  position,
  isOpen,
  onClose,
  onSuccess
}) => {
  const withdrawMutation = useWithdrawMutation()

  // Form setup with dynamic validation
  const validator = createWithdrawValidator(
    position.stakedAmount,
    position.isLocked,
    position.unlocksAt
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(validator),
    defaultValues: { amount: '' }
  })

  const amount = watch('amount')

  // Calculate fees
  const exitFee = amount && position.pool.exitFee > 0
    ? calculateFees(amount, position.pool.exitFee)
    : '0'

  const netAmount = amount && position.pool.exitFee > 0
    ? (parseFloat(amount) - parseFloat(exitFee)).toFixed(6)
    : amount

  // Handle max button
  const handleMax = () => {
    setValue('amount', position.stakedAmount)
  }

  // Handle withdraw
  const onSubmit = async (data: WithdrawFormData) => {
    try {
      await withdrawMutation.mutateAsync({
        poolAddress: position.pool.address,
        amount: data.amount
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Withdraw failed:', error)
    }
  }

  const isLoading = withdrawMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw {position.pool.symbol}</DialogTitle>
          <DialogDescription>
            Withdraw your staked tokens from the pool
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Position Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <img 
              src={position.pool.logoUrl} 
              alt={position.pool.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="font-semibold">{position.pool.name}</div>
              <div className="text-sm text-muted-foreground">
                Staked: {position.stakedAmount} {position.pool.symbol}
              </div>
            </div>
          </div>

          {/* Lock Warning */}
          {position.isLocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Position is locked. Unlocks in {calculateTimeRemaining(position.unlocksAt)}
              </AlertDescription>
            </Alert>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Amount</Label>
              <div className="text-sm text-muted-foreground">
                Available: {position.stakedAmount} {position.pool.symbol}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.0"
                {...register('amount')}
                disabled={isLoading || position.isLocked}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleMax}
                disabled={isLoading || position.isLocked}
              >
                Max
              </Button>
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Preview Section */}
          {amount && parseFloat(amount) > 0 && !position.isLocked && (
            <>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Withdraw Amount</span>
                  <span className="font-medium">{amount} {position.pool.symbol}</span>
                </div>
                {position.pool.exitFee > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exit Fee ({formatPercentage(position.pool.exitFee)})</span>
                      <span className="font-medium text-destructive">-{exitFee} {position.pool.symbol}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-semibold">You'll Receive</span>
                      <span className="font-semibold">{netAmount} {position.pool.symbol}</span>
                    </div>
                  </>
                )}
                {position.rewardsEarned !== '0' && (
                  <Alert>
                    <AlertDescription className="text-xs">
                      Note: Unclaimed rewards ({position.rewardsEarned} {position.pool.symbol}) will remain in the pool
                    </AlertDescription>
                  </Alert>
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
            
            <Button
              type="submit"
              disabled={isLoading || !amount || parseFloat(amount) <= 0 || position.isLocked}
              className="flex-1"
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                'Withdraw'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
