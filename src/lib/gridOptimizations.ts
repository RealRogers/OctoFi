/**
 * Grid Optimization Utilities
 * Memoized calculations and optimized responsive grid handling
 */

import { useMemo, useCallback, useRef } from 'react';
import { designTokens } from './designTokens';

// Breakpoint detection with memoization
const breakpointCache = new Map<number, string>();

export const getBreakpoint = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  const cacheKey = Math.floor(width / 10) * 10; // Cache in 10px increments
  
  if (breakpointCache.has(cacheKey)) {
    return breakpointCache.get(cacheKey) as 'mobile' | 'tablet' | 'desktop';
  }

  let breakpoint: 'mobile' | 'tablet' | 'desktop';
  
  if (width < designTokens.breakpoints.mobile) {
    breakpoint = 'mobile';
  } else if (width < designTokens.breakpoints.tablet) {
    breakpoint = 'tablet';
  } else {
    breakpoint = 'desktop';
  }

  breakpointCache.set(cacheKey, breakpoint);
  return breakpoint;
};

// Grid template string cache
const gridTemplateCache = new Map<string, string>();

export const getGridTemplate = (breakpoint: 'mobile' | 'tablet' | 'desktop'): string => {
  if (gridTemplateCache.has(breakpoint)) {
    return gridTemplateCache.get(breakpoint)!;
  }

  const template = designTokens.grid[breakpoint].columnTemplate;
  gridTemplateCache.set(breakpoint, template);
  return template;
};

// Optimized grid areas calculation
interface GridAreas {
  hero: string;
  performance: string;
  aiLayer: string;
  controls: string;
  trail: string;
  insights: string;
  analytics: string;
}

const gridAreasCache = new Map<string, GridAreas>();

export const getGridAreas = (breakpoint: 'mobile' | 'tablet' | 'desktop'): GridAreas => {
  if (gridAreasCache.has(breakpoint)) {
    return gridAreasCache.get(breakpoint)!;
  }

  let areas: GridAreas;

  switch (breakpoint) {
    case 'desktop':
      areas = {
        hero: 'hero hero hero',
        performance: 'performance performance performance',
        aiLayer: 'ai-layer ai-layer ai-layer',
        controls: 'controls trail insights',
        trail: 'controls trail insights',
        insights: 'controls trail insights',
        analytics: 'analytics analytics analytics'
      };
      break;
    
    case 'tablet':
      areas = {
        hero: 'hero hero',
        performance: 'performance performance',
        aiLayer: 'ai-layer ai-layer',
        controls: 'controls controls',
        trail: 'trail insights',
        insights: 'trail insights',
        analytics: 'analytics analytics'
      };
      break;
    
    case 'mobile':
      areas = {
        hero: 'hero',
        performance: 'performance',
        aiLayer: 'ai-layer',
        controls: 'controls-tabs',
        trail: 'controls-tabs',
        insights: 'controls-tabs',
        analytics: 'analytics'
      };
      break;
  }

  gridAreasCache.set(breakpoint, areas);
  return areas;
};

// Debounced resize handler
export const createDebouncedResizeHandler = (
  callback: (width: number, height: number) => void,
  delay: number = 150
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (width: number, height: number) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(width, height), delay);
  };
};

// Hook for optimized responsive grid
export const useOptimizedGrid = () => {
  const currentBreakpointRef = useRef<'mobile' | 'tablet' | 'desktop'>('desktop');
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  const getGridConfig = useCallback((width: number) => {
    const breakpoint = getBreakpoint(width);
    
    // Only recalculate if breakpoint actually changed
    if (currentBreakpointRef.current === breakpoint) {
      return {
        breakpoint,
        template: getGridTemplate(breakpoint),
        areas: getGridAreas(breakpoint),
        gap: designTokens.grid[breakpoint].gap
      };
    }

    currentBreakpointRef.current = breakpoint;
    
    return {
      breakpoint,
      template: getGridTemplate(breakpoint),
      areas: getGridAreas(breakpoint),
      gap: designTokens.grid[breakpoint].gap
    };
  }, []);

  const debouncedResize = useCallback(
    createDebouncedResizeHandler((width: number) => {
      getGridConfig(width);
    }),
    []
  );

  return {
    getGridConfig,
    debouncedResize
  };
};

// Memoized CSS custom properties generator
const cssPropsCache = new Map<string, Record<string, string>>();

export const getGridCSSProperties = (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
  const cacheKey = `grid-${breakpoint}`;
  
  if (cssPropsCache.has(cacheKey)) {
    return cssPropsCache.get(cacheKey)!;
  }

  const config = designTokens.grid[breakpoint];
  const areas = getGridAreas(breakpoint);
  
  const cssProps = {
    '--grid-template-columns': config.columnTemplate,
    '--grid-gap': config.gap,
    '--grid-area-hero': areas.hero,
    '--grid-area-performance': areas.performance,
    '--grid-area-ai-layer': areas.aiLayer,
    '--grid-area-controls': areas.controls,
    '--grid-area-trail': areas.trail,
    '--grid-area-insights': areas.insights,
    '--grid-area-analytics': areas.analytics
  };

  cssPropsCache.set(cacheKey, cssProps);
  return cssProps;
};

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure layout shift
  measureLayoutShift: (callback: (cls: number) => void) => {
    if ('LayoutShift' in window) {
      const observer = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        callback(cls);
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      return () => observer.disconnect();
    }
    return () => {};
  },

  // Measure animation frame rate
  measureFPS: (callback: (fps: number) => void) => {
    let frames = 0;
    let lastTime = performance.now();
    
    const measureFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        callback(fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  },

  // Measure component render time
  measureRenderTime: <T extends any[]>(
    fn: (...args: T) => void,
    name: string
  ) => {
    return (...args: T) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name} render time: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    };
  }
};

// Cache management
export const cacheManager = {
  // Clear all caches
  clearAll: () => {
    breakpointCache.clear();
    gridTemplateCache.clear();
    gridAreasCache.clear();
    cssPropsCache.clear();
  },

  // Get cache stats
  getStats: () => ({
    breakpoint: breakpointCache.size,
    gridTemplate: gridTemplateCache.size,
    gridAreas: gridAreasCache.size,
    cssProps: cssPropsCache.size
  }),

  // Preload common breakpoints
  preload: () => {
    // Preload common viewport sizes
    const commonSizes = [320, 768, 1024, 1280, 1440, 1920];
    commonSizes.forEach(width => {
      const breakpoint = getBreakpoint(width);
      getGridTemplate(breakpoint);
      getGridAreas(breakpoint);
      getGridCSSProperties(breakpoint);
    });
  }
};

// Initialize cache preloading
if (typeof window !== 'undefined') {
  // Preload on next tick to avoid blocking initial render
  setTimeout(() => {
    cacheManager.preload();
  }, 0);
}