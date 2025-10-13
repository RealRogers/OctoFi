/**
 * ExchangeRate Atom Component
 * Displays exchange rate between two tokens with real-time updates
 */

import React, { useState, useEffect } from 'react'
import { RefreshCw, ArrowRightLeft } from 'lucide-react'
import { Token, TokenPrice } from '@/services/types'
import { formatTokenAmount } from '@/services/utils'
import { cn } from '@/lib/utils'

interface ExchangeRateProps {
  fromToken?: Token | null
  toToken?: Token | null
  fromPrice?: TokenPrice | null
  toPrice?: TokenPrice | null
  className?: string
  showRefresh?: boolean
  onRefresh?: () => void
}

const ExchangeRate: React.FC<ExchangeRateProps> = ({
  fromToken,
  toToken,
  fromPrice,
  toPrice,
  className,
  showRefresh = false,
  onRefresh
}) => {
  const [isInverted, setIsInverted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Reset inversion when tokens change
  useEffect(() => {
    setIsInverted(false)
  }, [fromToken, toToken])

  const calculateRate = () => {
    if (!fromPrice || !toPrice || !fromToken || !toToken) {
      return null
    }

    if (isInverted) {
      const rate = toPrice.priceUSD / fromPrice.priceUSD
      return {
        rate,
        baseToken: toToken,
        quoteToken: fromToken,
        formatted: `1 ${toToken.symbol} = ${formatTokenAmount(rate.toString(), 6)} ${fromToken.symbol}`
      }
    } else {
      const rate = fromPrice.priceUSD / toPrice.priceUSD
      return {
        rate,
        baseToken: fromToken,
        quoteToken: toToken,
        formatted: `1 ${fromToken.symbol} = ${formatTokenAmount(rate.toString(), 6)} ${toToken.symbol}`
      }
    }
  }

  const handleInvert = () => {
    setIsAnimating(true)
    setIsInverted(!isInverted)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const handleRefresh = () => {
    if (onRefresh) {
      setIsAnimating(true)
      onRefresh()
      
      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    }
  }

  const rateData = calculateRate()

  if (!rateData) {
    return (
      <div className={cn('flex items-center justify-between text-sm', className)}>
        <span className="text-gray-400">Exchange Rate</span>
        <span className="text-gray-500">-</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-between text-sm', className)}>
      <span className="text-gray-400">Exchange Rate</span>
      
      <div className="flex items-center gap-2">
        {/* Rate Display */}
        <button
          onClick={handleInvert}
          className={cn(
            'text-white hover:text-gray-300 transition-all duration-300 cursor-pointer',
            isAnimating && 'scale-95'
          )}
          title="Click to invert rate"
        >
          <span className={cn(
            'transition-opacity duration-300',
            isAnimating && 'opacity-50'
          )}>
            {rateData.formatted}
          </span>
        </button>

        {/* Invert Button */}
        <button
          onClick={handleInvert}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title="Invert exchange rate"
        >
          <ArrowRightLeft className={cn(
            'w-3 h-3 text-gray-400 transition-transform duration-300',
            isAnimating && 'rotate-180'
          )} />
        </button>

        {/* Refresh Button */}
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Refresh rate"
          >
            <RefreshCw className={cn(
              'w-3 h-3 text-gray-400 transition-transform duration-300',
              isAnimating && 'rotate-180'
            )} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ExchangeRate