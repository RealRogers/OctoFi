/**
 * ConfidenceScore Atom Component
 * Animated progress indicator for AI confidence levels
 */

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ConfidenceScoreProps {
  confidence: number // 0-100
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  confidence,
  label = 'Confidence',
  className,
  size = 'md',
  animated = true
}) => {
  const [displayConfidence, setDisplayConfidence] = useState(0)

  useEffect(() => {
    if (animated) {
      // Animate the confidence score
      const timer = setTimeout(() => {
        setDisplayConfidence(confidence)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayConfidence(confidence)
    }
  }, [confidence, animated])

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getConfidenceBg = (score: number) => {
    if (score >= 80) return 'bg-green-400'
    if (score >= 60) return 'bg-yellow-400'
    if (score >= 40) return 'bg-orange-400'
    return 'bg-red-400'
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-16 h-16',
          text: 'text-xs',
          stroke: 'stroke-[3]'
        }
      case 'lg':
        return {
          container: 'w-24 h-24',
          text: 'text-lg',
          stroke: 'stroke-[2]'
        }
      default:
        return {
          container: 'w-20 h-20',
          text: 'text-sm',
          stroke: 'stroke-[2.5]'
        }
    }
  }

  const sizeClasses = getSizeClasses()
  const radius = size === 'sm' ? 28 : size === 'lg' ? 44 : 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayConfidence / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* Circular Progress */}
      <div className={cn('relative', sizeClasses.container)}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="fill-none stroke-gray-700"
            strokeWidth="3"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={cn(
              'fill-none transition-all duration-1000 ease-out',
              getConfidenceBg(confidence),
              sizeClasses.stroke
            )}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? strokeDashoffset : circumference - (confidence / 100) * circumference}
          />
        </svg>
        
        {/* Confidence Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'font-bold',
            sizeClasses.text,
            getConfidenceColor(confidence)
          )}>
            {Math.round(displayConfidence)}%
          </span>
        </div>
      </div>

      {/* Label */}
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  )
}

export default ConfidenceScore