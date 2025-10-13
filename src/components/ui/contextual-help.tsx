/**
 * ContextualHelp Component
 * Provides contextual help tooltips throughout the dashboard
 */

import React from 'react';
import { Info, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ContextualHelpProps {
  topic: string;
  variant?: 'info' | 'help' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

// Help content database
const helpContent: Record<string, { title: string; content: string; details?: string[] }> = {
  // Agent Status Help
  'agent-status': {
    title: 'Agent Status',
    content: 'Shows whether your AI trading agent is currently active and monitoring markets.',
    details: [
      'Active: Agent is running and can execute trades',
      'Ready: Agent is configured but paused',
      'Inactive: Agent needs configuration or has errors'
    ]
  },
  
  'agent-strategy': {
    title: 'Trading Strategy',
    content: 'Your current risk tolerance and trading approach configuration.',
    details: [
      'Conservative: Lower risk, steady returns',
      'Moderate: Balanced risk-reward approach', 
      'Aggressive: Higher risk for potential higher returns'
    ]
  },

  // Performance Metrics Help
  'profit-loss': {
    title: 'Total Profit & Loss',
    content: 'Cumulative profit or loss from all trades executed by your AI agent.',
    details: [
      'Includes realized gains/losses from completed trades',
      'Updated in real-time as trades are executed',
      'Calculated after fees and slippage'
    ]
  },

  'win-rate': {
    title: 'Win Rate',
    content: 'Percentage of profitable trades versus total trades executed.',
    details: [
      'Higher win rate indicates more consistent profitability',
      'Calculated as: (Winning Trades / Total Trades) × 100',
      'Updated after each completed trade'
    ]
  },

  'sharpe-ratio': {
    title: 'Sharpe Ratio',
    content: 'Risk-adjusted return metric that measures return per unit of risk taken.',
    details: [
      'Higher values indicate better risk-adjusted performance',
      'Values above 1.0 are generally considered good',
      'Calculated as: (Return - Risk-free Rate) / Volatility'
    ]
  },

  // Agent Controls Help
  'agent-controls': {
    title: 'Agent Controls',
    content: 'Manual controls to pause, resume, and configure your AI trading agent.',
    details: [
      'Pause: Stops new trade execution but keeps monitoring',
      'Resume: Reactivates trade execution',
      'Settings: Configure strategy and risk parameters'
    ]
  },

  'risk-limits': {
    title: 'Risk Management',
    content: 'Automated safety measures to protect your capital.',
    details: [
      'Position size limits prevent over-exposure',
      'Stop-loss orders limit maximum loss per trade',
      'Cooldown periods prevent overtrading'
    ]
  },

  // Performance Analysis Help
  'performance-chart': {
    title: 'Performance Chart',
    content: 'Visual representation of your agent\'s trading performance over time.',
    details: [
      'Switch between P&L trend and balance history',
      'Adjust timeframe to see different periods',
      'Hover for detailed data points'
    ]
  },

  'asset-allocation': {
    title: 'Asset Allocation',
    content: 'Current distribution of your portfolio across different assets.',
    details: [
      'Shows percentage allocation to each asset',
      'Updated as trades rebalance your portfolio',
      'Hover to see exact percentages'
    ]
  },

  // AI Recommendations Help
  'ai-recommendations': {
    title: 'AI Recommendations',
    content: 'Smart suggestions from your AI agent to optimize performance.',
    details: [
      'Critical: Immediate attention required',
      'High: Important optimizations available',
      'Medium: Beneficial improvements suggested'
    ]
  },

  // Audit Trail Help
  'audit-trail': {
    title: 'Audit Trail',
    content: 'Complete history of all actions taken by your AI agent.',
    details: [
      'Shows trades, rebalancing, and strategy changes',
      'Includes timestamps and execution details',
      'Export data for external analysis'
    ]
  }
};

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  topic,
  variant = 'info',
  size = 'sm',
  className,
  side = 'top'
}) => {
  const help = helpContent[topic];
  
  if (!help) {
    console.warn(`No help content found for topic: ${topic}`);
    return null;
  }

  // Icon mapping
  const iconMap = {
    info: Info,
    help: HelpCircle,
    warning: AlertCircle,
    success: CheckCircle
  };

  // Size mapping
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  // Color mapping
  const colorMap = {
    info: 'text-blue-400 hover:text-blue-300',
    help: 'text-gray-500 hover:text-gray-400',
    warning: 'text-yellow-400 hover:text-yellow-300',
    success: 'text-green-400 hover:text-green-300'
  };

  const IconComponent = iconMap[variant];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              'inline-flex items-center justify-center transition-colors duration-200',
              colorMap[variant],
              className
            )}
            type="button"
          >
            <IconComponent className={sizeMap[size]} />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium text-white">{help.title}</p>
            <p className="text-xs text-gray-300 leading-relaxed">
              {help.content}
            </p>
            {help.details && (
              <div className="space-y-1 pt-2 border-t border-gray-700">
                {help.details.map((detail, index) => (
                  <p key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                    {detail}
                  </p>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Convenience components for common use cases
export const AgentStatusHelp = (props: Omit<ContextualHelpProps, 'topic'>) => (
  <ContextualHelp topic="agent-status" {...props} />
);

export const PerformanceHelp = ({ metric, ...props }: Omit<ContextualHelpProps, 'topic'> & { metric: string }) => (
  <ContextualHelp topic={metric} {...props} />
);

export const ControlsHelp = (props: Omit<ContextualHelpProps, 'topic'>) => (
  <ContextualHelp topic="agent-controls" {...props} />
);

export default ContextualHelp;