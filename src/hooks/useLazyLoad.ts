import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
  loadDelay?: number;
}

export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    enabled = true,
    loadDelay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(!enabled);
  const [isLoaded, setIsLoaded] = useState(!enabled);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Trigger loading
  const triggerLoad = useCallback(() => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    
    if (loadDelay > 0) {
      setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
      }, loadDelay);
    } else {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, [isLoaded, isLoading, loadDelay]);

  // Set up intersection observer
  useEffect(() => {
    if (!enabled || isLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          triggerLoad();
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observerRef.current = observer;

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [enabled, isLoaded, rootMargin, threshold, triggerLoad]);

  // Manual trigger function
  const manualTrigger = useCallback(() => {
    setIsVisible(true);
    triggerLoad();
  }, [triggerLoad]);

  // Reset function
  const reset = useCallback(() => {
    setIsVisible(!enabled);
    setIsLoaded(!enabled);
    setIsLoading(false);
  }, [enabled]);

  return {
    elementRef,
    isVisible,
    isLoaded,
    isLoading,
    manualTrigger,
    reset
  };
};