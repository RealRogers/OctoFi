import React from 'react';
import { Bot, Shield, TrendingUp, Activity, Settings, Pause, Play, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useHeroStatusBar } from '@/hooks/useHeroStatusBar';

interface HeroStatusBarProps {
  // Agent status
  isActive: boolean;
  canExecuteTrades: boolean;
  strategy?: {
    riskTolerance: string;
  };
  
  // Performance metrics
  totalProfitLoss: number;
  winRate: number;
  change24h: number;
  
  // Last action info
  lastAction?: {
    type: string;
    timestamp: Date;
  };
  
  // Actions
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onSettings: () => void;
  
  // Optional props
  className?: string;
}

const HeroStatusBar: React.FC<HeroStatusBarProps> = ({
  isActive,
  canExecuteTrades,
  strategy,
  totalProfitLoss,
  winRate,
  change24h,
  lastAction,
  onPause,
  onResume,
  onSettings,
  className
}) => {
  const { 
    isLoading, 
    handlePause, 
    handleResume, 
    handleSettings, 
    uptimeInfo 
  } = useHeroStatusBar({
    isActive,
    canExecuteTrades,
    onPause,
    onResume,
    onSettings
  });
  const getStatusColor = () => {
    if (!canExecuteTrades) return 'text-gray-400';
    return isActive ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusText = () => {
    if (!canExecuteTrades) return 'Inactive';
    return isActive ? 'Active & Trading' : 'Ready';
  };

  const getStatusIndicatorClass = () => {
    if (!canExecuteTrades) return 'bg-gray-400';
    return isActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400';
  };

  const formatLastAction = () => {
    if (!lastAction) return 'No recent activity';
    
    const now = new Date();
    const diff = now.getTime() - lastAction.timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    let timeAgo = '';
    if (days > 0) {
      timeAgo = `${days}d ago`;
    } else if (hours > 0) {
      timeAgo = `${hours}h ago`;
    } else if (minutes > 0) {
      timeAgo = `${minutes}m ago`;
    } else {
      timeAgo = 'Just now';
    }
    
    return `${lastAction.type} • ${timeAgo}`;
  };

  const getProfitLossColor = () => {
    return totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChange24hColor = () => {
    return change24h >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChange24hIcon = () => {
    return change24h >= 0 ? '↗' : '↘';
  };

  return (
    <TooltipProvider>
      {/* 
        Hero Status Bar Layout Structure
        
        This component uses a 3-section horizontal layout:
        1. Left: Agent status with visual indicator and details
        2. Center: Quick action buttons (pause/resume, settings)
        3. Right: Key metrics (P&L, Win Rate, 24h Change)
        
        Layout Strategy:
        - justify-between: Pushes sections to edges with center spacing
        - Fixed height (120px): Ensures consistent above-fold experience
        - z-index layering: Content above gradient overlay
        - Responsive: Stacks vertically on mobile with text-center
        
        The glassmorphism effect is achieved through:
        - Semi-transparent background with backdrop-filter blur
        - Subtle gradient overlays for depth
        - Border highlights for definition
      */}
      <div className={cn(
        "zone-hero glass-card relative overflow-hidden",
        "flex items-center justify-between",
        "min-h-[120px] max-h-[120px]",
        "px-8 py-6",
        className
      )}>
        {/* Gradient overlay for glassmorphism depth effect */}
        <div className="gradient-overlay" />
        
        {/* 
          Left Section: Agent Status Information
          
          Visual Hierarchy:
          1. Status indicator (pulsing dot) - Immediate visual feedback
          2. Status text (large, colored) - Primary information
          3. Strategy badge - Context about current mode
          4. Last action timestamp - Recent activity indicator
          
          The status indicator uses a dual-layer approach:
          - Base dot: Solid color indicating current state
          - Ping animation: Subtle pulsing for active state
          This creates clear visual feedback without being distracting.
        */}
        <div className="flex items-center gap-6 z-10">
          <div className="flex items-center gap-4">
            {/* 
              Status Indicator: Dual-layer design for clear state communication
              - Base layer: Solid colored dot (green=active, yellow=ready, gray=inactive)
              - Animation layer: Pulsing ring for active state only
              - Relative positioning allows overlay without layout shift
            */}
            <div className="relative">
              <div className={cn(
                "w-4 h-4 rounded-full",
                getStatusIndicatorClass()
              )} />
              {isActive && (
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-30" />
              )}
            </div>
            
            {/* Status Text and Details */}
            <div className="flex flex-col">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <span className={cn(
                      "text-2xl font-bold",
                      getStatusColor()
                    )}>
                      {getStatusText()}
                    </span>
                    <Info className="w-4 h-4 text-gray-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Agent Status Details</p>
                    <p className="text-xs">
                      {isActive 
                        ? "Your AI agent is actively monitoring markets and executing trades based on your strategy."
                        : canExecuteTrades 
                        ? "Your AI agent is ready to trade but currently paused."
                        : "Your AI agent is inactive. Check your configuration."
                      }
                    </p>
                    {isActive && uptimeInfo && (
                      <div className="text-xs text-green-400 space-y-1">
                        <p>• Uptime: {uptimeInfo.uptime}</p>
                        <p>• Trades today: {uptimeInfo.tradesToday}</p>
                        <p>• Last check: {uptimeInfo.lastCheck}</p>
                        <p>• Strategy: {strategy?.riskTolerance || 'default'}</p>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
              
              {/* Strategy and Last Action */}
              <div className="flex items-center gap-4 mt-1">
                {strategy?.riskTolerance && (
                  <Badge variant="secondary" className="capitalize">
                    <Shield className="w-3 h-3 mr-1" />
                    {strategy.riskTolerance} Strategy
                  </Badge>
                )}
                <span className="text-sm text-gray-400">
                  {formatLastAction()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Quick Actions */}
        <div className="flex items-center gap-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={isActive ? handlePause : handleResume}
                disabled={isLoading || !canExecuteTrades}
                className="flex items-center gap-2 glass-card-hover transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">
                      {isActive ? 'Pausing...' : 'Resuming...'}
                    </span>
                  </>
                ) : isActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Resume</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isActive ? 'Pause agent trading' : 'Resume agent trading'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettings}
                className="glass-card-hover transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure agent settings</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right Section: Key Metrics */}
        <div className="flex items-center gap-8 z-10">
          {/* Total P&L */}
          <div className="text-right">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Total P&L</span>
                  </div>
                  <AnimatedNumber
                    value={totalProfitLoss}
                    decimals={2}
                    prefix="$"
                    className={cn(
                      "text-3xl font-bold",
                      getProfitLossColor()
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  Total profit and loss from all agent-executed trades since inception
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Win Rate */}
          <div className="text-right">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Win Rate</span>
                  </div>
                  <AnimatedNumber
                    value={winRate}
                    decimals={1}
                    suffix="%"
                    className="text-3xl font-bold text-white"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  Percentage of profitable trades vs total trades executed by the agent
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 24h Change */}
          <div className="text-right">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <span className="text-sm text-gray-400">24h Change</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <AnimatedNumber
                      value={Math.abs(change24h)}
                      decimals={1}
                      suffix="%"
                      className={cn(
                        "text-xl font-semibold",
                        getChange24hColor()
                      )}
                    />
                    <span className={cn(
                      "text-xl font-semibold",
                      getChange24hColor()
                    )}>
                      {getChange24hIcon()}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  Portfolio performance change in the last 24 hours
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile Responsive Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 pointer-events-none md:hidden" />
      </div>
    </TooltipProvider>
  );
};

export default HeroStatusBar;