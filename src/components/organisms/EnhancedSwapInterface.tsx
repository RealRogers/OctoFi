/**
 * Enhanced SwapInterface Component
 * AI-powered swap interface with real-time data, predictions, and risk assessment
 */

import React, { useEffect, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Services and hooks
import { useSwapStore, useAppStore } from '@/services/store'
import { useSwapPrices, usePriceCalculation } from '@/hooks/useRealTimePrices'
import { Token, TokenPair, SwapParameters } from '@/services/types'

// Components
import AIInsightsPanel from '@/components/molecules/AIInsightsPanel'
import AgentControls from '@/components/molecules/AgentControls'
import TokenSelector from '@/components/atoms/TokenSelector'
import PriceDisplay from '@/components/atoms/PriceDisplay'
import ExchangeRate from '@/components/atoms/ExchangeRate'

import { cn } from '@/lib/utils'

const swapSchema = z.object({
  fromAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Enter a valid amount",
  }),
  toAmount: z.string(),
})

type SwapFormValues = z.infer<typeof swapSchema>

interface EnhancedSwapInterfaceProps {
  className?: string
}

const EnhancedSwapInterface: React.FC<EnhancedSwapInterfaceProps> = ({ className }) => {
  // Store state
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    swapTokens,
    isLoading,
    error,
    setError
  } = useSwapStore()

  const { isWalletConnected } = useAppStore()

  // Real-time prices
  const { fromPrice, toPrice, isLoading: pricesLoading } = useSwapPrices()
  const { calculateToAmount, getExchangeRate, getPriceImpact } = usePriceCalculation()

  // Form handling
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SwapFormValues>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: fromAmount || "",
      toAmount: toAmount || "0.0",
    },
  })

  // Sync form with store
  useEffect(() => {
    setValue('fromAmount', fromAmount)
  }, [fromAmount, setValue])

  useEffect(() => {
    setValue('toAmount', toAmount)
  }, [toAmount, setValue])

  // Create token pair for AI insights
  const tokenPair: TokenPair | undefined = useMemo(() => {
    if (fromToken && toToken) {
      return { fromToken, toToken }
    }
    return undefined
  }, [fromToken, toToken])

  // Create swap parameters for risk assessment
  const swapParams: SwapParameters | undefined = useMemo(() => {
    if (fromToken && toToken && fromAmount) {
      return {
        fromToken,
        toToken,
        amount: fromAmount,
        slippage
      }
    }
    return undefined
  }, [fromToken, toToken, fromAmount, slippage])

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFromAmount(value)
      setError(null)
    }
  }

  const handleSwapDirection = () => {
    swapTokens()
  }

  const handleMaxClick = () => {
    // TODO: Implement max balance functionality
    console.log("MAX button clicked")
  }

  const onSubmit = (data: SwapFormValues) => {
    if (!isWalletConnected) {
      setError("Please connect your wallet to continue")
      return
    }

    if (!fromToken || !toToken) {
      setError("Please select both tokens")
      return
    }

    console.log("Enhanced swap submitted:", {
      ...data,
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      slippage,
      priceImpact: getPriceImpact(data.fromAmount)
    })
  }

  const exchangeRate = getExchangeRate()
  const priceImpact = fromAmount ? getPriceImpact(fromAmount) : 0

  return (
    <div className={className}>
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">AI-Enhanced Swap</h1>
        <p className="text-muted-foreground mt-2">Powered by real-time market intelligence</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3">
        {/* Main Swap Interface */}
        <div className="xl:col-span-2 lg:col-span-2">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 max-w-md mx-auto w-full">
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* From Section */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">From (You Pay)</label>
              
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    className="bg-transparent text-3xl sm:text-4xl font-bold text-foreground outline-none w-full placeholder:text-muted-foreground/30 focus:ring-0"
                    aria-label="Amount to pay"
                    {...register("fromAmount", { onChange: handleFromAmountChange })}
                  />
                  
                  <TokenSelector
                    selectedToken={fromToken}
                    onTokenSelect={setFromToken}
                    placeholder="Select token"
                    type="from"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <PriceDisplay 
                    price={fromPrice}
                    amount={fromAmount}
                    isLoading={pricesLoading}
                    size="sm"
                  />
                  {errors.fromAmount && (
                    <span className="text-sm text-red-500">{errors.fromAmount.message}</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end items-center gap-2">
                <span className="text-sm text-muted-foreground">Balance: 0.0</span>
                <button 
                  onClick={handleMaxClick}
                  className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Set maximum amount"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="relative flex justify-center -my-2 z-10">
              <button 
                onClick={handleSwapDirection}
                className="bg-card border border-border rounded-full p-3 hover:bg-muted transition-colors cursor-pointer min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Swap direction"
              >
                <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* To Section */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">To (You Receive)</label>
              
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground" aria-live="polite" aria-atomic="true">
                    {toAmount}
                  </div>
                  
                  <TokenSelector
                    selectedToken={toToken}
                    onTokenSelect={setToToken}
                    placeholder="Select token"
                    type="to"
                  />
                </div>
                
                <PriceDisplay 
                  price={toPrice}
                  amount={toAmount}
                  isLoading={pricesLoading}
                  size="sm"
                />
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2 py-4">
              <ExchangeRate
                fromToken={fromToken}
                toToken={toToken}
                fromPrice={fromPrice}
                toPrice={toPrice}
                showRefresh
              />
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Impact</span>
                <span className={cn(
                  priceImpact > 3 ? 'text-red-500' : 
                  priceImpact > 1 ? 'text-yellow-500' : 'text-green-500'
                )}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage Tolerance</span>
                <span className="text-foreground">{slippage}%</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground">~$5.42</span>
              </div>
            </div>

            {/* Swap Button */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <button
                type="submit"
                disabled={isLoading || pricesLoading || !fromToken || !toToken || !fromAmount}
                className={cn(
                  "w-full font-semibold py-4 rounded-xl transition-all cursor-pointer min-h-[44px]",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  isLoading || pricesLoading || !fromToken || !toToken || !fromAmount
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                )}
                aria-label="Execute swap"
              >
                {isLoading ? "Processing..." : 
                 pricesLoading ? "Loading Prices..." :
                 !isWalletConnected ? "Connect Wallet" :
                 !fromToken || !toToken ? "Select Tokens" :
                 !fromAmount ? "Enter Amount" : "Swap"}
              </button>
            </form>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="xl:col-span-1 lg:col-span-1">
          <AIInsightsPanel 
            tokenPair={tokenPair}
            swapParams={swapParams}
            className="sticky top-4"
          />
        </div>

        {/* Trading Agent Controls */}
        <div className="xl:col-span-1 lg:col-span-3 xl:order-last lg:order-first">
          <AgentControls className="sticky top-4" />
        </div>
      </div>
    </div>
  )
}

export default EnhancedSwapInterface