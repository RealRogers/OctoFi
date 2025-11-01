/**
 * PriceDisplay Atom Component
 * Displays token prices with change indicators and animations
 */

import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { TokenPrice } from '@/services/types'
import { formatUSDAmount, formatPercentage } from '@/services/utils'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price?: TokenPrice | null
  amount?: string
  isLoading?: boolean
  className?: string
  showChange?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  amount,
  isLoading = false,
  className,
  showChange = true,
  size = 'md'
}) => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  // Track price changes for animations
  useEffect(() => {
    if (price && previousPrice !== null && price.priceUSD !== previousPrice) {
      setPriceDirection(price.priceUSD > previousPrice ? 'up' : 'down')
      setShowAnimation(true)
      
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    
    if (price) {
      setPreviousPrice(price.priceUSD)
    }
  }, [price, previousPrice])

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          price: 'text-sm',
          change: 'text-xs',
          icon: 'w-3 h-3'
        }
      case 'lg':
        return {
          price: 'text-lg',
          change: 'text-sm',
          icon: 'w-4 h-4'
        }
      default:
        return {
          price: 'text-base',
          change: 'text-xs',
          icon: 'w-3 h-3'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const calculateDisplayValue = () => {
    if (!price) return null
    
    if (amount) {
      const numericAmount = parseFloat(amount)
      if (!isNaN(numericAmount)) {
        return numericAmount * price.priceUSD
      }
    }
    
    return price.priceUSD
  }

  const displayValue = calculateDisplayValue()

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-gray-400">Loading price...</span>
      </div>
    )
  }

  if (!price || displayValue === null) {
    return (
      <div className={cn('text-gray-500', sizeClasses.price, className)}>
        $0.00
      </div>
    )
  }

  const changeColor = price.change24h >= 0 ? 'text-green-400' : 'text-red-400'
  const changeIcon = price.change24h >= 0 ? 
    <TrendingUp className={cn(sizeClasses.icon, 'text-green-400')} /> :
    <TrendingDown className={cn(sizeClasses.icon, 'text-red-400')} />

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Price Value */}
      <span className={cn(
        'font-medium transition-all duration-300',
        sizeClasses.price,
        showAnimation && priceDirection === 'up' && 'text-green-400',
        showAnimation && priceDirection === 'down' && 'text-red-400',
        !showAnimation && 'text-gray-300'
      )}>
        {formatUSDAmount(displayValue)}
      </span>

      {/* Price Change */}
      {showChange && (
        <div className="flex items-center gap-1">
          {changeIcon}
          <span className={cn(sizeClasses.change, changeColor)}>
            {formatPercentage(price.change24h)}
          </span>
        </div>
      )}

      {/* Animation Indicator */}
      {showAnimation && (
        <div className={cn(
          'w-2 h-2 rounded-full animate-pulse',
          priceDirection === 'up' ? 'bg-green-400' : 'bg-red-400'
        )} />
      )}
    </div>
  )
}

export default PriceDisplay