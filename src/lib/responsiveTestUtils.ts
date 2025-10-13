/**
 * Responsive Testing Utilities
 * Tools for testing responsive behavior and breakpoint transitions
 */

import { useEffect, useState, useCallback } from 'react';
import { designTokens } from './designTokens';

// Common viewport sizes for testing
export const VIEWPORT_SIZES = {
  // Mobile devices
  mobile: {
    'iPhone SE': { width: 375, height: 667 },
    'iPhone 12': { width: 390, height: 844 },
    'iPhone 12 Pro Max': { width: 428, height: 926 },
    'Samsung Galaxy S21': { width: 384, height: 854 },
    'Samsung Galaxy A51': { width: 412, height: 914 }
  },
  
  // Tablet devices
  tablet: {
    'iPad Mini': { width: 768, height: 1024 },
    'iPad Air': { width: 820, height: 1180 },
    'iPad Pro 11"': { width: 834, height: 1194 },
    'iPad Pro 12.9"': { width: 1024, height: 1366 },
    'Surface Pro': { width: 912, height: 1368 }
  },
  
  // Desktop sizes
  desktop: {
    'Laptop Small': { width: 1280, height: 720 },
    'Laptop Medium': { width: 1366, height: 768 },
    'Desktop HD': { width: 1920, height: 1080 },
    'Desktop QHD': { width: 2560, height: 1440 },
    'Desktop 4K': { width: 3840, height: 2160 }
  },
  
  // Edge cases
  edge: {
    'Very Narrow': { width: 320, height: 568 },
    'Very Wide': { width: 3440, height: 1440 },
    'Square': { width: 1024, height: 1024 },
    'Portrait Desktop': { width: 1080, height: 1920 }
  }
} as const;

// Breakpoint testing utilities
export const breakpointTestUtils = {
  // Get current breakpoint
  getCurrentBreakpoint: (width: number): 'mobile' | 'tablet' | 'desktop' => {
    if (width < designTokens.breakpoints.mobile) return 'mobile';
    if (width < designTokens.breakpoints.tablet) return 'tablet';
    return 'desktop';
  },
  
  // Test breakpoint transitions
  testBreakpointTransition: (
    fromWidth: number, 
    toWidth: number, 
    callback: (from: string, to: string) => void
  ) => {
    const fromBreakpoint = breakpointTestUtils.getCurrentBreakpoint(fromWidth);
    const toBreakpoint = breakpointTestUtils.getCurrentBreakpoint(toWidth);
    
    if (fromBreakpoint !== toBreakpoint) {
      callback(fromBreakpoint, toBreakpoint);
    }
  },
  
  // Get critical breakpoint boundaries
  getCriticalWidths: () => [
    designTokens.breakpoints.mobile - 1, // 767px
    designTokens.breakpoints.mobile,     // 768px
    designTokens.breakpoints.mobile + 1, // 769px
    designTokens.breakpoints.tablet - 1, // 1279px
    designTokens.breakpoints.tablet,     // 1280px
    designTokens.breakpoints.tablet + 1  // 1281px
  ]
};

// Hook for responsive testing
export const useResponsiveTesting = () => {
  const [currentViewport, setCurrentViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  
  const [breakpointHistory, setBreakpointHistory] = useState<Array<{
    breakpoint: string;
    width: number;
    timestamp: number;
  }>>([]);

  const updateViewport = useCallback((width: number, height: number) => {
    const previousBreakpoint = breakpointTestUtils.getCurrentBreakpoint(currentViewport.width);
    const newBreakpoint = breakpointTestUtils.getCurrentBreakpoint(width);
    
    setCurrentViewport({ width, height });
    
    // Track breakpoint changes
    if (previousBreakpoint !== newBreakpoint) {
      setBreakpointHistory(prev => [...prev, {
        breakpoint: newBreakpoint,
        width,
        timestamp: Date.now()
      }].slice(-10)); // Keep last 10 changes
    }
  }, [currentViewport.width]);

  useEffect(() => {
    const handleResize = () => {
      updateViewport(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateViewport]);

  return {
    currentViewport,
    currentBreakpoint: breakpointTestUtils.getCurrentBreakpoint(currentViewport.width),
    breakpointHistory,
    updateViewport
  };
};

// Layout testing utilities
export const layoutTestUtils = {
  // Test grid layout at different sizes
  testGridLayout: (containerElement: HTMLElement) => {
    const results: Array<{
      width: number;
      breakpoint: string;
      gridColumns: string;
      gridGap: string;
    }> = [];
    
    breakpointTestUtils.getCriticalWidths().forEach(width => {
      // Simulate viewport width
      const breakpoint = breakpointTestUtils.getCurrentBreakpoint(width);
      const computedStyle = window.getComputedStyle(containerElement);
      
      results.push({
        width,
        breakpoint,
        gridColumns: computedStyle.gridTemplateColumns,
        gridGap: computedStyle.gap
      });
    });
    
    return results;
  },
  
  // Test element visibility at different sizes
  testElementVisibility: (element: HTMLElement, testWidths: number[]) => {
    const results: Array<{
      width: number;
      visible: boolean;
      display: string;
      opacity: string;
    }> = [];
    
    testWidths.forEach(width => {
      // This would need to be implemented with actual viewport changes
      // For now, we'll check computed styles
      const computedStyle = window.getComputedStyle(element);
      
      results.push({
        width,
        visible: computedStyle.display !== 'none' && computedStyle.opacity !== '0',
        display: computedStyle.display,
        opacity: computedStyle.opacity
      });
    });
    
    return results;
  },
  
  // Test text overflow and truncation
  testTextOverflow: (element: HTMLElement) => {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
    
    return {
      hasHorizontalOverflow: scrollWidth > clientWidth,
      hasVerticalOverflow: scrollHeight > clientHeight,
      overflowRatio: {
        horizontal: scrollWidth / clientWidth,
        vertical: scrollHeight / clientHeight
      }
    };
  }
};

// Performance testing for responsive changes
export const responsivePerformanceUtils = {
  // Measure layout shift during resize
  measureResizeLayoutShift: (callback: (cls: number) => void) => {
    let observer: PerformanceObserver | null = null;
    
    if ('LayoutShift' in window) {
      let cumulativeShift = 0;
      
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            cumulativeShift += layoutShiftEntry.value;
          }
        }
        callback(cumulativeShift);
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  },
  
  // Measure render time during breakpoint changes
  measureBreakpointRenderTime: (
    element: HTMLElement,
    callback: (renderTime: number) => void
  ) => {
    const observer = new MutationObserver(() => {
      const start = performance.now();
      
      requestAnimationFrame(() => {
        const end = performance.now();
        callback(end - start);
      });
    });
    
    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }
};

// Automated responsive testing
export const automatedResponsiveTests = {
  // Test all viewport sizes
  testAllViewports: async (
    testCallback: (viewport: { width: number; height: number }) => Promise<void>
  ) => {
    const allViewports = [
      ...Object.values(VIEWPORT_SIZES.mobile),
      ...Object.values(VIEWPORT_SIZES.tablet),
      ...Object.values(VIEWPORT_SIZES.desktop),
      ...Object.values(VIEWPORT_SIZES.edge)
    ];
    
    const results = [];
    
    for (const viewport of allViewports) {
      try {
        await testCallback(viewport);
        results.push({ viewport, success: true });
      } catch (error) {
        results.push({ viewport, success: false, error });
      }
    }
    
    return results;
  },
  
  // Test critical breakpoint boundaries
  testBreakpointBoundaries: (
    testCallback: (width: number) => boolean
  ) => {
    const criticalWidths = breakpointTestUtils.getCriticalWidths();
    const results: Array<{
      width: number;
      breakpoint: string;
      passed: boolean;
    }> = [];
    
    criticalWidths.forEach(width => {
      const breakpoint = breakpointTestUtils.getCurrentBreakpoint(width);
      const passed = testCallback(width);
      
      results.push({ width, breakpoint, passed });
    });
    
    return results;
  },
  
  // Test layout consistency across sizes
  testLayoutConsistency: (element: HTMLElement) => {
    const results: Array<{
      width: number;
      height: number;
      hasOverflow: boolean;
      aspectRatio: number;
    }> = [];
    
    Object.values(VIEWPORT_SIZES.desktop).forEach(viewport => {
      // This would need actual viewport simulation
      const rect = element.getBoundingClientRect();
      
      results.push({
        width: rect.width,
        height: rect.height,
        hasOverflow: element.scrollWidth > element.clientWidth || 
                     element.scrollHeight > element.clientHeight,
        aspectRatio: rect.width / rect.height
      });
    });
    
    return results;
  }
};

// Visual regression testing helpers
export const visualRegressionUtils = {
  // Capture element screenshot at different sizes
  captureElementAtSizes: async (
    element: HTMLElement,
    sizes: Array<{ width: number; height: number }>
  ) => {
    const screenshots = [];
    
    for (const size of sizes) {
      // This would integrate with a screenshot library
      // For now, we'll return element dimensions and styles
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      screenshots.push({
        size,
        elementRect: rect,
        styles: {
          display: computedStyle.display,
          gridTemplateColumns: computedStyle.gridTemplateColumns,
          gap: computedStyle.gap,
          flexDirection: computedStyle.flexDirection
        }
      });
    }
    
    return screenshots;
  },
  
  // Compare layouts between sizes
  compareLayouts: (
    baseline: any,
    current: any,
    tolerance: number = 0.1
  ) => {
    const differences = [];
    
    // Compare dimensions
    if (Math.abs(baseline.width - current.width) > tolerance) {
      differences.push(`Width difference: ${baseline.width} vs ${current.width}`);
    }
    
    if (Math.abs(baseline.height - current.height) > tolerance) {
      differences.push(`Height difference: ${baseline.height} vs ${current.height}`);
    }
    
    return {
      passed: differences.length === 0,
      differences
    };
  }
};

// Development testing utilities
export const devTestingUtils = {
  // Log responsive behavior
  logResponsiveBehavior: (element: HTMLElement) => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const breakpoint = breakpointTestUtils.getCurrentBreakpoint(width);
        
        console.log(`Responsive Change:`, {
          width,
          height,
          breakpoint,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    observer.observe(element);
    
    return () => observer.disconnect();
  },
  
  // Create responsive testing overlay
  createTestingOverlay: () => {
    if (typeof document === 'undefined') return;
    
    const overlay = document.createElement('div');
    overlay.id = 'responsive-testing-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      pointer-events: none;
    `;
    
    const updateOverlay = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = breakpointTestUtils.getCurrentBreakpoint(width);
      
      overlay.innerHTML = `
        <div>Viewport: ${width} × ${height}</div>
        <div>Breakpoint: ${breakpoint}</div>
        <div>Ratio: ${(width / height).toFixed(2)}</div>
      `;
    };
    
    updateOverlay();
    window.addEventListener('resize', updateOverlay);
    document.body.appendChild(overlay);
    
    return () => {
      window.removeEventListener('resize', updateOverlay);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }
};

// Initialize development tools
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Auto-create testing overlay
  devTestingUtils.createTestingOverlay();
}