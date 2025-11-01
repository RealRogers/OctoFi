/**
 * Reduced Motion Utilities
 * Comprehensive support for prefers-reduced-motion accessibility preference
 */

import { useEffect, useState, useMemo } from 'react';
import { Variants } from 'framer-motion';

// Detect reduced motion preference
export const detectReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Hook for reduced motion detection with live updates
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(detectReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

// Reduced motion aware animation variants
export const createReducedMotionVariants = (
  normalVariants: Variants,
  reducedVariants?: Variants
): Variants => {
  const prefersReducedMotion = detectReducedMotion();
  
  if (prefersReducedMotion) {
    return reducedVariants || {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.01 }
    };
  }
  
  return normalVariants;
};

// Pre-built reduced motion variants
export const reducedMotionVariants = {
  // Fade only (no movement)
  fade: {
    normal: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 }
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 }
    }
  },

  // Scale (minimal movement)
  scale: {
    normal: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 }
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 }
    }
  },

  // Slide (reduced to fade)
  slide: {
    normal: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.3 }
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 }
    }
  },

  // Stagger container
  staggerContainer: {
    normal: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },
    reduced: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.01,
          delayChildren: 0.01
        }
      }
    }
  }
};

// Hook for adaptive animation variants
export const useAdaptiveVariants = (variantName: keyof typeof reducedMotionVariants) => {
  const prefersReducedMotion = useReducedMotion();
  
  return useMemo(() => {
    const variants = reducedMotionVariants[variantName];
    return prefersReducedMotion ? variants.reduced : variants.normal;
  }, [variantName, prefersReducedMotion]);
};

// CSS-based reduced motion support
export const reducedMotionCSS = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    /* Disable specific animations */
    .animate-spin,
    .animate-pulse,
    .animate-bounce {
      animation: none !important;
    }
    
    /* Reduce transform animations */
    .animate-fade-in,
    .animate-slide-up,
    .animate-scale-in {
      animation: reduced-fade 0.15s ease-out !important;
    }
    
    /* Disable parallax and complex transforms */
    .parallax,
    .transform-gpu {
      transform: none !important;
    }
  }
  
  @keyframes reduced-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Inject reduced motion CSS
export const injectReducedMotionCSS = () => {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('reduced-motion-styles');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'reduced-motion-styles';
  style.textContent = reducedMotionCSS;
  document.head.appendChild(style);
};

// Animation configuration based on reduced motion
export const getAnimationConfig = (prefersReducedMotion?: boolean) => {
  const reducedMotion = prefersReducedMotion ?? detectReducedMotion();
  
  return {
    duration: reducedMotion ? 0.01 : 0.3,
    ease: reducedMotion ? 'linear' : [0.25, 0.1, 0.25, 1],
    staggerDelay: reducedMotion ? 0.01 : 0.1,
    enableAnimations: !reducedMotion,
    
    // Framer Motion specific
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 },
    
    // CSS class modifiers
    cssClasses: {
      base: reducedMotion ? 'motion-reduce' : 'motion-normal',
      animations: reducedMotion ? 'animate-none' : 'animate-normal'
    }
  };
};

// Hook for conditional animation props
export const useConditionalAnimation = (animationProps: any) => {
  const prefersReducedMotion = useReducedMotion();
  
  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: false,
        animate: false,
        exit: false,
        transition: { duration: 0 }
      };
    }
    
    return animationProps;
  }, [animationProps, prefersReducedMotion]);
};

// Reduced motion aware loading states
export const useReducedMotionLoading = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    spinnerClass: prefersReducedMotion ? 'opacity-50' : 'animate-spin',
    pulseClass: prefersReducedMotion ? 'opacity-75' : 'animate-pulse',
    bounceClass: prefersReducedMotion ? '' : 'animate-bounce'
  };
};

// Safe animation wrapper component
interface SafeAnimationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const SafeAnimation: React.FC<SafeAnimationProps> = ({
  children,
  fallback,
  className
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion && fallback) {
    return <div className={className}>{fallback}</div>;
  }
  
  return <div className={className}>{children}</div>;
};

// Accessibility-first animation utilities
export const a11yAnimationUtils = {
  // Create accessible loading indicator
  createAccessibleSpinner: (prefersReducedMotion: boolean) => ({
    className: prefersReducedMotion 
      ? 'opacity-50 transition-opacity duration-150' 
      : 'animate-spin',
    'aria-label': 'Loading',
    role: 'status'
  }),
  
  // Create accessible progress indicator
  createAccessibleProgress: (prefersReducedMotion: boolean, progress: number) => ({
    className: prefersReducedMotion 
      ? 'transition-all duration-150' 
      : 'transition-all duration-300 ease-out',
    style: { width: `${progress}%` },
    'aria-valuenow': progress,
    'aria-valuemin': 0,
    'aria-valuemax': 100
  }),
  
  // Create accessible notification
  createAccessibleNotification: (prefersReducedMotion: boolean) => ({
    className: prefersReducedMotion 
      ? 'opacity-100' 
      : 'animate-fade-in',
    'aria-live': 'polite',
    role: 'status'
  })
};

// Performance monitoring for reduced motion
export const motionPerformanceMonitor = {
  // Track animation performance impact
  trackAnimationImpact: () => {
    if (typeof window === 'undefined') return;
    
    const prefersReducedMotion = detectReducedMotion();
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Log performance data
        if (process.env.NODE_ENV === 'development') {
          console.log(`Animation Performance - Reduced Motion: ${prefersReducedMotion}, FPS: ${fps}`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  },
  
  // Monitor reduced motion preference changes
  monitorPreferenceChanges: (callback: (prefersReducedMotion: boolean) => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      callback(event.matches);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Reduced motion preference changed: ${event.matches}`);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }
};

// Initialize reduced motion support
export const initializeReducedMotionSupport = () => {
  if (typeof window === 'undefined') return;
  
  // Inject CSS
  injectReducedMotionCSS();
  
  // Add body class based on preference
  const updateBodyClass = (prefersReducedMotion: boolean) => {
    document.body.classList.toggle('prefers-reduced-motion', prefersReducedMotion);
    document.body.classList.toggle('prefers-motion', !prefersReducedMotion);
  };
  
  // Set initial class
  updateBodyClass(detectReducedMotion());
  
  // Listen for changes
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', (event) => {
    updateBodyClass(event.matches);
  });
  
  // Start performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    motionPerformanceMonitor.trackAnimationImpact();
  }
};

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initializeReducedMotionSupport();
}