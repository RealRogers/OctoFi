import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
}

interface ScrollProgress {
  scrollY: number;
  scrollProgress: number; // 0-1
  direction: 'up' | 'down';
  isScrolling: boolean;
}

export const useScrollAnimations = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    disabled = false
  } = options;

  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    scrollY: 0,
    scrollProgress: 0,
    direction: 'down',
    isScrolling: false
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<string, Element>>(new Map());
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize intersection observer
  useEffect(() => {
    if (disabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementId = entry.target.getAttribute('data-scroll-id');
          if (!elementId) return;

          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(elementId));
            
            // Remove from observer if triggerOnce is true
            if (triggerOnce) {
              observerRef.current?.unobserve(entry.target);
              elementsRef.current.delete(elementId);
            }
          } else if (!triggerOnce) {
            setVisibleElements(prev => {
              const newSet = new Set(prev);
              newSet.delete(elementId);
              return newSet;
            });
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, disabled]);

  // Track scroll progress
  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / documentHeight, 1);
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';

      setScrollProgress({
        scrollY,
        scrollProgress: progress,
        direction,
        isScrolling: true
      });

      lastScrollY.current = scrollY;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollProgress(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [disabled]);

  // Register element for scroll animation
  const registerElement = useCallback((elementId: string, element: Element) => {
    if (disabled || !observerRef.current) return;

    element.setAttribute('data-scroll-id', elementId);
    elementsRef.current.set(elementId, element);
    observerRef.current.observe(element);
  }, [disabled]);

  // Unregister element
  const unregisterElement = useCallback((elementId: string) => {
    const element = elementsRef.current.get(elementId);
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(elementId);
    }
    
    setVisibleElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  }, []);

  // Check if element is visible
  const isElementVisible = useCallback((elementId: string) => {
    return visibleElements.has(elementId);
  }, [visibleElements]);

  // Get scroll-based animation delay
  const getScrollDelay = useCallback((index: number, baseDelay = 0) => {
    return baseDelay + (index * 100); // 100ms stagger
  }, []);

  // Scroll to element utility
  const scrollToElement = useCallback((elementId: string, offset = 0) => {
    const element = elementsRef.current.get(elementId) || document.getElementById(elementId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // Get parallax transform value
  const getParallaxTransform = useCallback((speed = 0.5) => {
    const translateY = scrollProgress.scrollY * speed;
    return `translateY(${translateY}px)`;
  }, [scrollProgress.scrollY]);

  // Get fade opacity based on scroll
  const getFadeOpacity = useCallback((startY: number, endY: number) => {
    const { scrollY } = scrollProgress;
    if (scrollY < startY) return 1;
    if (scrollY > endY) return 0;
    return 1 - ((scrollY - startY) / (endY - startY));
  }, [scrollProgress]);

  return {
    // Element visibility
    registerElement,
    unregisterElement,
    isElementVisible,
    visibleElements: Array.from(visibleElements),
    
    // Scroll progress
    scrollProgress,
    
    // Animation utilities
    getScrollDelay,
    scrollToElement,
    getParallaxTransform,
    getFadeOpacity,
    
    // Convenience flags
    isScrollingDown: scrollProgress.direction === 'down',
    isScrollingUp: scrollProgress.direction === 'up',
    isNearTop: scrollProgress.scrollProgress < 0.1,
    isNearBottom: scrollProgress.scrollProgress > 0.9,
  };
};

// Hook for individual element scroll animation
export const useScrollAnimation = (
  elementId: string, 
  options: ScrollAnimationOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const { registerElement, unregisterElement, isElementVisible } = useScrollAnimations(options);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      registerElement(elementId, element);
      
      return () => {
        unregisterElement(elementId);
      };
    }
  }, [elementId, registerElement, unregisterElement]);

  return {
    elementRef,
    isVisible: isElementVisible(elementId)
  };
};