/**
 * Performance Optimization Utilities
 * Utilities for optimizing animations and performance monitoring
 */

import React, { useEffect, useRef, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook to monitor frame rate and performance
 */
export const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const animationFrame = useRef<number>()

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      
      if (currentTime - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)))
        frameCount.current = 0
        lastTime.current = currentTime
      }
      
      animationFrame.current = requestAnimationFrame(measureFPS)
    }

    animationFrame.current = requestAnimationFrame(measureFPS)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  return { fps }
}

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Hook for intersection observer (lazy loading)
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true)
      }
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [hasIntersected, options])

  return { elementRef, isIntersecting, hasIntersected }
}

/**
 * Animation configuration based on performance and user preferences
 */
export const getAnimationConfig = (prefersReducedMotion: boolean, fps: number) => {
  // Disable animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return {
      duration: 0,
      ease: 'linear' as const,
      stagger: 0,
      enabled: false
    }
  }

  // Reduce animation complexity on low-performance devices
  if (fps < 30) {
    return {
      duration: 0.2,
      ease: 'easeOut' as const,
      stagger: 0.05,
      enabled: true,
      reduced: true
    }
  }

  // Standard animations for good performance
  return {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1] as const,
    stagger: 0.1,
    enabled: true,
    reduced: false
  }
}

/**
 * Memory cleanup utility
 */
export const cleanupResources = (resources: Array<() => void>) => {
  resources.forEach(cleanup => {
    try {
      cleanup()
    } catch (error) {
      console.warn('Error during resource cleanup:', error)
    }
  })
}