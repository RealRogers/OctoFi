/**
 * CrossChainBridge Atom Component
 * Multi-chain token selection and bridge fee calculation with progress tracking
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Bridge, ArrowRight, Clock, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'
import { Token, Chain } from '@/services/types'
import { dataService } from '@/services'
import { useSwapStore, useAppStore } from '@/services/store'
import { formatUSDAmount } from '@/services/utils'
import { cn } from '@/lib/utils'

interface BridgeRoute {
  fromChain: Chain
  toChain: Chain
  bridgeFee: number
  estimatedTime: number // in minutes
  protocol: string
  security: 'high' | 'medium' | 'low'
}

interface CrossChainBridgeProps {
  fromToken?: Token | null
  toToken?: Token | null
  amount?: string
  className?: string
  compact?: boolean
  onRouteSelect?: (route: BridgeRoute) => void
}

const CrossChainBridge: React.FC<CrossChainBridgeProps> = ({
  fromToken,
  toToken,
  amount,
  className,
  compact = false,
  onRouteSelect
}) => {
  const [availableChains, setAvailableChains] = useState<Chain[]>([])
  const [bridgeRoutes, setBridgeRoutes] = useState<BridgeRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<BridgeRoute | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { currentChainId, setCurrentChainId } = useAppStore()
  const { setCrossChain } = useSwapStore()

  // Fetch available chains
  useEffect(() => {
    fetchAvailableChains()
  }, [])

  // Check if cross-chain swap is needed
  const isCrossChain = useMemo(() => {
    return fromToken && toToken && fromToken.chainId !== toToken.chainId
  }, [fromToken, toToken])

  // Update cross-chain state
  useEffect(() => {
    setCrossChain(!!isCrossChain)
  }, [isCrossChain, setCrossChain])

  // Fetch bridge routes when tokens change
  useEffect(() => {
    if (isCrossChain && fromToken && toToken) {
      fetchBridgeRoutes()
    }
  }, [isCrossChain, fromToken, toToken, amount])

  const fetchAvailableChains = async () => {
    try {
      const chains = await dataService.getSupportedChains()
      setAvailableChains(chains)
    } catch (err) {
      console.error('Failed to fetch chains:', err)
    }
  }

  const fetchBridgeRoutes = async () => {
    if (!fromToken || !toToken || !isCrossChain) return

    setIsLoading(true)
    setError(null)

    try {
      // Mock bridge routes - in real implementation, this would call bridge APIs
      const routes: BridgeRoute[] = [
        {
          fromChain: availableChains.find(c => c.id === fromToken.chainId)!,
          toChain: availableChains.find(c => c.id === toToken.chainId)!,
          bridgeFee: 0.005, // ETH
          estimatedTime: 15,
          protocol: 'LayerZero',
          security: 'high'
        },
        {
          fromChain: availableChains.find(c => c.id === fromToken.chainId)!,
          toChain: availableChains.find(c => c.id === toToken.chainId)!,
          bridgeFee: 0.003,
          estimatedTime: 30,
          protocol: 'Wormhole',
          security: 'high'
        },
        {
          fromChain: availableChains.find(c => c.id === fromToken.chainId)!,
          toChain: availableChains.find(c => c.id === toToken.chainId)!,
          bridgeFee: 0.001,
          estimatedTime: 60,
          protocol: 'Multichain',
          security: 'medium'
        }
      ].filter(route => route.fromChain && route.toChain)

      setBridgeRoutes(routes)
      if (routes.length > 0) {
        setSelectedRoute(routes[0]) // Select best route by default
      }
    } catch (err) {
      setError('Failed to fetch bridge routes')
      console.error('Bridge routes error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRouteSelect = (route: BridgeRoute) => {
    setSelectedRoute(route)
    onRouteSelect?.(route)
  }

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'high':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'high':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  // Don't render if not cross-chain
  if (!isCrossChain) {
    return null
  }

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bridge className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Cross-Chain</span>
          </div>
          {selectedRoute && (
            <span className="text-sm text-white">
              {formatUSDAmount(selectedRoute.bridgeFee * 3000)} fee
            </span>
          )}
        </div>

        {selectedRoute && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">via {selectedRoute.protocol}</span>
            <span className="text-gray-400">~{formatTime(selectedRoute.estimatedTime)}</span>
          </div>
        )}

        {isLoading && (
          <div className="text-xs text-gray-400">Finding best route...</div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bridge className="w-5 h-5 text-blue-400" />
          Cross-Chain Bridge
        </h3>
        <div className="flex items-center gap-2">
          {fromToken && toToken && (
            <>
              <span className="text-sm text-gray-400">
                {availableChains.find(c => c.id === fromToken.chainId)?.name}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {availableChains.find(c => c.id === toToken.chainId)?.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Finding optimal bridge routes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Bridge Routes */}
      {bridgeRoutes.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Available Routes</div>
          
          {bridgeRoutes.map((route, index) => (
            <button
              key={index}
              onClick={() => handleRouteSelect(route)}
              className={cn(
                'w-full p-4 rounded-lg border transition-colors text-left',
                selectedRoute === route
                  ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{route.protocol}</span>
                  {getSecurityIcon(route.security)}
                  <span className={cn('text-xs', getSecurityColor(route.security))}>
                    {route.security} security
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Bridge Fee</div>
                  <div className="text-white font-medium">
                    {formatUSDAmount(route.bridgeFee * 3000)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Est. Time</div>
                  <div className="text-white font-medium">
                    {formatTime(route.estimatedTime)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Route</div>
                  <div className="text-white font-medium text-xs">
                    {route.fromChain.name} → {route.toChain.name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Route Summary */}
      {selectedRoute && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-blue-400">Selected Route</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Protocol:</span>
              <span className="text-white">{selectedRoute.protocol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bridge Fee:</span>
              <span className="text-white">{formatUSDAmount(selectedRoute.bridgeFee * 3000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estimated Time:</span>
              <span className="text-white">{formatTime(selectedRoute.estimatedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Security Level:</span>
              <span className={getSecurityColor(selectedRoute.security)}>
                {selectedRoute.security}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bridge Process Steps */}
      {selectedRoute && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Bridge Process</div>
          
          <div className="space-y-2">
            {[
              { step: 1, text: `Lock tokens on ${selectedRoute.fromChain.name}`, time: '~1 min' },
              { step: 2, text: 'Bridge validation and processing', time: `~${Math.floor(selectedRoute.estimatedTime * 0.8)} min` },
              { step: 3, text: `Mint tokens on ${selectedRoute.toChain.name}`, time: '~2 min' }
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{item.text}</div>
                </div>
                <div className="text-xs text-gray-400">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-400">Cross-Chain Bridge Notice</p>
          <p className="text-sm text-yellow-300 mt-1">
            Cross-chain transactions take longer to complete and involve additional fees. 
            Make sure you have sufficient gas on both chains.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CrossChainBridge