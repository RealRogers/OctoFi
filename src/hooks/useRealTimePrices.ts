/**
 * Real-time Price Updates Hook
 * Manages WebSocket connections and price subscriptions for tokens
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { Token, TokenPrice, Chain } from '@/services/types'
import { dataService } from '@/services'
import { useAppStore, useSwapStore } from '@/services/store'
import { logger } from '@/services/errorHandler'

interface UsePriceOptions {
  enabled?: boolean
  refreshInterval?: number
}

export const useRealTimePrices = useTokenPrice

export const useTokenPrice = (token: Token | null, chain?: Chain, options: UsePriceOptions = {}) => {
  const { enabled = true, refreshInterval = 5000 } = options
  const [price, setPrice] = useState<TokenPrice | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { currentChainId } = useAppStore()
  const effectiveChain = chain || (currentChainId ? { id: currentChainId } as Chain : null)

  const fetchPrice = useCallback(async () => {
    if (!token || !effectiveChain || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const tokenPrice = await dataService.getTokenPrice(token, effectiveChain)
      setPrice(tokenPrice)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price'
      setError(errorMessage)
      logger.error('Price fetch error', err as Error, { token: token.symbol })
    } finally {
      setIsLoading(false)
    }
  }, [token, effectiveChain, enabled])

  // Subscribe to real-time price updates
  useEffect(() => {
    if (!token || !enabled) {
      setPrice(null)
      return
    }

    // Clean up previous subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
    }

    // Subscribe to price updates
    subscriptionRef.current = dataService.subscribeToPrice(token, (newPrice) => {
      setPrice(newPrice)
      setError(null)
    })

    // Initial fetch
    fetchPrice()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [token, enabled, fetchPrice])

  // Fallback polling for when WebSocket is not available
  useEffect(() => {
    if (!enabled || !token) return

    intervalRef.current = setInterval(() => {
      // Only poll if we don't have a recent price update
      if (!price || Date.now() - price.lastUpdated.getTime() > refreshInterval * 2) {
        fetchPrice()
      }
    }, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, token, refreshInterval, price, fetchPrice])

  const refresh = useCallback(() => {
    fetchPrice()
  }, [fetchPrice])

  return {
    price,
    isLoading,
    error,
    refresh
  }
}

export const useSwapPrices = () => {
  const { fromToken, toToken, setFromTokenPrice, setToTokenPrice } = useSwapStore()
  const { currentChainId } = useAppStore()

  const chain = currentChainId ? { id: currentChainId } as Chain : null

  const {
    price: fromPrice,
    isLoading: fromLoading,
    error: fromError
  } = useTokenPrice(fromToken, chain)

  const {
    price: toPrice,
    isLoading: toLoading,
    error: toError
  } = useTokenPrice(toToken, chain)

  // Update store when prices change
  useEffect(() => {
    setFromTokenPrice(fromPrice)
  }, [fromPrice, setFromTokenPrice])

  useEffect(() => {
    setToTokenPrice(toPrice)
  }, [toPrice, setToTokenPrice])

  return {
    fromPrice,
    toPrice,
    isLoading: fromLoading || toLoading,
    error: fromError || toError,
    hasFromPrice: !!fromPrice,
    hasToPrice: !!toPrice
  }
}

export const usePriceCalculation = () => {
  const { fromAmount, toAmount, setToAmount, fromToken, toToken } = useSwapStore()
  const { fromPrice, toPrice } = useSwapPrices()

  const calculateToAmount = useCallback((inputAmount: string) => {
    if (!inputAmount || !fromPrice || !toPrice || !fromToken || !toToken) {
      return '0.0'
    }

    const numericAmount = parseFloat(inputAmount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return '0.0'
    }

    // Simple price calculation (in real implementation, this would use DEX routing)
    const fromValueUSD = numericAmount * fromPrice.priceUSD
    const toAmount = fromValueUSD / toPrice.priceUSD

    // Apply a small spread (0.3%) to simulate DEX fees
    const toAmountWithSpread = toAmount * 0.997

    return toAmountWithSpread.toFixed(6)
  }, [fromPrice, toPrice, fromToken, toToken])

  // Auto-calculate to amount when from amount or prices change
  useEffect(() => {
    if (fromAmount && fromPrice && toPrice) {
      const calculatedAmount = calculateToAmount(fromAmount)
      setToAmount(calculatedAmount)
    } else {
      setToAmount('0.0')
    }
  }, [fromAmount, fromPrice, toPrice, calculateToAmount, setToAmount])

  const getExchangeRate = useCallback(() => {
    if (!fromPrice || !toPrice || !fromToken || !toToken) {
      return null
    }

    const rate = fromPrice.priceUSD / toPrice.priceUSD
    return {
      rate,
      formatted: `1 ${fromToken.symbol} = ${rate.toFixed(6)} ${toToken.symbol}`
    }
  }, [fromPrice, toPrice, fromToken, toToken])

  const getPriceImpact = useCallback((inputAmount: string) => {
    // Mock price impact calculation
    const amount = parseFloat(inputAmount)
    if (isNaN(amount) || amount <= 0) return 0

    // Simulate price impact based on amount (larger amounts = higher impact)
    const impact = Math.min(amount / 10000, 0.05) // Max 5% impact
    return impact * 100 // Return as percentage
  }, [])

  return {
    calculateToAmount,
    getExchangeRate,
    getPriceImpact,
    fromPriceUSD: fromPrice?.priceUSD,
    toPriceUSD: toPrice?.priceUSD
  }
}