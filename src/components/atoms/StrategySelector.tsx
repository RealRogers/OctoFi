/**
 * StrategySelector Atom Component
 * Dropdown for selecting trading strategies with risk tolerance settings
 */

import React, { useState } from 'react'
import { ChevronDown, Shield, TrendingUp, Zap, Settings } from 'lucide-react'
import { TradingStrategy } from '@/services/types'
import { cn } from '@/lib/utils'

interface StrategySelectorProps {
  strategy: TradingStrategy
  onStrategyChange: (strategy: TradingStrategy) => void
  disabled?: boolean
  className?: string
}

const STRATEGY_PRESETS = {
  conservative: {
    riskTolerance: 'conservative' as const,
    maxSlippage: 0.5,
    stopLoss: 0.03,
    takeProfit: 0.08,
    rebalanceThreshold: 0.01,
    name: 'Conservative',
    description: 'Low risk, steady returns',
    icon: Shield,
    color: 'text-green-400'
  },
  moderate: {
    riskTolerance: 'moderate' as const,
    maxSlippage: 1.0,
    stopLoss: 0.05,
    takeProfit: 0.15,
    rebalanceThreshold: 0.02,
    name: 'Moderate',
    description: 'Balanced risk and reward',
    icon: TrendingUp,
    color: 'text-blue-400'
  },
  aggressive: {
    riskTolerance: 'aggressive' as const,
    maxSlippage: 2.0,
    stopLoss: 0.08,
    takeProfit: 0.25,
    rebalanceThreshold: 0.03,
    name: 'Aggressive',
    description: 'High risk, high reward',
    icon: Zap,
    color: 'text-orange-400'
  }
}

const StrategySelector: React.FC<StrategySelectorProps> = ({
  strategy,
  onStrategyChange,
  disabled = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustom, setShowCustom] = useState(false)

  const currentPreset = Object.entries(STRATEGY_PRESETS).find(
    ([_, preset]) => preset.riskTolerance === strategy.riskTolerance
  )

  const handlePresetSelect = (presetKey: keyof typeof STRATEGY_PRESETS) => {
    const preset = STRATEGY_PRESETS[presetKey]
    onStrategyChange({
      riskTolerance: preset.riskTolerance,
      maxSlippage: preset.maxSlippage,
      stopLoss: preset.stopLoss,
      takeProfit: preset.takeProfit,
      rebalanceThreshold: preset.rebalanceThreshold
    })
    setIsOpen(false)
  }

  const handleCustomChange = (field: keyof TradingStrategy, value: any) => {
    onStrategyChange({
      ...strategy,
      [field]: value
    })
  }

  const getCurrentIcon = () => {
    if (currentPreset) {
      const IconComponent = currentPreset[1].icon
      return <IconComponent className={cn('w-4 h-4', currentPreset[1].color)} />
    }
    return <Settings className="w-4 h-4 text-gray-400" />
  }

  const getCurrentName = () => {
    return currentPreset ? currentPreset[1].name : 'Custom'
  }

  return (
    <div className={cn('relative', className)}>
      {/* Strategy Selector Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between p-3 rounded-lg border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          disabled 
            ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50'
            : 'bg-gray-800 border-gray-600 hover:border-gray-500'
        )}
      >
        <div className="flex items-center gap-3">
          {getCurrentIcon()}
          <div className="text-left">
            <div className="text-white font-medium">{getCurrentName()}</div>
            <div className="text-xs text-gray-400">
              {currentPreset ? currentPreset[1].description : 'Custom configuration'}
            </div>
          </div>
        </div>
        
        <ChevronDown className={cn(
          'w-4 h-4 text-gray-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Preset Strategies */}
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Preset Strategies</div>
            {Object.entries(STRATEGY_PRESETS).map(([key, preset]) => {
              const IconComponent = preset.icon
              const isSelected = strategy.riskTolerance === preset.riskTolerance
              
              return (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key as keyof typeof STRATEGY_PRESETS)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                    isSelected 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'hover:bg-gray-700'
                  )}
                >
                  <IconComponent className={cn('w-4 h-4', preset.color)} />
                  <div className="flex-1">
                    <div className="text-white font-medium">{preset.name}</div>
                    <div className="text-xs text-gray-400">{preset.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Max Slippage: {preset.maxSlippage}% • Stop Loss: {(preset.stopLoss * 100).toFixed(1)}%
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Custom Strategy Toggle */}
          <div className="border-t border-gray-700 p-2">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-white text-sm">Custom Strategy</span>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                showCustom && 'rotate-180'
              )} />
            </button>

            {/* Custom Strategy Controls */}
            {showCustom && (
              <div className="mt-2 space-y-3 p-2 bg-gray-900/50 rounded-lg">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Risk Tolerance</label>
                  <select
                    value={strategy.riskTolerance}
                    onChange={(e) => handleCustomChange('riskTolerance', e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Max Slippage: {strategy.maxSlippage}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={strategy.maxSlippage}
                    onChange={(e) => handleCustomChange('maxSlippage', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Stop Loss: {(strategy.stopLoss * 100).toFixed(1)}%
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.2"
                    step="0.01"
                    value={strategy.stopLoss}
                    onChange={(e) => handleCustomChange('stopLoss', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Take Profit: {(strategy.takeProfit * 100).toFixed(1)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.01"
                    value={strategy.takeProfit}
                    onChange={(e) => handleCustomChange('takeProfit', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default StrategySelector