/**
 * Animation Optimization Utilities
 * Performance-optimized animation helpers and hooks
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Animation performance settings
export const animationConfig = {
  // Reduced motion detection
  prefersReducedMotion: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,

  // Performance-optimized spring configs
  springs: {
    gentle: { stiffness: 120, damping: 14, mass: 0.27 },
    wobbly: { stiffness: 180, damping: 12, mass: 0.8 },
    stiff: { stiffness: 400, damping: 30, mass: 0.8 },
    slow: { stiffness: 280, damping: 60, mass: 3 }
  },

  // Optimized transition configs
  transitions: {
    fast: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
    normal: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    slow: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    bounce: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }
  },

  // Stagger delays
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15
  }
};

// GPU-accelerated animation properties
export const gpuProps = {
  // Force GPU acceleration
  willChange: 'transform, opacity',
  
  // Optimized transform properties
  transform: 'translateZ(0)',
  
  // Prevent layout thrashing
  contain: 'layout style paint'
};

// Hook for performance-aware animations
export const usePerformantAnimation = (enabled: boolean = true) => {
  const shouldAnimate = enabled && !animationConfig.prefersReducedMotion;
  
  return {
    shouldAnimate,
    initial: shouldAnimate ? { opacity: 0, y: 20 } : false,
    animate: shouldAnimate ? { opacity: 1, y: 0 } : false,
    transition: shouldAnimate ? animationConfig.transitions.normal : { duration: 0 }
  };
};

// Optimized stagger animation hook
export const useStaggerAnimation = (
  itemCount: number,
  staggerDelay: number = animationConfig.stagger.normal
) => {
  const shouldAnimate = !animationConfig.prefersReducedMotion;
  
  return useMemo(() => {
    if (!shouldAnimate) {
      return {
        container: {},
        item: {}
      };
    }

    return {
      container: {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      },
      item: {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: animationConfig.transitions.normal
        }
      }
    };
  }, [itemCount, staggerDelay, shouldAnimate]);
};

// Frame rate monitoring
export const useFrameRate = (callback?: (fps: number) => void) => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef<number>();

  const measureFrame = useCallback(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTimeRef.current + 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      
      if (callback) {
        callback(fps);
      }
      
      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development' && fps < 50) {
        console.warn(`Low frame rate detected: ${fps}fps`);
      }
      
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
    
    animationIdRef.current = requestAnimationFrame(measureFrame);
  }, [callback]);

  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(measureFrame);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [measureFrame]);
};

// Optimized scroll-triggered animations
export const useScrollAnimation = (threshold: number = 0.1) => {
  const elementRef = useRef<HTMLElement>(null);
  const isVisible = useRef(false);
  const animationTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || animationConfig.prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible.current = entry.isIntersecting;
        
        if (entry.isIntersecting && !animationTriggered.current) {
          animationTriggered.current = true;
          // Trigger animation only once
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return {
    elementRef,
    shouldAnimate: !animationConfig.prefersReducedMotion && !animationTriggered.current
  };
};

// Animation cleanup utilities
export const animationCleanup = {
  // Clean up framer-motion animations
  cleanupMotion: (element: HTMLElement) => {
    if (element) {
      element.style.willChange = 'auto';
      element.style.transform = '';
      element.style.opacity = '';
    }
  },

  // Remove GPU acceleration hints
  removeGPUHints: (element: HTMLElement) => {
    if (element) {
      element.style.willChange = 'auto';
      element.style.contain = '';
      element.style.transform = element.style.transform.replace('translateZ(0)', '');
    }
  },

  // Batch cleanup for multiple elements
  batchCleanup: (elements: HTMLElement[]) => {
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      elements.forEach(animationCleanup.cleanupMotion);
    });
  }
};

// Performance-aware motion values
export const useOptimizedMotionValue = (initialValue: number) => {
  const motionValue = useMotionValue(initialValue);
  const springValue = useSpring(motionValue, animationConfig.springs.gentle);
  
  // Only create spring if animations are enabled
  return animationConfig.prefersReducedMotion ? motionValue : springValue;
};

// Optimized transform animations
export const useOptimizedTransform = (
  input: MotionValue<number>,
  outputRange: [number, number]
) => {
  return useTransform(
    input,
    [0, 1],
    outputRange,
    {
      // Clamp values to prevent unnecessary calculations
      clamp: true
    }
  );
};

// Animation performance monitor
export const animationPerformanceMonitor = {
  // Track animation performance
  trackAnimation: (name: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      if (duration > 16.67) { // More than one frame at 60fps
        console.warn(`Slow animation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
    }
    
    return duration;
  },

  // Monitor layout thrashing
  detectLayoutThrashing: () => {
    let layoutCount = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('layout')) {
          layoutCount++;
        }
      }
      
      if (layoutCount > 10) {
        console.warn('Potential layout thrashing detected');
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    return () => observer.disconnect();
  }
};

// Optimized animation variants
export const optimizedVariants = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: animationConfig.transitions.fast
  },

  // Slide up
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: animationConfig.transitions.normal
  },

  // Scale
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: animationConfig.transitions.normal
  },

  // Stagger container
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: animationConfig.stagger.normal,
        delayChildren: 0.1
      }
    }
  },

  // Stagger item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: animationConfig.transitions.normal
    }
  }
};

// CSS-based animation fallbacks for reduced motion
export const cssAnimationFallbacks = {
  fadeIn: {
    animation: animationConfig.prefersReducedMotion 
      ? 'none' 
      : 'fadeIn 0.3s ease-out forwards'
  },
  
  slideUp: {
    animation: animationConfig.prefersReducedMotion 
      ? 'none' 
      : 'slideUp 0.4s ease-out forwards'
  }
};

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Monitor overall animation performance
  let animationFrameCount = 0;
  let lastFrameTime = performance.now();
  
  const monitorPerformance = () => {
    animationFrameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastFrameTime + 5000) { // Every 5 seconds
      const fps = Math.round((animationFrameCount * 1000) / (currentTime - lastFrameTime));
      
      if (fps < 55) {
        console.warn(`Animation performance warning: ${fps}fps average`);
      }
      
      animationFrameCount = 0;
      lastFrameTime = currentTime;
    }
    
    requestAnimationFrame(monitorPerformance);
  };
  
  requestAnimationFrame(monitorPerformance);
}