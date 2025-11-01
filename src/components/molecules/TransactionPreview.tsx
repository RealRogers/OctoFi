/**
 * TransactionPreview Component
 * Displays transaction details before confirmation
 */

import { AlertTriangle } from 'lucide-react'
import { formatUSD, formatPercentage } from '@/lib/stakingUtils'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TransactionPreviewProps {
  type: 'stake' | 'withdraw' | 'claim'
  amount: string
  symbol: string
  fees?: {
    entry?: number
    exit?: number
    performance?: number
    gas?: string
  }
  netAmount?: string
  estimatedRewards?: string
  lockPeriod?: number
  warnings?: string[]
}

export const TransactionPreview: React.FC<TransactionPreviewProps> = ({
  type,
  amount,
  symbol,
  fees,
  netAmount,
  estimatedRewards,
  lockPeriod,
  warnings
}) => {
  const getActionLabel = () => {
    switch (type) {
      case 'stake': return 'Stake'
      case 'withdraw': return 'Withdraw'
      case 'claim': return 'Claim'
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">
        Transaction Preview
      </div>

      <div className="space-y-2 text-sm">
        {/* Action Type */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Action</span>
          <span className="font-medium">{getActionLabel()}</span>
        </div>

        {/* Amount */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">{amount} {symbol}</span>
        </div>

        {/* Fees */}
        {fees?.entry && fees.entry > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entry Fee ({formatPercentage(fees.entry)})</span>
            <span className="font-medium text-destructive">
              -{(parseFloat(amount) * fees.entry / 100).toFixed(6)} {symbol}
            </span>
          </div>
        )}

        {fees?.exit && fees.exit > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Exit Fee ({formatPercentage(fees.exit)})</span>
            <span className="font-medium text-destructive">
              -{(parseFloat(amount) * fees.exit / 100).toFixed(6)} {symbol}
            </span>
          </div>
        )}

        {fees?.gas && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Gas Cost</span>
            <span className="font-medium">{fees.gas}</span>
          </div>
        )}

        {/* Net Amount */}
        {netAmount && (
          <>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground font-semibold">
                {type === 'stake' ? 'Net Staked' : 'You\'ll Receive'}
              </span>
              <span className="font-semibold">{netAmount} {symbol}</span>
            </div>
          </>
        )}

        {/* Estimated Rewards */}
        {estimatedRewards && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Yearly Rewards</span>
            <span className="font-medium text-green-500">{estimatedRewards} {symbol}</span>
          </div>
        )}

        {/* Lock Period */}
        {lockPeriod && lockPeriod > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lock Period</span>
            <span className="font-medium">{lockPeriod / (24 * 60 * 60)} days</span>
          </div>
        )}
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-xs">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
