/**
 * GasOptimizer Atom Component
 * Gas price estimation and optimization with timing recommendations
 */

import React, { useState, useEffect } from 'react'
import { Fuel, Clock, TrendingUp, TrendingDown, Zap, AlertCircle } from 'lucide-react'
import { GasEstimate, SwapTransaction } from '@/services/types'
import { dataService } from '@/services'
import { useSwapStore } from '@/services/store'
import { formatUSDAmount } from '@/services/utils'
import { cn } from '@/lib/utils'

interface GasOptimizerProps {
  transaction?: SwapTransaction
  className?: string
  compact?: boolean
  onGasPriceChange?: (gasPrice: 'slow' | 'standard' | 'fast') => void
}

const GasOptimizer: React.FC<GasOptimizerProps> = ({
  transaction,
  className,
  compact = false,
  onGasPriceChange
}) => {
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast'>('standard')
  const [networkCongestion, setNetworkCongestion] = useState<'low' | 'medium' | 'high'>('medium')

  const { gasPrice, setGasPrice } = useSwapStore()

  // Fetch gas estimates
  useEffect(() => {
    if (transaction) {
      fetchGasEstimate()
    }
  }, [transaction])

  // Update selected speed when store changes
  useEffect(() => {
    setSelectedSpeed(gasPrice)
  }, [gasPrice])

  const fetchGasEstimate = async () => {
    if (!transaction) return

    setIsLoading(true)
    setError(null)

    try {
      const estimate = await dataService.getGasEstimate(transaction)
      setGasEstimate(estimate)
      
      // Determine network congestion based on gas prices
      const avgGas = (estimate.slow + estimate.standard + estimate.fast) / 3
      if (avgGas < 20000000000) { // < 20 gwei
        setNetworkCongestion('low')
      } else if (avgGas < 50000000000) { // < 50 gwei
        setNetworkCongestion('medium')
      } else {
        setNetworkCongestion('high')
      }
    } catch (err) {
      setError('Failed to fetch gas estimates')
      console.error('Gas estimation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpeedSelect = (speed: 'slow' | 'standard' | 'fast') => {
    setSelectedSpeed(speed)
    setGasPrice(speed)
    onGasPriceChange?.(speed)
  }

  const getSpeedIcon = (speed: 'slow' | 'standard' | 'fast') => {
    switch (speed) {
      case 'slow':
        return <Clock className="w-4 h-4" />
      case 'standard':
        return <Fuel className="w-4 h-4" />
      case 'fast':
        return <Zap className="w-4 h-4" />
    }
  }

  const getSpeedColor = (speed: 'slow' | 'standard' | 'fast') => {
    switch (speed) {
      case 'slow':
        return 'text-green-400'
      case 'standard':
        return 'text-blue-400'
      case 'fast':
        return 'text-orange-400'
    }
  }

  const getCongestionColor = () => {
    switch (networkCongestion) {
      case 'low':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'high':
        return 'text-red-400'
    }
  }

  const getCongestionIcon = () => {
    switch (networkCongestion) {
      case 'low':
        return <TrendingDown className="w-4 h-4 text-green-400" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-400" />
    }
  }

  const formatGasPrice = (wei: number) => {
    return (wei / 1000000000).toFixed(1) // Convert to gwei
  }

  const estimateGasCost = (gasPrice: number) => {
    const gasLimit = 200000 // Typical swap gas limit
    const costInEth = (gasPrice * gasLimit) / 1000000000000000000
    const ethPrice = 3000 // Mock ETH price
    return costInEth * ethPrice
  }

  const getOptimizationTip = () => {
    if (!gasEstimate) return null

    const currentTime = new Date().getHours()
    
    if (networkCongestion === 'high') {
      return {
        type: 'warning' as const,
        message: 'Network congestion is high. Consider waiting 1-2 hours for lower fees.'
      }
    }
    
    if (currentTime >= 14 && currentTime <= 18) { // 2-6 PM UTC (peak hours)
      return {
        type: 'info' as const,
        message: 'Peak hours detected. Gas fees typically lower during off-peak times (late night/early morning UTC).'
      }
    }
    
    if (networkCongestion === 'low') {
      return {
        type: 'success' as const,
        message: 'Great timing! Network congestion is low - good time to transact.'
      }
    }
    
    return null
  }

  const optimizationTip = getOptimizationTip()

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Gas Fee</span>
          <div className="flex items-center gap-2">
            {getCongestionIcon()}
            <span className="text-sm text-white">
              {gasEstimate ? formatUSDAmount(estimateGasCost(gasEstimate[selectedSpeed])) : '~$5.42'}
            </span>
          </div>
        </div>

        {gasEstimate && (
          <div className="grid grid-cols-3 gap-1">
            {(['slow', 'standard', 'fast'] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedSelect(speed)}
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium transition-colors',
                  selectedSpeed === speed
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
              >
                {speed}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Fuel className="w-5 h-5 text-blue-400" />
          Gas Optimization
        </h3>
        <div className="flex items-center gap-2">
          {getCongestionIcon()}
          <span className={cn('text-sm font-medium capitalize', getCongestionColor())}>
            {networkCongestion} congestion
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Fetching gas estimates...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Gas Options */}
      {gasEstimate && (
        <div className="space-y-3">
          {(['slow', 'standard', 'fast'] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedSelect(speed)}
              className={cn(
                'w-full p-4 rounded-lg border transition-colors text-left',
                selectedSpeed === speed
                  ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    selectedSpeed === speed ? 'bg-blue-600' : 'bg-gray-700'
                  )}>
                    {getSpeedIcon(speed)}
                  </div>
                  <div>
                    <div className="font-medium text-white capitalize">{speed}</div>
                    <div className="text-sm text-gray-400">
                      ~{gasEstimate.estimatedTime[speed]}s
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">
                    {formatUSDAmount(estimateGasCost(gasEstimate[speed]))}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatGasPrice(gasEstimate[speed])} gwei
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Optimization Tip */}
      {optimizationTip && (
        <div className={cn(
          'flex items-start gap-3 p-4 rounded-lg',
          optimizationTip.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
          optimizationTip.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
          'bg-blue-500/10 border border-blue-500/20'
        )}>
          <div className={cn(
            'w-5 h-5 mt-0.5 flex-shrink-0',
            optimizationTip.type === 'success' ? 'text-green-400' :
            optimizationTip.type === 'warning' ? 'text-yellow-400' :
            'text-blue-400'
          )}>
            {optimizationTip.type === 'success' ? <TrendingDown className="w-5 h-5" /> :
             optimizationTip.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
             <Clock className="w-5 h-5" />}
          </div>
          <div>
            <p className={cn(
              'font-medium',
              optimizationTip.type === 'success' ? 'text-green-400' :
              optimizationTip.type === 'warning' ? 'text-yellow-400' :
              'text-blue-400'
            )}>
              Gas Optimization Tip
            </p>
            <p className={cn(
              'text-sm mt-1',
              optimizationTip.type === 'success' ? 'text-green-300' :
              optimizationTip.type === 'warning' ? 'text-yellow-300' :
              'text-blue-300'
            )}>
              {optimizationTip.message}
            </p>
          </div>
        </div>
      )}

      {/* Gas Tracker */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Current Base Fee</div>
          <div className="text-lg font-bold text-white">
            {gasEstimate ? formatGasPrice(gasEstimate.standard) : '--'} gwei
          </div>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Est. Confirmation</div>
          <div className="text-lg font-bold text-white">
            {gasEstimate ? `~${gasEstimate.estimatedTime[selectedSpeed]}s` : '--'}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchGasEstimate}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : 'Refresh Gas Estimates'}
      </button>
    </div>
  )
}

export default GasOptimizer