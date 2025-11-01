import { Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PositionCardProps {
  imageUrl: string
  tokenName: string
  apy: string
  stakedAmount: string
  rewardsEarned: string
  onWithdraw?: () => void
  onClaim?: () => void
  canWithdraw?: boolean
  canClaim?: boolean
  isLocked?: boolean
}

const PositionCard: React.FC<PositionCardProps> = ({
  imageUrl,
  tokenName,
  apy,
  stakedAmount,
  rewardsEarned,
  onWithdraw,
  onClaim,
  canWithdraw = true,
  canClaim = true,
  isLocked = false,
}) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col h-full hover:border-primary/50 transition-all duration-300">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <img
            src={imageUrl}
            alt={`${tokenName} logo`}
            className="w-16 h-16 rounded-xl"
          />
          {isLocked && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Locked
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">{tokenName}</h3>
        <div className="text-sm text-muted-foreground">APY: {apy}</div>
      </div>

      {/* Middle Section */}
      <div className="mt-6">
        <div className="mb-3">
          <div className="text-sm text-muted-foreground mb-1">Staked Amount</div>
          <div className="text-lg font-semibold text-foreground">{stakedAmount}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Rewards Earned</div>
          <div className="text-lg font-semibold text-foreground">{rewardsEarned}</div>
        </div>
      </div>

      {/* Bottom Section (Footer) */}
      <div className="mt-auto pt-6 flex items-center gap-2 justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  onClick={onClaim}
                  disabled={!canClaim}
                  className="bg-muted hover:bg-muted/80 text-foreground min-h-[44px] min-w-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  aria-label={`Claim rewards for ${tokenName}`}
                >
                  Claim
                </Button>
              </span>
            </TooltipTrigger>
            {!canClaim && (
              <TooltipContent>
                <p>No rewards available to claim</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  onClick={onWithdraw}
                  disabled={!canWithdraw}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground min-h-[44px] min-w-[44px] transition-opacity focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  aria-label={`Withdraw ${tokenName}`}
                >
                  Withdraw
                </Button>
              </span>
            </TooltipTrigger>
            {!canWithdraw && (
              <TooltipContent>
                <p>{isLocked ? 'Position is locked' : 'Cannot withdraw'}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default PositionCard
