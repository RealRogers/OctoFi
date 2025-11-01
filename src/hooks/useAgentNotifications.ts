/**
 * useAgentNotifications Hook
 * 
 * Manages toast notifications for trading agent actions.
 * Subscribes to agent action events and displays appropriate user feedback.
 */

import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { tradingAgentService } from '@/services/tradingAgentService'
import type { 
  AgentAction, 
  SwapActionData, 
  PauseActionData 
} from '@/services/types'
import { TOAST_DURATIONS } from '@/constants/dashboard'

/**
 * Custom hook that handles agent action notifications
 * 
 * Automatically subscribes to trading agent actions and displays
 * appropriate toast notifications based on action type and result.
 * 
 * @example
 * ```typescript
 * function AgentDashboard() {
 *   useAgentNotifications() // That's it!
 *   
 *   return <div>Dashboard content...</div>
 * }
 * ```
 */
export function useAgentNotifications(): void {
  const { toast } = useToast()

  useEffect(() => {
    // Subscribe to agent actions
    const subscription = tradingAgentService.subscribeToActions((action: AgentAction) => {
      handleAgentAction(action, toast)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [toast])
}

/**
 * Handles individual agent actions and displays appropriate toasts
 * 
 * @param action - The agent action that occurred
 * @param toast - Toast notification function
 */
function handleAgentAction(
  action: AgentAction,
  toast: ReturnType<typeof useToast>['toast']
): void {
  if (action.result === 'success') {
    handleSuccessAction(action, toast)
  } else if (action.result === 'failure') {
    handleFailureAction(action, toast)
  }
}

/**
 * Handles successful agent actions
 * 
 * @param action - The successful action
 * @param toast - Toast notification function
 */
function handleSuccessAction(
  action: AgentAction,
  toast: ReturnType<typeof useToast>['toast']
): void {
  switch (action.type) {
    case 'swap':
      handleSwapSuccess(action, toast)
      break
      
    case 'resume':
      toast({
        title: '🚀 Agent Activated',
        description: 'AI trading agent is now active and monitoring markets',
        variant: 'default',
        duration: TOAST_DURATIONS.MEDIUM,
      })
      break
      
    case 'pause':
      handlePauseSuccess(action, toast)
      break
      
    case 'strategy_change':
      toast({
        title: '⚙️ Strategy Updated',
        description: 'Trading strategy has been successfully updated',
        variant: 'default',
        duration: TOAST_DURATIONS.MEDIUM,
      })
      break
      
    default:
      toast({
        title: '🤖 Action Complete',
        description: `Successfully completed ${action.type}`,
        variant: 'default',
        duration: TOAST_DURATIONS.SHORT,
      })
  }
}

/**
 * Handles swap action success with specific messaging
 * 
 * @param action - The swap action
 * @param toast - Toast notification function
 */
function handleSwapSuccess(
  action: AgentAction,
  toast: ReturnType<typeof useToast>['toast']
): void {
  const swapData = action.data as SwapActionData | undefined
  
  if (swapData?.type === 'optimization') {
    toast({
      title: '🤖 Portfolio Optimized',
      description: 'AI agent successfully optimized your portfolio allocation',
      variant: 'default',
      duration: TOAST_DURATIONS.MEDIUM,
    })
  } else if (swapData?.type === 'rebalancing') {
    toast({
      title: '⚖️ Portfolio Rebalanced',
      description: 'AI agent rebalanced your portfolio to maintain target allocation',
      variant: 'default',
      duration: TOAST_DURATIONS.MEDIUM,
    })
  } else {
    toast({
      title: '✅ Trade Executed',
      description: `Successfully completed ${action.type} operation`,
      variant: 'default',
      duration: TOAST_DURATIONS.MEDIUM,
    })
  }
}

/**
 * Handles pause action success with reason
 * 
 * @param action - The pause action
 * @param toast - Toast notification function
 */
function handlePauseSuccess(
  action: AgentAction,
  toast: ReturnType<typeof useToast>['toast']
): void {
  const pauseData = action.data as PauseActionData | undefined
  const reason = pauseData?.reason || 'AI trading agent has been paused'
  
  toast({
    title: '⏸️ Agent Paused',
    description: reason,
    variant: 'default',
    duration: TOAST_DURATIONS.MEDIUM,
  })
}

/**
 * Handles failed agent actions
 * 
 * @param action - The failed action
 * @param toast - Toast notification function
 */
function handleFailureAction(
  action: AgentAction,
  toast: ReturnType<typeof useToast>['toast']
): void {
  const errorMessage = action.error || `Failed to complete ${action.type}`
  
  toast({
    title: '❌ Action Failed',
    description: errorMessage,
    variant: 'destructive',
    duration: TOAST_DURATIONS.LONG,
  })
}
