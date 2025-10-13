import { useState, useCallback } from 'react';

interface UseContextualHelpOptions {
  enableTour?: boolean;
  autoShow?: boolean;
}

export const useContextualHelp = (options: UseContextualHelpOptions = {}) => {
  const { enableTour = false, autoShow = false } = options;
  
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [hasSeenHelp, setHasSeenHelp] = useState<Record<string, boolean>>({});

  // Toggle help mode (shows all help indicators)
  const toggleHelpMode = useCallback(() => {
    setIsHelpMode(prev => !prev);
  }, []);

  // Mark help topic as seen
  const markHelpSeen = useCallback((topic: string) => {
    setHasSeenHelp(prev => ({ ...prev, [topic]: true }));
  }, []);

  // Check if help should be shown for a topic
  const shouldShowHelp = useCallback((topic: string) => {
    if (isHelpMode) return true;
    if (autoShow && !hasSeenHelp[topic]) return true;
    return false;
  }, [isHelpMode, autoShow, hasSeenHelp]);

  // Tour functionality
  const tourSteps = [
    { topic: 'agent-status', selector: '[data-help="agent-status"]' },
    { topic: 'profit-loss', selector: '[data-help="profit-loss"]' },
    { topic: 'performance-chart', selector: '[data-help="performance-chart"]' },
    { topic: 'agent-controls', selector: '[data-help="agent-controls"]' },
  ];

  const startTour = useCallback(() => {
    setCurrentTourStep(0);
    setIsHelpMode(true);
  }, []);

  const nextTourStep = useCallback(() => {
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      // End tour
      setCurrentTourStep(0);
      setIsHelpMode(false);
    }
  }, [currentTourStep, tourSteps.length]);

  const skipTour = useCallback(() => {
    setCurrentTourStep(0);
    setIsHelpMode(false);
  }, []);

  // Get current tour step info
  const getCurrentTourStep = useCallback(() => {
    if (!enableTour || currentTourStep >= tourSteps.length) return null;
    return tourSteps[currentTourStep];
  }, [enableTour, currentTourStep, tourSteps]);

  return {
    isHelpMode,
    toggleHelpMode,
    shouldShowHelp,
    markHelpSeen,
    
    // Tour functionality
    startTour,
    nextTourStep,
    skipTour,
    getCurrentTourStep,
    currentTourStep,
    totalTourSteps: tourSteps.length,
  };
};