/**
 * StakingHistory Component
 * Displays transaction history for staking operations
 */

import { useState } from 'react'
import { ExternalLink, ArrowUpCircle, ArrowDownCircle, Gift } from 'lucide-react'
import { useStakingTransactions } from '@/hooks/useStakingTransactions'
import { TransactionTableSkeleton } from '@/components/molecules/StakingSkeletons'
import { NoTransactionsEmpty } from '@/components/molecules/StakingEmptyStates'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, shortenAddress, getExplorerUrl, formatUSD } from '@/lib/stakingUtils'

interface StakingHistoryProps {
  userAddress?: string
}

const getTypeIcon = (type: 'stake' | 'withdraw' | 'claim') => {
  switch (type) {
    case 'stake':
      return <ArrowUpCircle className="h-4 w-4 text-green-500" />
    case 'withdraw':
      return <ArrowDownCircle className="h-4 w-4 text-orange-500" />
    case 'claim':
      return <Gift className="h-4 w-4 text-blue-500" />
  }
}

const getStatusBadge = (status: 'pending' | 'confirmed' | 'failed') => {
  const variants = {
    pending: 'secondary',
    confirmed: 'default',
    failed: 'destructive'
  } as const

  return (
    <Badge variant={variants[status]} className="capitalize">
      {status}
    </Badge>
  )
}

export const StakingHistory: React.FC<StakingHistoryProps> = ({ userAddress }) => {
  const { 
    transactions, 
    stakeTransactions, 
    withdrawTransactions, 
    claimTransactions,
    isLoading 
  } = useStakingTransactions(userAddress)

  const [activeTab, setActiveTab] = useState('all')

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'stake':
        return stakeTransactions
      case 'withdraw':
        return withdrawTransactions
      case 'claim':
        return claimTransactions
      default:
        return transactions
    }
  }

  const filteredTransactions = getFilteredTransactions()

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Transaction History</h2>
        <TransactionTableSkeleton rows={5} />
      </section>
    )
  }

  if (transactions.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Transaction History</h2>
        <NoTransactionsEmpty />
      </section>
    )
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Transaction History</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="stake">
            Stake ({stakeTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="withdraw">
            Withdraw ({withdrawTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="claim">
            Claim ({claimTransactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Pool</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tx.poolName}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tx.amount}</div>
                        {tx.amountUSD > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {formatUSD(tx.amountUSD)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell>
                      <a
                        href={getExplorerUrl(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {shortenAddress(tx.hash)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
