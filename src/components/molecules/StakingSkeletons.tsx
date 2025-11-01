/**
 * Staking Skeleton Loaders
 * Loading states for staking components
 */

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * Skeleton for pool row in table
 */
export const PoolRowSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center py-4 px-6 border-t border-border/50">
      <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
      <div className="flex justify-end col-span-2 sm:col-span-1">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

/**
 * Skeleton for multiple pool rows
 */
export const PoolListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-card/80 border-b border-border/50">
        <div className="text-sm text-muted-foreground font-medium col-span-2 sm:col-span-1">Asset</div>
        <div className="text-sm text-muted-foreground font-medium">APY</div>
        <div className="text-sm text-muted-foreground font-medium">Total Staked (TVL)</div>
        <div className="hidden sm:block"></div>
      </div>
      
      {/* Skeleton Rows */}
      <div>
        {Array.from({ length: count }).map((_, index) => (
          <PoolRowSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton for position card
 */
export const PositionCardSkeleton: React.FC = () => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </Card>
  )
}

/**
 * Skeleton for multiple position cards
 */
export const PositionListSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PositionCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Skeleton for header stats
 */
export const HeaderStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </Card>
      ))}
    </div>
  )
}

/**
 * Skeleton for transaction table
 */
export const TransactionTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-3 border border-border/50 rounded-lg">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}
