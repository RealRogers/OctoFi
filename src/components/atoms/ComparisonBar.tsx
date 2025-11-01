/**
 * ComparisonBar Atom Component
 * Animated progress bar for performance comparisons with smooth animations
 */

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ComparisonBarProps {
  label: string
  value: number
  maxValue?: number
  color?: string
  className?: string
  animated?: boolean
  showValue?: boolean
  valueFormatter?: (value: number) => string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'glass'
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({
  label,
  value,
  maxValue = 100,
  color = 'blue',
  className,
  animated = true,
  showValue = true,
  valueFormatter = (val) => `${val.toFixed(1)}%`,
  size = 'md',
  variant = 'default'
}) => {
  // Calculate percentage for display
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100)
  
  // Color mapping
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500'
  }

  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    red: 'bg-gradient-to-r from-red-400 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
    pink: 'bg-gradient-to-r from-pink-400 to-pink-600',
    indigo: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
  }

  // Size mapping
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  // Get appropriate color class
  const getBarColorClass = () => {
    if (variant === 'gradient') {
      return gradientClasses[color as keyof typeof gradientClasses] || gradientClasses.blue
    }
    if (variant === 'glass') {
      return `${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}/80 backdrop-blur-sm`
    }
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
  }

  // Get background class based on variant
  const getBackgroundClass = () => {
    if (variant === 'glass') {
      return 'bg-gray-800/30 backdrop-blur-sm border border-white/10'
    }
    return 'bg-gray-800'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label and Value */}
      <div className="flex justify-between items-center">
        <span className={cn(
          'font-medium text-gray-300',
          textSizeClasses[size]
        )}>
          {label}
        </span>
        {showValue && (
          <span className={cn(
            'font-semibold text-white',
            textSizeClasses[size]
          )}>
            {valueFormatter(value)}
          </span>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className={cn(
        'rounded-full overflow-hidden',
        sizeClasses[size],
        getBackgroundClass()
      )}>
        {/* Progress Bar Fill */}
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2 
            }}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              getBarColorClass()
            )}
          />
        ) : (
          <div
            style={{ width: `${percentage}%` }}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              getBarColorClass()
            )}
          />
        )}
      </div>
    </div>
  )
}

export default ComparisonBar