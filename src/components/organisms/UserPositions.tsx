/**
 * UserPositions Component
 * Displays user's active staking positions
 */

import { useState } from 'react'
import PositionCard from "@/components/molecules/PositionCard"
import { WithdrawModal } from '@/components/molecules/WithdrawModal'
import { ClaimModal } from '@/components/molecules/ClaimModal'
import { PositionListSkeleton } from '@/components/molecules/StakingSkeletons'
import { NoPositionsEmpty } from '@/components/molecules/StakingEmptyStates'
import { useStakingPositions } from '@/hooks/useStakingPositions'
import { StakingPosition } from '@/types/staking'

interface UserPositionsProps {
  userAddress?: string
  onExploreClick?: () => void
}

const UserPositions: React.FC<UserPositionsProps> = ({ userAddress, onExploreClick }) => {
  const { positions, isLoading } = useStakingPositions(userAddress)
  const [selectedPosition, setSelectedPosition] = useState<StakingPosition | null>(null)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [claimModalOpen, setClaimModalOpen] = useState(false)

  const handleWithdraw = (position: StakingPosition) => {
    setSelectedPosition(position)
    setWithdrawModalOpen(true)
  }

  const handleClaim = (position: StakingPosition) => {
    setSelectedPosition(position)
    setClaimModalOpen(true)
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Positions</h2>
      
      {isLoading ? (
        <PositionListSkeleton count={2} />
      ) : positions.length === 0 ? (
        <NoPositionsEmpty onExplore={onExploreClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positions.map((position) => (
            <PositionCard
              key={position.id}
              imageUrl={position.pool.logoUrl}
              tokenName={position.pool.name}
              apy={`${position.apy.toFixed(2)}%`}
              stakedAmount={`${position.stakedAmount} ${position.pool.symbol}`}
              rewardsEarned={`${position.rewardsEarned} ${position.pool.symbol}`}
              onWithdraw={() => handleWithdraw(position)}
              onClaim={() => handleClaim(position)}
              canWithdraw={position.canWithdraw}
              canClaim={position.canClaim}
              isLocked={position.isLocked}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedPosition && (
        <>
          <WithdrawModal
            position={selectedPosition}
            isOpen={withdrawModalOpen}
            onClose={() => setWithdrawModalOpen(false)}
            onSuccess={() => {
              setWithdrawModalOpen(false)
              setSelectedPosition(null)
            }}
          />
          
          <ClaimModal
            position={selectedPosition}
            isOpen={claimModalOpen}
            onClose={() => setClaimModalOpen(false)}
            onSuccess={() => {
              setClaimModalOpen(false)
              setSelectedPosition(null)
            }}
          />
        </>
      )}
    </section>
  )
}

export default UserPositions
