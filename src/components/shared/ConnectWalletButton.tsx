/**
 * Connect Wallet Button Component
 * Uses Web3Provider for wallet connection management
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { useWeb3 } from '@/hooks/useWeb3Provider'
import { Wallet, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ConnectWalletButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showBalance?: boolean
  showNetworkStatus?: boolean
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  showBalance = false,
  showNetworkStatus = true
}) => {
  const {
    isConnected,
    isConnecting,
    account,
    isCorrectNetwork,
    networkError,
    tokenBalances,
    isLoadingBalances,
    error,
    connect,
    disconnect,
    switchToSomnia,
    clearError
  } = useWeb3()

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle connect/disconnect
  const handleClick = async () => {
    if (isConnected) {
      disconnect()
    } else {
      await connect()
    }
  }

  // Handle network switch
  const handleNetworkSwitch = async () => {
    await switchToSomnia()
  }

  // Render error alert
  const renderError = () => {
    if (!error) return null

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="ml-2 h-auto p-1"
          >
            ×
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Render network warning
  const renderNetworkWarning = () => {
    if (!isConnected || isCorrectNetwork || !showNetworkStatus) return null

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          {networkError}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNetworkSwitch}
            className="ml-2"
          >
            Switch Network
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Render token balances
  const renderBalances = () => {
    if (!showBalance || !isConnected || !isCorrectNetwork) return null

    return (
      <div className="mt-2 text-sm text-muted-foreground">
        {isLoadingBalances ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading balances...
          </div>
        ) : (
          <div className="space-y-1">
            <div>USDC: {parseFloat(tokenBalances.USDC || '0').toLocaleString()}</div>
            <div>USDT: {parseFloat(tokenBalances.USDT || '0').toLocaleString()}</div>
            <div>ARB: {parseFloat(tokenBalances.ARB || '0').toLocaleString()}</div>
          </div>
        )}
      </div>
    )
  }

  // Main button content
  const getButtonContent = () => {
    if (isConnecting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      )
    }

    if (isConnected) {
      return (
        <>
          {isCorrectNetwork ? (
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
          )}
          {formatAddress(account!)}
        </>
      )
    }

    return (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </>
    )
  }

  return (
    <div className={className}>
      {renderError()}
      {renderNetworkWarning()}
      
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isConnecting}
        className="w-full"
      >
        {getButtonContent()}
      </Button>

      {renderBalances()}
    </div>
  )
}

// Compact version for navbar
export const ConnectWalletButtonCompact: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const {
    isConnected,
    isConnecting,
    account,
    isCorrectNetwork,
    connect,
    disconnect
  } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const handleClick = async () => {
    if (isConnected) {
      disconnect()
    } else {
      await connect()
    }
  }

  return (
    <Button
      variant={isConnected ? 'outline' : 'default'}
      size="sm"
      onClick={handleClick}
      disabled={isConnecting}
      className={className}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          {isCorrectNetwork ? (
            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
          ) : (
            <AlertCircle className="mr-2 h-3 w-3 text-yellow-500" />
          )}
          {formatAddress(account!)}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-3 w-3" />
          Connect
        </>
      )}
    </Button>
  )
}

// Network status indicator
export const NetworkStatusIndicator: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const { isConnected, isCorrectNetwork, chainId, switchToSomnia } = useWeb3()

  if (!isConnected) return null

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div
        className={`h-2 w-2 rounded-full ${
          isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-muted-foreground">
        {isCorrectNetwork ? 'Somnia Testnet' : `Chain ${chainId}`}
      </span>
      {!isCorrectNetwork && (
        <Button
          variant="ghost"
          size="sm"
          onClick={switchToSomnia}
          className="h-auto p-1 text-xs"
        >
          Switch
        </Button>
      )}
    </div>
  )
}

export default ConnectWalletButton
