/**
 * StakingHeader Component
 * Displays aggregated staking statistics
 */

import { TrendingUp, Wallet, Percent, Layers } from 'lucide-react'
import CountUp from 'react-countup'
import { Card } from '@/components/ui/card'
import { HeaderStatsSkeleton } from '@/components/molecules/StakingSkeletons'
import { formatUSD, formatPercentage } from '@/lib/stakingUtils'

interface StakingHeaderProps {
  totalStakedUSD: number
  totalRewardsUSD: number
  averageAPY: number
  activePositions: number
  isLoading?: boolean
}

const StatCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  decimals?: number
  isLoading?: boolean
}> = ({ icon, label, value, prefix = '', suffix = '', decimals = 2, isLoading }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  return (
    <Card className="p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <>
            {prefix}
            <CountUp
              end={numericValue}
              decimals={decimals}
              duration={1}
              separator=","
            />
            {suffix}
          </>
        )}
      </div>
    </Card>
  )
}

export const StakingHeader: React.FC<StakingHeaderProps> = ({
  totalStakedUSD,
  totalRewardsUSD,
  averageAPY,
  activePositions,
  isLoading
}) => {
  if (isLoading) {
    return <HeaderStatsSkeleton />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Wallet className="h-5 w-5" />}
        label="Total Staked"
        value={totalStakedUSD}
        prefix="$"
        decimals={2}
      />
      
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Pending Rewards"
        value={totalRewardsUSD}
        prefix="$"
        decimals={2}
      />
      
      <StatCard
        icon={<Percent className="h-5 w-5" />}
        label="Average APY"
        value={averageAPY}
        suffix="%"
        decimals={2}
      />
      
      <StatCard
        icon={<Layers className="h-5 w-5" />}
        label="Active Positions"
        value={activePositions}
        decimals={0}
      />
    </div>
  )
}
