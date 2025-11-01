/**
 * PoolRow Component
 * Displays a single pool row with expandable details
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp, Lock, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StakingPool, APYPrediction } from '@/types/staking'
import { formatLockPeriod, formatPercentage } from '@/lib/stakingUtils'

interface PoolRowProps {
  iconUrl: string
  assetName: string
  apy: string
  totalStaked: string
  pool?: StakingPool
  prediction?: APYPrediction
  onStake?: () => void
}

const PoolRow: React.FC<PoolRowProps> = ({
  iconUrl,
  assetName,
  apy,
  totalStaked,
  pool,
  prediction,
  onStake,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="border-t border-border/50 first:border-t-0">
        {/* Main Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center py-4 px-6 hover:bg-muted/20 transition-colors">
          {/* Column 1: Asset */}
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-3 col-span-2 sm:col-span-1 text-left hover:opacity-80 transition-opacity">
              <img
                src={iconUrl}
                alt={`${assetName} icon`}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{assetName}</span>
                  {prediction && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  )}
                </div>
                {pool && pool.lockPeriod > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Lock className="h-3 w-3" />
                    {formatLockPeriod(pool.lockPeriod)}
                  </div>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>

          {/* Column 2: APY */}
          <div>
            <div className="text-green-500 font-semibold">{apy}</div>
            {prediction && (
              <div className="text-xs text-muted-foreground">
                Pred: {formatPercentage(prediction.predicted)}
              </div>
            )}
          </div>

          {/* Column 3: Total Staked (TVL) */}
          <div className="text-foreground">{totalStaked}</div>

          {/* Column 4: Action Button */}
          <div className="flex justify-end col-span-2 sm:col-span-1">
            <Button
              onClick={onStake}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground min-h-[44px] min-w-[44px] transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={`Stake ${assetName}`}
            >
              Stake
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {pool && (
          <CollapsibleContent>
            <div className="px-6 pb-4 pt-2 bg-muted/10 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Min Stake</div>
                  <div className="font-medium">{pool.minStake} {pool.symbol}</div>
                </div>
                
                {pool.maxStake && (
                  <div>
                    <div className="text-muted-foreground mb-1">Max Stake</div>
                    <div className="font-medium">{pool.maxStake} {pool.symbol}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-muted-foreground mb-1">Entry Fee</div>
                  <div className="font-medium">{formatPercentage(pool.entryFee)}</div>
                </div>
                
                <div>
                  <div className="text-muted-foreground mb-1">Exit Fee</div>
                  <div className="font-medium">{formatPercentage(pool.exitFee)}</div>
                </div>
                
                {pool.performanceFee > 0 && (
                  <div>
                    <div className="text-muted-foreground mb-1">Performance Fee</div>
                    <div className="font-medium">{formatPercentage(pool.performanceFee)}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-muted-foreground mb-1">Total Stakers</div>
                  <div className="font-medium">{pool.totalStakers.toLocaleString()}</div>
                </div>
              </div>

              {/* AI Prediction Details */}
              {prediction && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">AI Prediction</span>
                    <Badge variant="outline" className="text-xs">
                      {prediction.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Predicted APY: <span className="text-foreground font-medium">{formatPercentage(prediction.predicted)}</span> over {prediction.timeframe}
                  </div>
                  {prediction.factors.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Factors: {prediction.factors.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  )
}

export default PoolRow
