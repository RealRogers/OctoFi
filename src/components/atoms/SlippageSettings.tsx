/**
 * SlippageSettings Atom Component
 * Configurable slippage tolerance controls with presets and custom input
 */

import React, { useState, useEffect } from 'react'
import { Settings, AlertTriangle, Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSwapStore, useUserPreferencesStore } from '@/services/store'
import { cn } from '@/lib/utils'

const slippageSchema = z.object({
  customSlippage: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0.1 && num <= 5.0
  }, {
    message: "Slippage must be between 0.1% and 5.0%",
  }),
})

type SlippageFormValues = z.infer<typeof slippageSchema>

interface SlippageSettingsProps {
  className?: string
  compact?: boolean
}

const SlippageSettings: React.FC<SlippageSettingsProps> = ({ 
  className, 
  compact = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [isCustom, setIsCustom] = useState(false)

  const { slippage, setSlippage } = useSwapStore()
  const { defaultSlippage, setDefaultSlippage } = useUserPreferencesStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SlippageFormValues>({
    resolver: zodResolver(slippageSchema),
    defaultValues: {
      customSlippage: slippage.toString(),
    },
  })

  const customSlippageValue = watch('customSlippage')

  // Preset slippage values
  const presets = [0.1, 0.5, 1.0, 3.0]

  // Update form when slippage changes
  useEffect(() => {
    setValue('customSlippage', slippage.toString())
    
    // Check if current slippage matches a preset
    const presetIndex = presets.findIndex(preset => preset === slippage)
    if (presetIndex !== -1) {
      setSelectedPreset(presetIndex)
      setIsCustom(false)
    } else {
      setSelectedPreset(null)
      setIsCustom(true)
    }
  }, [slippage, setValue])

  const handlePresetClick = (preset: number, index: number) => {
    setSlippage(preset)
    setSelectedPreset(index)
    setIsCustom(false)
    setValue('customSlippage', preset.toString())
  }

  const handleCustomToggle = () => {
    setIsCustom(true)
    setSelectedPreset(null)
  }

  const onSubmit = (data: SlippageFormValues) => {
    const newSlippage = parseFloat(data.customSlippage)
    setSlippage(newSlippage)
  }

  const getSlippageWarning = (value: number) => {
    if (value < 0.5) {
      return {
        type: 'warning' as const,
        message: 'Very low slippage may cause transaction failures'
      }
    }
    if (value > 3.0) {
      return {
        type: 'error' as const,
        message: 'High slippage increases risk of unfavorable trades'
      }
    }
    return null
  }

  const currentWarning = getSlippageWarning(slippage)

  if (compact) {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{slippage}%</span>
        </button>

        {isOpen && (
          <>
            <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Slippage Tolerance</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                {/* Preset Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((preset, index) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetClick(preset, index)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        selectedPreset === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      )}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="space-y-2">
                  <button
                    onClick={handleCustomToggle}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                      isCustom
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    )}
                  >
                    Custom
                  </button>

                  {isCustom && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0.5"
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register('customSlippage')}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          %
                        </span>
                      </div>
                      {errors.customSlippage && (
                        <p className="text-xs text-red-400">{errors.customSlippage.message}</p>
                      )}
                    </form>
                  )}
                </div>

                {/* Warning */}
                {currentWarning && (
                  <div className={cn(
                    'flex items-start gap-2 p-3 rounded-lg',
                    currentWarning.type === 'error' 
                      ? 'bg-red-500/10 border border-red-500/20' 
                      : 'bg-yellow-500/10 border border-yellow-500/20'
                  )}>
                    <AlertTriangle className={cn(
                      'w-4 h-4 mt-0.5 flex-shrink-0',
                      currentWarning.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                    )} />
                    <span className={cn(
                      'text-xs',
                      currentWarning.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                    )}>
                      {currentWarning.message}
                    </span>
                  </div>
                )}

                {/* Info */}
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Info className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-blue-400">
                    Slippage tolerance is the maximum price change you're willing to accept during the swap.
                  </span>
                </div>
              </div>
            </div>

            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Slippage Tolerance
        </h3>
        <span className="text-sm text-gray-400">Current: {slippage}%</span>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {presets.map((preset, index) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset, index)}
            className={cn(
              'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              selectedPreset === index
                ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            )}
          >
            {preset}%
          </button>
        ))}
      </div>

      {/* Custom Input Section */}
      <div className="space-y-3">
        <button
          onClick={handleCustomToggle}
          className={cn(
            'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left',
            isCustom
              ? 'bg-blue-600 text-white ring-2 ring-blue-500'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
          )}
        >
          Custom Slippage
        </button>

        {isCustom && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter custom slippage"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                {...register('customSlippage')}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>
            {errors.customSlippage && (
              <p className="text-sm text-red-400">{errors.customSlippage.message}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Apply Custom Slippage
            </button>
          </form>
        )}
      </div>

      {/* Warning Display */}
      {currentWarning && (
        <div className={cn(
          'flex items-start gap-3 p-4 rounded-lg',
          currentWarning.type === 'error' 
            ? 'bg-red-500/10 border border-red-500/20' 
            : 'bg-yellow-500/10 border border-yellow-500/20'
        )}>
          <AlertTriangle className={cn(
            'w-5 h-5 mt-0.5 flex-shrink-0',
            currentWarning.type === 'error' ? 'text-red-400' : 'text-yellow-400'
          )} />
          <div>
            <p className={cn(
              'font-medium',
              currentWarning.type === 'error' ? 'text-red-400' : 'text-yellow-400'
            )}>
              {currentWarning.type === 'error' ? 'High Slippage Warning' : 'Low Slippage Warning'}
            </p>
            <p className={cn(
              'text-sm mt-1',
              currentWarning.type === 'error' ? 'text-red-300' : 'text-yellow-300'
            )}>
              {currentWarning.message}
            </p>
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <Info className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
        <div>
          <p className="font-medium text-blue-400">About Slippage Tolerance</p>
          <p className="text-sm text-blue-300 mt-1">
            Slippage tolerance is the maximum price change you're willing to accept during the swap. 
            Lower values reduce price impact but may cause transaction failures in volatile markets.
          </p>
        </div>
      </div>

      {/* Save as Default */}
      <button
        onClick={() => setDefaultSlippage(slippage)}
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
      >
        Save as Default ({defaultSlippage}%)
      </button>
    </div>
  )
}

export default SlippageSettings