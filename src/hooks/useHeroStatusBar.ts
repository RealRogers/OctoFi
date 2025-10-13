import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseHeroStatusBarProps {
  isActive: boolean;
  canExecuteTrades: boolean;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onSettings: () => void;
}

export const useHeroStatusBar = ({
  isActive,
  canExecuteTrades,
  onPause,
  onResume,
  onSettings
}: UseHeroStatusBarProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePause = useCallback(async () => {
    if (!canExecuteTrades || !isActive) return;
    
    setIsLoading(true);
    try {
      await onPause();
      toast({
        title: "⏸️ Agent Paused",
        description: "AI trading agent has been paused successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Failed to Pause",
        description: "Could not pause the AI trading agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [canExecuteTrades, isActive, onPause, toast]);

  const handleResume = useCallback(async () => {
    if (!canExecuteTrades || isActive) return;
    
    setIsLoading(true);
    try {
      await onResume();
      toast({
        title: "🚀 Agent Activated",
        description: "AI trading agent is now active and monitoring markets",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Failed to Resume",
        description: "Could not resume the AI trading agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [canExecuteTrades, isActive, onResume, toast]);

  const handleSettings = useCallback(() => {
    onSettings();
  }, [onSettings]);

  // Calculate uptime for tooltip
  const uptimeInfo = useMemo(() => {
    if (!isActive) return null;
    
    // This would normally come from the trading agent service
    // For now, we'll simulate some uptime data
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 6); // 6 hours ago
    
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      uptime: `${hours}h ${minutes}m`,
      tradesToday: Math.floor(Math.random() * 15) + 5, // 5-20 trades
      lastCheck: 'Just now'
    };
  }, [isActive]);

  return {
    isLoading,
    handlePause,
    handleResume,
    handleSettings,
    uptimeInfo
  };
};