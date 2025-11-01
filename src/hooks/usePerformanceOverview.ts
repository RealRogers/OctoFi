import { useState, useCallback, useMemo } from 'react';

interface UsePerformanceOverviewProps {
  onTimeframeChange: (timeframe: '24h' | '7d' | '30d' | 'all') => void;
}

export const usePerformanceOverview = ({ onTimeframeChange }: UsePerformanceOverviewProps) => {
  const [isTimeframeChanging, setIsTimeframeChanging] = useState(false);

  const handleTimeframeChange = useCallback(async (newTimeframe: '24h' | '7d' | '30d' | 'all') => {
    setIsTimeframeChanging(true);
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      onTimeframeChange(newTimeframe);
      setIsTimeframeChanging(false);
    }, 200);
  }, [onTimeframeChange]);

  // Generate skeleton data for loading state
  const skeletonData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      time: `Day ${i + 1}`,
      profitLoss: 0,
      balance: 10000,
      trades: 0,
      winRate: 0
    }));
  }, []);

  return {
    isTimeframeChanging,
    handleTimeframeChange,
    skeletonData
  };
};