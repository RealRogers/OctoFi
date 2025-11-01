/**
 * ClaimModal Component
 * Modal for claiming staking rewards
 */

import { Loader2, Gift } from 'lucide-react'
import { StakingPosition } from '@/types/staking'
import { useClaimMutation } from '@/hooks/useStakingMutations'
import { formatUSD, formatPercentage } from '@/lib/stakingUtils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ClaimModalProps {
  position: StakingPosition
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  position,
  isOpen,
  onClose,
  onSuccess
}) => {
  const claimMutation = useClaimMutation()

  // Handle claim
  const handleClaim = async () => {
    try {
      await claimMutation.mutateAsync({
        poolAddress: position.pool.address
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Claim failed:', error)
    }
  }

  const isLoading = claimMutation.isPending
  const hasRewards = parseFloat(position.rewardsEarned) > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Rewards</DialogTitle>
          <DialogDescription>
            Claim your earned staking rewards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                APY: {formatPercentage(position.pool.apy)}
              </div>
            </div>
          </div>

          {/* Rewards Display */}
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {position.rewardsEarned} {position.pool.symbol}
            </div>
            {position.rewardsEarnedUSD > 0 && (
              <div className="text-muted-foreground">
                ≈ {formatUSD(position.rewardsEarnedUSD)}
              </div>
            )}
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Staked Amount</span>
              <span className="font-medium">{position.stakedAmount} {position.pool.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current APY</span>
              <span className="font-medium text-green-500">{formatPercentage(position.apy)}</span>
            </div>
            {position.pool.performanceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Performance Fee</span>
                <span className="font-medium">{formatPercentage(position.pool.performanceFee)}</span>
              </div>
            )}
          </div>

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
              onClick={handleClaim}
              disabled={isLoading || !hasRewards}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim Rewards'
              )}
            </Button>
          </div>

          {!hasRewards && (
            <p className="text-sm text-center text-muted-foreground">
              No rewards available to claim yet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
