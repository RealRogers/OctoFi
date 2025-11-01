/**
 * Layout Optimization Utilities
 * Tools for measuring and preventing Cumulative Layout Shift (CLS)
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// Layout shift measurement
export interface LayoutShiftEntry {
  value: number;
  sources: Array<{
    node: Element;
    previousRect: DOMRect;
    currentRect: DOMRect;
  }>;
  hadRecentInput: boolean;
  lastInputTime: number;
}

// CLS monitoring hook
export const useCLSMonitoring = (
  onShift?: (cls: number, entry: LayoutShiftEntry) => void,
  threshold: number = 0.1
) => {
  const [cls, setCLS] = useState(0);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!('LayoutShift' in window)) {
      console.warn('Layout Shift API not supported');
      return;
    }

    let cumulativeScore = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any as LayoutShiftEntry;
        
        // Only count layout shifts that weren't caused by user input
        if (!layoutShiftEntry.hadRecentInput) {
          cumulativeScore += layoutShiftEntry.value;
          setCLS(cumulativeScore);
          
          if (onShift) {
            onShift(cumulativeScore, layoutShiftEntry);
          }
          
          // Log warnings for significant shifts
          if (process.env.NODE_ENV === 'development' && layoutShiftEntry.value > threshold) {
            console.warn(`Significant layout shift detected: ${layoutShiftEntry.value.toFixed(4)}`, {
              sources: layoutShiftEntry.sources,
              cumulativeScore
            });
          }
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [onShift, threshold]);

  return { cls };
};

// Layout reservation utilities
export const layoutReservation = {
  // Reserve space for dynamic content
  reserveSpace: (width?: number | string, height?: number | string) => ({
    minWidth: width || 'auto',
    minHeight: height || 'auto',
    contain: 'layout' as const
  }),

  // Reserve space for images
  reserveImageSpace: (aspectRatio: number, width?: string) => ({
    width: width || '100%',
    aspectRatio: aspectRatio.toString(),
    backgroundColor: 'transparent',
    contain: 'layout' as const
  }),

  // Reserve space for text content
  reserveTextSpace: (lines: number, lineHeight: number = 1.5) => ({
    minHeight: `${lines * lineHeight}em`,
    contain: 'layout' as const
  })
};

// Skeleton loading with proper space reservation
export const useSkeletonDimensions = (
  actualContent: boolean,
  fallbackDimensions: { width?: number; height?: number }
) => {
  const [dimensions, setDimensions] = useState(fallbackDimensions);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (actualContent && elementRef.current) {
      const { offsetWidth, offsetHeight } = elementRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [actualContent]);

  return { elementRef, dimensions };
};

// Layout shift prevention strategies
export const preventLayoutShift = {
  // Preload critical fonts
  preloadFonts: (fontUrls: string[]) => {
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Set font-display for web fonts
  optimizeFontDisplay: () => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  },

  // Reserve space for ads/widgets
  reserveAdSpace: (selector: string, dimensions: { width: number; height: number }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.minWidth = `${dimensions.width}px`;
      htmlElement.style.minHeight = `${dimensions.height}px`;
      htmlElement.style.contain = 'layout';
    });
  }
};

// Layout stability monitoring
export const useLayoutStability = () => {
  const [isStable, setIsStable] = useState(true);
  const [shiftCount, setShiftCount] = useState(0);
  const stabilityTimeoutRef = useRef<NodeJS.Timeout>();

  const { cls } = useCLSMonitoring((cumulativeCLS, entry) => {
    setShiftCount(prev => prev + 1);
    setIsStable(false);
    
    // Clear existing timeout
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
    }
    
    // Mark as stable after 500ms of no shifts
    stabilityTimeoutRef.current = setTimeout(() => {
      setIsStable(true);
    }, 500);
  });

  useEffect(() => {
    return () => {
      if (stabilityTimeoutRef.current) {
        clearTimeout(stabilityTimeoutRef.current);
      }
    };
  }, []);

  return { isStable, cls, shiftCount };
};

// Dynamic content loading with CLS prevention
export const useCLSPreventedLoading = <T>(
  loadingFunction: () => Promise<T>,
  placeholder: { width?: number; height?: number }
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reserve space immediately
    if (containerRef.current) {
      const container = containerRef.current;
      if (placeholder.width) {
        container.style.minWidth = `${placeholder.width}px`;
      }
      if (placeholder.height) {
        container.style.minHeight = `${placeholder.height}px`;
      }
      container.style.contain = 'layout';
    }

    loadingFunction()
      .then(result => {
        setData(result);
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
        
        // Remove space reservation after content loads
        if (containerRef.current) {
          const container = containerRef.current;
          container.style.minWidth = '';
          container.style.minHeight = '';
          container.style.contain = '';
        }
      });
  }, []);

  return { data, isLoading, error, containerRef };
};

// Layout shift debugging tools
export const layoutShiftDebugger = {
  // Highlight elements causing layout shifts
  highlightShiftingSources: (enable: boolean = true) => {
    if (!enable) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any as LayoutShiftEntry;
        
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.sources) {
          layoutShiftEntry.sources.forEach(source => {
            const element = source.node as HTMLElement;
            if (element && element.style) {
              // Temporarily highlight the element
              const originalOutline = element.style.outline;
              element.style.outline = '3px solid red';
              element.style.outlineOffset = '2px';
              
              setTimeout(() => {
                element.style.outline = originalOutline;
                element.style.outlineOffset = '';
              }, 2000);
            }
          });
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    
    return () => observer.disconnect();
  },

  // Log detailed shift information
  logShiftDetails: () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any as LayoutShiftEntry;
        
        console.group(`Layout Shift: ${layoutShiftEntry.value.toFixed(4)}`);
        console.log('Had recent input:', layoutShiftEntry.hadRecentInput);
        console.log('Sources:', layoutShiftEntry.sources);
        
        layoutShiftEntry.sources?.forEach((source, index) => {
          console.log(`Source ${index + 1}:`, {
            element: source.node,
            previousRect: source.previousRect,
            currentRect: source.currentRect,
            movement: {
              x: source.currentRect.x - source.previousRect.x,
              y: source.currentRect.y - source.previousRect.y,
              width: source.currentRect.width - source.previousRect.width,
              height: source.currentRect.height - source.previousRect.height
            }
          });
        });
        
        console.groupEnd();
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    
    return () => observer.disconnect();
  }
};

// CSS containment utilities
export const containmentUtils = {
  // Apply layout containment to prevent shifts
  applyLayoutContainment: (selector: string) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.contain = 'layout';
    });
  },

  // Apply size containment for fixed-size elements
  applySizeContainment: (selector: string) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.contain = 'size layout';
    });
  },

  // Apply strict containment for isolated components
  applyStrictContainment: (selector: string) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.contain = 'strict';
    });
  }
};

// Performance budget for CLS
export const clsPerformanceBudget = {
  // Set CLS budget and monitor
  setBudget: (budget: number = 0.1) => {
    let currentCLS = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any as LayoutShiftEntry;
        
        if (!layoutShiftEntry.hadRecentInput) {
          currentCLS += layoutShiftEntry.value;
          
          if (currentCLS > budget) {
            console.error(`CLS budget exceeded! Current: ${currentCLS.toFixed(4)}, Budget: ${budget}`);
            
            // Optionally send to analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'cls_budget_exceeded', {
                custom_parameter_1: currentCLS,
                custom_parameter_2: budget
              });
            }
          }
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    
    return () => observer.disconnect();
  }
};

// Initialize CLS monitoring in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Enable shift highlighting and logging
  layoutShiftDebugger.highlightShiftingSources(true);
  layoutShiftDebugger.logShiftDetails();
  
  // Set development budget
  clsPerformanceBudget.setBudget(0.05); // Stricter budget for development
}