/**
 * AgentStatusIndicator Atom Component
 * Small indicator showing trading agent status in the navbar
 */

import React from 'react'
import { Bot } from 'lucide-react'
import { useTradingAgent } from '@/hooks/useTradingAgent'
import { cn } from '@/lib/utils'

interface AgentStatusIndicatorProps {
  className?: string
  showLabel?: boolean
}

const AgentStatusIndicator: React.FC<AgentStatusIndicatorProps> = ({
  className,
  showLabel = false
}) => {
  const { isActive, canExecuteTrades } = useTradingAgent()

  const getStatusColor = () => {
    if (!canExecuteTrades()) return 'text-muted-foreground'
    return isActive ? 'text-green-500' : 'text-yellow-500'
  }

  const getStatusText = () => {
    if (!canExecuteTrades()) return 'Inactive'
    return isActive ? 'Active' : 'Ready'
  }

  const getDotColor = () => {
    if (!canExecuteTrades()) return 'bg-muted-foreground'
    return isActive ? 'bg-green-500' : 'bg-yellow-500'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Bot className={cn('w-4 h-4', getStatusColor())} />
        <div className={cn(
          'absolute -top-1 -right-1 w-2 h-2 rounded-full',
          getDotColor(),
          isActive && 'animate-pulse'
        )} />
      </div>
      
      {showLabel && (
        <span className={cn('text-xs font-medium', getStatusColor())}>
          {getStatusText()}
        </span>
      )}
    </div>
  )
}

export default AgentStatusIndicator