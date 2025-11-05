/**
 * Web3 Test Page
 * Simple page to test Web3 provider functionality
 */

import React from 'react'
import { useWeb3 } from '@/hooks/useWeb3Provider'
import { ConnectWalletButton, NetworkStatusIndicator } from '@/components/shared/ConnectWalletButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

const Web3Test: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    account,
    chainId,
    isCorrectNetwork,
    networkError,
    tokenBalances,
    isLoadingBalances,
    contracts,
    error,
    refreshBalances,
    refreshAll
  } = useWeb3()

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance || '0')
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Web3 Provider Test</h1>
            <p className="text-muted-foreground">
              Test the Web3 provider functionality and wallet connection
            </p>
          </div>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Connection Status
              </CardTitle>
              <CardDescription>
                Current wallet connection and network status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={isConnected ? 'default' : 'secondary'}>
                      {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                    {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Network</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={isCorrectNetwork ? 'default' : 'destructive'}>
                      {chainId ? `Chain ${chainId}` : 'Unknown'}
                    </Badge>
                    <NetworkStatusIndicator />
                  </div>
                </div>
              </div>

              {account && (
                <div>
                  <label className="text-sm font-medium">Account</label>
                  <div className="mt-1 font-mono text-sm bg-muted p-2 rounded">
                    {account}
                  </div>
                </div>
              )}

              {networkError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  {networkError}
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  {error}
                </div>
              )}

              <ConnectWalletButton 
                showBalance={false}
                showNetworkStatus={false}
              />
            </CardContent>
          </Card>

          {/* Token Balances */}
          {isConnected && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Token Balances
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshBalances}
                    disabled={isLoadingBalances}
                  >
                    {isLoadingBalances ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Your token balances on Somnia Testnet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBalances ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading balances...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatBalance(tokenBalances.USDC)}
                      </div>
                      <div className="text-sm text-muted-foreground">USDC</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatBalance(tokenBalances.USDT)}
                      </div>
                      <div className="text-sm text-muted-foreground">USDT</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatBalance(tokenBalances.ARB)}
                      </div>
                      <div className="text-sm text-muted-foreground">ARB</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contract Status */}
          {isConnected && (
            <Card>
              <CardHeader>
                <CardTitle>Contract Status</CardTitle>
                <CardDescription>
                  Status of deployed smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Token Contracts</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>USDC</span>
                        <Badge variant={contracts.usdc ? 'default' : 'secondary'}>
                          {contracts.usdc ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>USDT</span>
                        <Badge variant={contracts.usdt ? 'default' : 'secondary'}>
                          {contracts.usdt ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ARB</span>
                        <Badge variant={contracts.arb ? 'default' : 'secondary'}>
                          {contracts.arb ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Staking Contracts</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>USDC Pool</span>
                        <Badge variant={contracts.usdcPool ? 'default' : 'secondary'}>
                          {contracts.usdcPool ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Test various Web3 provider functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={refreshAll}
                  disabled={!isConnected}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
                
                <Button
                  variant="outline"
                  onClick={refreshBalances}
                  disabled={!isConnected || isLoadingBalances}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Balances
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
              <CardDescription>
                Raw Web3 provider state for debugging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {JSON.stringify({
                  isConnected,
                  isConnecting,
                  account,
                  chainId,
                  isCorrectNetwork,
                  networkError,
                  tokenBalances,
                  isLoadingBalances,
                  contractsConnected: {
                    usdc: !!contracts.usdc,
                    usdt: !!contracts.usdt,
                    arb: !!contracts.arb,
                    usdcPool: !!contracts.usdcPool
                  },
                  error
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Web3Test