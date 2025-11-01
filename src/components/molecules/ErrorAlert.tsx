/**
 * ErrorAlert Component
 * Displays error messages with recovery actions
 */

import { AlertCircle, RefreshCw, Wallet, Network } from 'lucide-react'
import { StakingError, StakingErrorCode } from '@/types/staking'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorAlertProps {
  error: Error | StakingError | null
  onRetry?: () => void
  onDismiss?: () => void
  onConnectWallet?: () => void
  onSwitchNetwork?: () => void
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  onDismiss,
  onConnectWallet,
  onSwitchNetwork
}) => {
  if (!error) return null

  const isStakingError = error instanceof StakingError
  const errorCode = isStakingError ? error.code : null

  // Determine recovery action
  const getRecoveryAction = () => {
    if (!isStakingError) {
      return onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      ) : null
    }

    switch (errorCode) {
      case StakingErrorCode.WALLET_NOT_CONNECTED:
        return onConnectWallet ? (
          <Button variant="outline" size="sm" onClick={onConnectWallet} className="mt-2">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        ) : null

      case StakingErrorCode.WRONG_NETWORK:
        return onSwitchNetwork ? (
          <Button variant="outline" size="sm" onClick={onSwitchNetwork} className="mt-2">
            <Network className="h-4 w-4 mr-2" />
            Switch Network
          </Button>
        ) : null

      case StakingErrorCode.NETWORK_ERROR:
      case StakingErrorCode.RPC_ERROR:
        return onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        ) : null

      default:
        return onDismiss ? (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="mt-2">
            Dismiss
          </Button>
        ) : null
    }
  }

  // Determine variant
  const getVariant = (): 'default' | 'destructive' => {
    if (!isStakingError) return 'destructive'

    switch (errorCode) {
      case StakingErrorCode.WALLET_NOT_CONNECTED:
      case StakingErrorCode.WRONG_NETWORK:
        return 'default'
      default:
        return 'destructive'
    }
  }

  return (
    <Alert variant={getVariant()}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error.message}</p>
        {getRecoveryAction()}
      </AlertDescription>
    </Alert>
  )
}

/**
 * Inline error message for forms
 */
export const InlineError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-destructive">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

/**
 * Network warning banner
 */
export const NetworkWarning: React.FC<{ onSwitch?: () => void }> = ({ onSwitch }) => {
  return (
    <Alert>
      <Network className="h-4 w-4" />
      <AlertTitle>Wrong Network</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Please switch to Somnia Testnet to use staking features.</p>
        {onSwitch && (
          <Button variant="outline" size="sm" onClick={onSwitch}>
            Switch Network
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
