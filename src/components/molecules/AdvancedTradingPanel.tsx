/**
 * AdvancedTradingPanel Molecule Component
 * Integrates all advanced trading features: slippage, gas optimization, price impact, and cross-chain
 */

import React, { useState } from 'react'
import { Settings, ChevronDown, ChevronUp } from 'lucide-react'
import { Token, SwapTransaction, LiquidityData } from '@/services/types'
import { useSwapStore } from '@/services/store'
import SlippageSettings from '@/components/atoms/SlippageSettings'
import PriceImpactChart from '@/components/atoms/PriceImpactChart'
import GasOptimizer from '@/components/atoms/GasOptimizer'
import CrossChainBridge from '@/components/atoms/CrossChainBridge'
import { cn } from '@/lib/utils'

interface AdvancedTradingPanelProps {
  fromToken?: Token | null
  toToken?: Token | null
  amount?: string
  priceImpact?: number
  liquidityData?: LiquidityData
  transaction?: SwapTransaction
  className?: string
  defaultExpanded?: boolean
}

const AdvancedTradingPanel: React.FC<AdvancedTradingPanelProps> = ({
  fromToken,
  toToken,
  amount,
  priceImpact = 0,
  liquidityData,
  transaction,
  className,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [activeTab, setActiveTab] = useState<'slippage' | 'gas' | 'impact' | 'bridge'>('slippage')

  const { crossChain } = useSwapStore()

  const tabs = [
    { id: 'slippage' as const, label: 'Slippage', icon: Settings },
    { id: 'gas' as const, label: 'Gas', icon: Settings },
    { id: 'impact' as const, label: 'Impact', icon: Settings },
    ...(crossChain ? [{ id: 'bridge' as const, label: 'Bridge', icon: Settings }] : [])
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'slippage':
        return <SlippageSettings />
      case 'gas':
        return <GasOptimizer transaction={transaction} />
      case 'impact':
        return (
          <PriceImpactChart
            currentAmount={amount || '0'}
            priceImpact={priceImpact}
            liquidityData={liquidityData}
          />
        )
      case 'bridge':
        return (
          <CrossChainBridge
            fromToken={fromToken}
            toToken={toToken}
            amount={amount}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={cn('bg-gray-900 border border-gray-800 rounded-xl', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">Advanced Settings</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Compact View */}
      {!isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <SlippageSettings compact />
          <GasOptimizer transaction={transaction} compact />
          <PriceImpactChart
            currentAmount={amount || '0'}
            priceImpact={priceImpact}
            liquidityData={liquidityData}
            compact
          />
          {crossChain && (
            <CrossChainBridge
              fromToken={fromToken}
              toToken={toToken}
              amount={amount}
              compact
            />
          )}
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedTradingPanel