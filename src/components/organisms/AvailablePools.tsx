/**
 * AvailablePools Component
 * Displays available staking pools with filtering and sorting
 */

import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import PoolRow from "@/components/molecules/PoolRow"
import { StakeModal } from '@/components/molecules/StakeModal'
import { PoolFilters } from '@/components/molecules/PoolFilters'
import { PoolListSkeleton } from '@/components/molecules/StakingSkeletons'
import { NoPoolsEmpty, NoSearchResultsEmpty } from '@/components/molecules/StakingEmptyStates'
import { useStakingPools } from '@/hooks/useStakingPools'
import { StakingPool } from '@/types/staking'
import { Button } from '@/components/ui/button'
import { formatCompactNumber, formatPercentage } from '@/lib/stakingUtils'

interface AvailablePoolsProps {
  userAddress?: string
}

const AvailablePools: React.FC<AvailablePoolsProps> = ({ userAddress }) => {
  const {
    pools,
    predictions,
    isLoading,
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    hasFilters,
    poolCount
  } = useStakingPools()

  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  const [stakeModalOpen, setStakeModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleStake = (pool: StakingPool) => {
    setSelectedPool(pool)
    setStakeModalOpen(true)
  }

  const handleSort = (column: 'apy' | 'tvl' | 'name') => {
    if (sortBy === column) {
      toggleSortOrder()
    } else {
      setSortBy(column)
    }
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Available Pools</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <PoolFilters
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            hasFilters={hasFilters}
          />
        </div>
      )}

      {/* Pools Table */}
      {isLoading ? (
        <PoolListSkeleton count={3} />
      ) : pools.length === 0 ? (
        hasFilters ? (
          <NoSearchResultsEmpty
            searchTerm={filters.search}
            onClear={resetFilters}
          />
        ) : (
          <NoPoolsEmpty />
        )
      ) : (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-card/80 border-b border-border/50">
            <button
              onClick={() => handleSort('name')}
              className="text-sm text-muted-foreground font-medium col-span-2 sm:col-span-1 flex items-center gap-1 hover:text-foreground transition-colors text-left"
            >
              Asset
              {sortBy === 'name' && (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={() => handleSort('apy')}
              className="text-sm text-muted-foreground font-medium flex items-center gap-1 hover:text-foreground transition-colors"
            >
              APY
              {sortBy === 'apy' && (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={() => handleSort('tvl')}
              className="text-sm text-muted-foreground font-medium flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Total Staked (TVL)
              {sortBy === 'tvl' && (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </button>
            <div className="hidden sm:block"></div>
          </div>

          {/* Table Body */}
          <div>
            {pools.map((pool) => (
              <PoolRow
                key={pool.id}
                iconUrl={pool.logoUrl}
                assetName={pool.name}
                apy={formatPercentage(pool.apy)}
                totalStaked={formatCompactNumber(pool.tvl)}
                pool={pool}
                prediction={predictions[pool.address]}
                onStake={() => handleStake(pool)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-card/80 border-t border-border/50 text-sm text-muted-foreground">
            Showing {poolCount} {poolCount === 1 ? 'pool' : 'pools'}
          </div>
        </div>
      )}

      {/* Stake Modal */}
      {selectedPool && (
        <StakeModal
          pool={selectedPool}
          userAddress={userAddress}
          isOpen={stakeModalOpen}
          onClose={() => setStakeModalOpen(false)}
          onSuccess={() => {
            setStakeModalOpen(false)
            setSelectedPool(null)
          }}
        />
      )}
    </section>
  )
}

export default AvailablePools
