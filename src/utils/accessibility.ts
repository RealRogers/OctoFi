/**
 * Accessibility Utilities
 * Utilities for improving accessibility and ARIA support
 */

import React, { useEffect, useState, useRef } from 'react'

/**
 * Hook to detect if user is using keyboard navigation
 */
export const useKeyboardNavigation = () => {
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsUsingKeyboard(true)
      }
    }

    const handleMouseDown = () => {
      setIsUsingKeyboard(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return isUsingKeyboard
}

/**
 * Hook for managing focus trap
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}

/**
 * Hook for announcing screen reader messages
 */
export const useScreenReader = () => {
  const [announcement, setAnnouncement] = useState('')

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    setTimeout(() => setAnnouncement(message), 100)
  }

  return { announcement, announce }
}

/**
 * Generate unique IDs for ARIA attributes
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * ARIA live region component
 */
export const AriaLiveRegion: React.FC<{
  message: string
  priority?: 'polite' | 'assertive'
}> = ({ message, priority = 'polite' }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

/**
 * Skip link component for keyboard navigation
 */
export const SkipLink: React.FC<{
  href: string
  children: React.ReactNode
}> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </a>
  )
}

/**
 * Accessible button props generator
 */
export const getAccessibleButtonProps = (
  label: string,
  options: {
    describedBy?: string
    expanded?: boolean
    pressed?: boolean
    disabled?: boolean
  } = {}
) => {
  return {
    'aria-label': label,
    'aria-describedby': options.describedBy,
    'aria-expanded': options.expanded,
    'aria-pressed': options.pressed,
    'aria-disabled': options.disabled,
    tabIndex: options.disabled ? -1 : 0
  }
}

/**
 * Accessible form field props generator
 */
export const getAccessibleFieldProps = (
  id: string,
  label: string,
  options: {
    required?: boolean
    invalid?: boolean
    describedBy?: string
  } = {}
) => {
  return {
    id,
    'aria-label': label,
    'aria-required': options.required,
    'aria-invalid': options.invalid,
    'aria-describedby': options.describedBy
  }
}

/**
 * Color contrast checker
 */
export const checkColorContrast = (
  foreground: string,
  background: string
): { ratio: number; isAccessible: boolean } => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  
  return {
    ratio,
    isAccessible: ratio >= 4.5 // WCAG AA standard
  }
}

/**
 * Keyboard event handlers
 */
export const handleKeyboardActivation = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  // Save current focus
  saveFocus: (): HTMLElement | null => {
    return document.activeElement as HTMLElement
  },

  // Restore focus to saved element
  restoreFocus: (element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus()
    }
  },

  // Focus first focusable element in container
  focusFirst: (container: HTMLElement) => {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement
    
    if (focusable) {
      focusable.focus()
    }
  }
}