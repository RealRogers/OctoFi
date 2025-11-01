/**
 * AgentToggle Atom Component
 * Toggle switch for enabling/disabling autonomous trading agent
 */

import React, { useState } from 'react'
import { Bot, Power, Loader2, AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface AgentToggleProps {
  isActive: boolean
  isLoading?: boolean
  disabled?: boolean
  onToggle: (active: boolean) => void
  className?: string
}

const AgentToggle: React.FC<AgentToggleProps> = ({
  isActive,
  isLoading = false,
  disabled = false,
  onToggle,
  className
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = async (checked: boolean) => {
    if (disabled || isLoading) return

    setIsAnimating(true)
    try {
      await onToggle(checked)
    } finally {
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const getStatusColor = () => {
    if (disabled) return 'text-gray-500'
    if (isActive) return 'text-green-400'
    return 'text-gray-400'
  }

  const getStatusText = () => {
    if (isLoading) return 'Processing...'
    if (disabled) return 'Unavailable'
    if (isActive) return 'Active'
    return 'Inactive'
  }

  const getStatusIcon = () => {
    if (isLoading || isAnimating) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
    }
    if (disabled) {
      return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
    if (isActive) {
      return <Power className="w-4 h-4 text-green-400" />
    }
    return <Bot className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-lg border',
      isActive ? 'bg-green-500/5 border-green-500/20' : 'bg-gray-800/50 border-gray-700',
      className
    )}>
      {/* Agent Status */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-2 rounded-full transition-all duration-300',
          isActive ? 'bg-green-500/20' : 'bg-gray-700',
          isAnimating && 'scale-110'
        )}>
          {getStatusIcon()}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">Trading Agent</span>
            {isActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <span className={cn('text-sm', getStatusColor())}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center gap-3">
        {isActive && (
          <div className="text-xs text-green-400 font-medium">
            LIVE
          </div>
        )}
        
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
          disabled={disabled || isLoading}
          className={cn(
            'data-[state=checked]:bg-green-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
    </div>
  )
}

export default AgentToggle