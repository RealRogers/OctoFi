/**
 * User Testing Utilities
 * Tools for conducting and measuring user experience tests
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// User testing scenarios
export const USER_TESTING_SCENARIOS = {
  firstGlance: {
    name: 'First Glance Test',
    description: 'Can user identify agent status in <2 seconds?',
    timeLimit: 2000,
    successCriteria: 'User correctly identifies agent status (active/inactive)',
    instructions: 'Look at the dashboard and tell me if the AI agent is currently active or inactive'
  },
  
  criticalAction: {
    name: 'Critical Action Test', 
    description: 'Can user pause agent in <3 seconds?',
    timeLimit: 3000,
    successCriteria: 'User successfully pauses the agent',
    instructions: 'Please pause the AI trading agent as quickly as possible'
  },
  
  informationScent: {
    name: 'Information Scent Test',
    description: 'Can user find specific metric in <5 seconds?',
    timeLimit: 5000,
    successCriteria: 'User locates the requested metric',
    instructions: 'Find the current win rate of your trading agent'
  },
  
  mobileUsability: {
    name: 'Mobile Usability Test',
    description: 'Can user complete key tasks on mobile?',
    timeLimit: 10000,
    successCriteria: 'User completes task on mobile device',
    instructions: 'Using only touch, navigate to agent controls and change the strategy'
  }
} as const;

// User interaction tracking
interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'focus' | 'keypress';
  element: string;
  timestamp: number;
  coordinates?: { x: number; y: number };
  key?: string;
}

// Task completion tracking
interface TaskResult {
  scenarioId: string;
  startTime: number;
  endTime?: number;
  completed: boolean;
  timeToComplete?: number;
  interactions: UserInteraction[];
  errors: string[];
  userFeedback?: string;
}

// Hook for user testing
export const useUserTesting = () => {
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const interactionsRef = useRef<UserInteraction[]>([]);
  const startTimeRef = useRef<number>(0);

  // Start a testing scenario
  const startScenario = useCallback((scenarioId: string) => {
    setCurrentScenario(scenarioId);
    setIsRecording(true);
    startTimeRef.current = performance.now();
    interactionsRef.current = [];
  }, []);

  // Complete a scenario
  const completeScenario = useCallback((success: boolean, userFeedback?: string) => {
    if (!currentScenario) return;

    const endTime = performance.now();
    const timeToComplete = endTime - startTimeRef.current;
    
    const result: TaskResult = {
      scenarioId: currentScenario,
      startTime: startTimeRef.current,
      endTime,
      completed: success,
      timeToComplete,
      interactions: [...interactionsRef.current],
      errors: [], // Would be populated by error tracking
      userFeedback
    };

    setTaskResults(prev => [...prev, result]);
    setCurrentScenario(null);
    setIsRecording(false);
  }, [currentScenario]);

  // Track user interactions
  const trackInteraction = useCallback((interaction: Omit<UserInteraction, 'timestamp'>) => {
    if (!isRecording) return;

    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: performance.now() - startTimeRef.current
    };

    interactionsRef.current.push(fullInteraction);
  }, [isRecording]);

  return {
    currentScenario,
    taskResults,
    isRecording,
    startScenario,
    completeScenario,
    trackInteraction
  };
};

// Interaction tracking utilities
export const interactionTracker = {
  // Track clicks with element identification
  trackClick: (event: MouseEvent, callback: (interaction: UserInteraction) => void) => {
    const element = event.target as HTMLElement;
    const elementDescription = interactionTracker.getElementDescription(element);
    
    callback({
      type: 'click',
      element: elementDescription,
      timestamp: performance.now(),
      coordinates: { x: event.clientX, y: event.clientY }
    });
  },

  // Track scroll behavior
  trackScroll: (callback: (interaction: UserInteraction) => void) => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        callback({
          type: 'scroll',
          element: 'window',
          timestamp: performance.now(),
          coordinates: { x: window.scrollX, y: window.scrollY }
        });
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  },

  // Get descriptive element identifier
  getElementDescription: (element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const textContent = element.textContent?.slice(0, 20) || '';
    
    return `${tagName}${id}${className}${textContent ? ` "${textContent}"` : ''}`;
  }
};

// Task timing utilities
export const taskTimingUtils = {
  // Measure time to first interaction
  measureTimeToFirstInteraction: (callback: (time: number) => void) => {
    const startTime = performance.now();
    let firstInteraction = false;

    const handleFirstInteraction = () => {
      if (firstInteraction) return;
      firstInteraction = true;
      
      const timeToFirst = performance.now() - startTime;
      callback(timeToFirst);
      
      // Remove listeners
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  },

  // Measure task completion time
  measureTaskCompletion: (
    taskName: string,
    successCondition: () => boolean,
    callback: (result: { taskName: string; completed: boolean; time: number }) => void
  ) => {
    const startTime = performance.now();
    let completed = false;

    const checkCompletion = () => {
      if (completed) return;
      
      if (successCondition()) {
        completed = true;
        const completionTime = performance.now() - startTime;
        callback({ taskName, completed: true, time: completionTime });
      }
    };

    // Check periodically
    const interval = setInterval(checkCompletion, 100);

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      if (!completed) {
        callback({ taskName, completed: false, time: 30000 });
      }
      clearInterval(interval);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }
};

// Usability metrics calculation
export const usabilityMetrics = {
  // Calculate task success rate
  calculateSuccessRate: (results: TaskResult[]): number => {
    if (results.length === 0) return 0;
    const successful = results.filter(r => r.completed).length;
    return (successful / results.length) * 100;
  },

  // Calculate average completion time
  calculateAverageTime: (results: TaskResult[]): number => {
    const completedTasks = results.filter(r => r.completed && r.timeToComplete);
    if (completedTasks.length === 0) return 0;
    
    const totalTime = completedTasks.reduce((sum, r) => sum + (r.timeToComplete || 0), 0);
    return totalTime / completedTasks.length;
  },

  // Calculate efficiency score
  calculateEfficiency: (results: TaskResult[]): number => {
    const successRate = usabilityMetrics.calculateSuccessRate(results);
    const avgTime = usabilityMetrics.calculateAverageTime(results);
    
    // Efficiency = Success Rate / (Average Time in seconds)
    return avgTime > 0 ? successRate / (avgTime / 1000) : 0;
  },

  // Analyze interaction patterns
  analyzeInteractionPatterns: (results: TaskResult[]) => {
    const allInteractions = results.flatMap(r => r.interactions);
    
    const interactionTypes = allInteractions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostClickedElements = allInteractions
      .filter(i => i.type === 'click')
      .reduce((acc, interaction) => {
        acc[interaction.element] = (acc[interaction.element] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalInteractions: allInteractions.length,
      interactionTypes,
      mostClickedElements,
      averageInteractionsPerTask: allInteractions.length / results.length
    };
  }
};

// A/B testing utilities
export const abTestingUtils = {
  // Simple A/B test implementation
  createABTest: (testName: string, variants: string[]) => {
    const userId = localStorage.getItem('userId') || Math.random().toString(36);
    localStorage.setItem('userId', userId);
    
    // Simple hash-based assignment
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variantIndex = Math.abs(hash) % variants.length;
    const assignedVariant = variants[variantIndex];
    
    // Store assignment
    const testKey = `ab_test_${testName}`;
    localStorage.setItem(testKey, assignedVariant);
    
    return assignedVariant;
  },

  // Track A/B test results
  trackABTestResult: (testName: string, metric: string, value: number) => {
    const variant = localStorage.getItem(`ab_test_${testName}`);
    if (!variant) return;

    const results = JSON.parse(localStorage.getItem('ab_test_results') || '{}');
    
    if (!results[testName]) {
      results[testName] = {};
    }
    
    if (!results[testName][variant]) {
      results[testName][variant] = {};
    }
    
    if (!results[testName][variant][metric]) {
      results[testName][variant][metric] = [];
    }
    
    results[testName][variant][metric].push({
      value,
      timestamp: Date.now()
    });
    
    localStorage.setItem('ab_test_results', JSON.stringify(results));
  }
};

// Accessibility testing helpers
export const accessibilityTestUtils = {
  // Test keyboard navigation
  testKeyboardNavigation: async (
    startElement: HTMLElement,
    expectedPath: string[]
  ): Promise<{ success: boolean; actualPath: string[] }> => {
    const actualPath: string[] = [];
    let currentElement = startElement;
    
    // Focus the start element
    currentElement.focus();
    actualPath.push(interactionTracker.getElementDescription(currentElement));
    
    // Simulate tab navigation
    for (let i = 1; i < expectedPath.length; i++) {
      // Simulate tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      currentElement.dispatchEvent(tabEvent);
      
      // Find next focusable element
      const focusableElements = document.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );
      
      const currentIndex = Array.from(focusableElements).indexOf(currentElement);
      const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
      
      if (nextElement) {
        nextElement.focus();
        currentElement = nextElement;
        actualPath.push(interactionTracker.getElementDescription(currentElement));
      }
    }
    
    return {
      success: JSON.stringify(actualPath) === JSON.stringify(expectedPath),
      actualPath
    };
  },

  // Test screen reader announcements
  testScreenReaderAnnouncements: (
    action: () => void,
    expectedAnnouncement: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      let announced = false;
      
      // Listen for aria-live region updates
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const target = mutation.target as HTMLElement;
            if (target.getAttribute('aria-live')) {
              const content = target.textContent || '';
              if (content.includes(expectedAnnouncement)) {
                announced = true;
                observer.disconnect();
                resolve(true);
              }
            }
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      // Perform the action
      action();
      
      // Timeout after 2 seconds
      setTimeout(() => {
        if (!announced) {
          observer.disconnect();
          resolve(false);
        }
      }, 2000);
    });
  }
};

// User feedback collection
export const feedbackUtils = {
  // Collect task feedback
  collectTaskFeedback: (
    taskName: string,
    questions: Array<{ id: string; question: string; type: 'rating' | 'text' }>
  ): Promise<Record<string, any>> => {
    return new Promise((resolve) => {
      // This would typically show a modal or form
      // For now, we'll simulate with console prompts
      const feedback: Record<string, any> = {};
      
      questions.forEach(({ id, question, type }) => {
        if (type === 'rating') {
          // Simulate rating collection (1-5)
          feedback[id] = Math.floor(Math.random() * 5) + 1;
        } else {
          // Simulate text feedback
          feedback[id] = `Sample feedback for ${question}`;
        }
      });
      
      resolve(feedback);
    });
  },

  // Calculate satisfaction scores
  calculateSatisfactionScore: (feedbackData: Array<{ rating: number }>): number => {
    if (feedbackData.length === 0) return 0;
    
    const totalRating = feedbackData.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / feedbackData.length / 5) * 100; // Convert to percentage
  }
};

// Automated testing scenarios
export const automatedTestScenarios = {
  // Run first glance test
  runFirstGlanceTest: async (): Promise<TaskResult> => {
    const scenario = USER_TESTING_SCENARIOS.firstGlance;
    const startTime = performance.now();
    
    // Check if agent status is visible and identifiable
    const statusElements = document.querySelectorAll('[data-testid="agent-status"], .agent-status, [aria-label*="status"]');
    const hasVisibleStatus = Array.from(statusElements).some(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    
    const endTime = performance.now();
    const timeToComplete = endTime - startTime;
    
    return {
      scenarioId: 'firstGlance',
      startTime,
      endTime,
      completed: hasVisibleStatus && timeToComplete < scenario.timeLimit,
      timeToComplete,
      interactions: [],
      errors: hasVisibleStatus ? [] : ['Agent status not clearly visible']
    };
  },

  // Run critical action test
  runCriticalActionTest: async (): Promise<TaskResult> => {
    const scenario = USER_TESTING_SCENARIOS.criticalAction;
    const startTime = performance.now();
    
    // Look for pause/resume buttons
    const actionButtons = document.querySelectorAll(
      'button[aria-label*="pause"], button[aria-label*="stop"], [data-testid="pause-button"]'
    );
    
    const hasAccessiblePauseButton = Array.from(actionButtons).some(button => {
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && !button.hasAttribute('disabled');
    });
    
    const endTime = performance.now();
    const timeToComplete = endTime - startTime;
    
    return {
      scenarioId: 'criticalAction',
      startTime,
      endTime,
      completed: hasAccessiblePauseButton && timeToComplete < scenario.timeLimit,
      timeToComplete,
      interactions: [],
      errors: hasAccessiblePauseButton ? [] : ['Pause button not easily accessible']
    };
  }
};

// Initialize user testing in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Add testing utilities to window for manual testing
  (window as any).userTesting = {
    scenarios: USER_TESTING_SCENARIOS,
    runFirstGlanceTest: automatedTestScenarios.runFirstGlanceTest,
    runCriticalActionTest: automatedTestScenarios.runCriticalActionTest
  };
}