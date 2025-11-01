/**
 * Staking Empty States
 * Empty state components for various scenarios
 */

import { Wallet, Coins, TrendingUp, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <Card className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  )
}

/**
 * Empty state for no positions
 */
export const NoPositionsEmpty: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => {
  return (
    <EmptyState
      icon={<Coins className="w-8 h-8 text-muted-foreground" />}
      title="No Active Positions"
      description="You don't have any staked positions yet. Start earning rewards by staking your tokens in available pools."
      action={onExplore ? {
        label: 'Explore Pools',
        onClick: onExplore
      } : undefined}
    />
  )
}

/**
 * Empty state for no pools
 */
export const NoPoolsEmpty: React.FC = () => {
  return (
    <EmptyState
      icon={<TrendingUp className="w-8 h-8 text-muted-foreground" />}
      title="No Pools Available"
      description="There are no staking pools available at the moment. Please check back later."
    />
  )
}

/**
 * Empty state for wallet not connected
 */
export const WalletNotConnectedEmpty: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => {
  return (
    <EmptyState
      icon={<Wallet className="w-8 h-8 text-muted-foreground" />}
      title="Wallet Not Connected"
      description="Connect your wallet to view your staking positions and start earning rewards."
      action={onConnect ? {
        label: 'Connect Wallet',
        onClick: onConnect
      } : undefined}
    />
  )
}

/**
 * Empty state for no transactions
 */
export const NoTransactionsEmpty: React.FC = () => {
  return (
    <EmptyState
      icon={<History className="w-8 h-8 text-muted-foreground" />}
      title="No Transactions Yet"
      description="Your staking transaction history will appear here once you start staking."
    />
  )
}

/**
 * Empty state for search with no results
 */
export const NoSearchResultsEmpty: React.FC<{ searchTerm: string; onClear?: () => void }> = ({ 
  searchTerm, 
  onClear 
}) => {
  return (
    <Card className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <TrendingUp className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Pools Found</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        No pools match your search for "{searchTerm}". Try adjusting your filters or search term.
      </p>
      {onClear && (
        <Button variant="outline" onClick={onClear}>
          Clear Filters
        </Button>
      )}
    </Card>
  )
}
