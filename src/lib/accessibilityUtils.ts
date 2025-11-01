/**
 * Accessibility Utilities
 * Comprehensive accessibility helpers for keyboard navigation, ARIA, and screen readers
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// Keyboard navigation constants
export const KEYBOARD_KEYS = {
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
} as const;

// Focus management utilities
export const focusManager = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        const htmlElement = element as HTMLElement;
        return htmlElement.offsetParent !== null && // Not hidden
               !htmlElement.hasAttribute('aria-hidden') &&
               htmlElement.tabIndex !== -1;
      }) as HTMLElement[];
  },

  // Focus the first focusable element
  focusFirst: (container: HTMLElement): boolean => {
    const focusableElements = focusManager.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  },

  // Focus the last focusable element
  focusLast: (container: HTMLElement): boolean => {
    const focusableElements = focusManager.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  },

  // Trap focus within a container
  trapFocus: (container: HTMLElement, event: KeyboardEvent): boolean => {
    if (event.key !== KEYBOARD_KEYS.TAB) return false;

    const focusableElements = focusManager.getFocusableElements(container);
    if (focusableElements.length === 0) return false;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
        return true;
      }
    } else {
      // Tab (forward)
      if (activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
        return true;
      }
    }

    return false;
  }
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: {
    trapFocus?: boolean;
    autoFocus?: boolean;
    onEscape?: () => void;
    arrowNavigation?: boolean;
  } = {}
) => {
  const { trapFocus = false, autoFocus = false, onEscape, arrowNavigation = false } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto focus first element
    if (autoFocus) {
      focusManager.focusFirst(container);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case KEYBOARD_KEYS.TAB:
          if (trapFocus) {
            focusManager.trapFocus(container, event);
          }
          break;

        case KEYBOARD_KEYS.ESCAPE:
          if (onEscape) {
            onEscape();
            event.preventDefault();
          }
          break;

        case KEYBOARD_KEYS.ARROW_UP:
        case KEYBOARD_KEYS.ARROW_DOWN:
          if (arrowNavigation) {
            handleArrowNavigation(container, event);
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, trapFocus, autoFocus, onEscape, arrowNavigation]);
};

// Arrow key navigation handler
const handleArrowNavigation = (container: HTMLElement, event: KeyboardEvent) => {
  const focusableElements = focusManager.getFocusableElements(container);
  const activeElement = document.activeElement as HTMLElement;
  const currentIndex = focusableElements.indexOf(activeElement);

  if (currentIndex === -1) return;

  let nextIndex: number;

  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_UP:
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
      break;
    case KEYBOARD_KEYS.ARROW_DOWN:
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
      break;
    default:
      return;
  }

  focusableElements[nextIndex].focus();
  event.preventDefault();
};

// Skip links functionality
export const useSkipLinks = () => {
  const skipLinksRef = useRef<HTMLDivElement>(null);

  const skipLinks = [
    { href: '#hero-section', label: 'Skip to agent status' },
    { href: '#performance-section', label: 'Skip to performance overview' },
    { href: '#controls-section', label: 'Skip to agent controls' },
    { href: '#analytics-section', label: 'Skip to analytics' }
  ];

  const SkipLinksComponent = () => (
    <div
      ref={skipLinksRef}
      className="sr-only focus-within:not-sr-only fixed top-0 left-0 z-50 bg-gray-900 border border-gray-700 rounded-br-lg p-2"
    >
      <nav aria-label="Skip navigation links">
        <ul className="space-y-1">
          {skipLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="block px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector(link.href);
                  if (target) {
                    (target as HTMLElement).focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return { SkipLinksComponent };
};

// ARIA live region for announcements
export const useAriaLiveRegion = () => {
  const [announcement, setAnnouncement] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setPoliteness(priority);
    setAnnouncement(message);
    
    // Clear announcement after a delay to allow for re-announcements
    setTimeout(() => {
      setAnnouncement('');
    }, 1000);
  }, []);

  const LiveRegionComponent = () => (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );

  return { announce, LiveRegionComponent };
};

// Focus visible indicator management
export const useFocusVisible = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.TAB) {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-user');
        document.body.classList.remove('mouse-user');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.add('mouse-user');
      document.body.classList.remove('keyboard-user');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { isKeyboardUser };
};

// Roving tabindex for complex widgets
export const useRovingTabindex = (
  containerRef: React.RefObject<HTMLElement>,
  orientation: 'horizontal' | 'vertical' = 'vertical'
) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateTabindices = () => {
      const focusableElements = focusManager.getFocusableElements(container);
      
      focusableElements.forEach((element, index) => {
        element.tabIndex = index === activeIndex ? 0 : -1;
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusableElements = focusManager.getFocusableElements(container);
      let nextIndex = activeIndex;

      const isHorizontal = orientation === 'horizontal';
      const prevKey = isHorizontal ? KEYBOARD_KEYS.ARROW_LEFT : KEYBOARD_KEYS.ARROW_UP;
      const nextKey = isHorizontal ? KEYBOARD_KEYS.ARROW_RIGHT : KEYBOARD_KEYS.ARROW_DOWN;

      switch (event.key) {
        case prevKey:
          nextIndex = activeIndex > 0 ? activeIndex - 1 : focusableElements.length - 1;
          event.preventDefault();
          break;
        case nextKey:
          nextIndex = activeIndex < focusableElements.length - 1 ? activeIndex + 1 : 0;
          event.preventDefault();
          break;
        case KEYBOARD_KEYS.HOME:
          nextIndex = 0;
          event.preventDefault();
          break;
        case KEYBOARD_KEYS.END:
          nextIndex = focusableElements.length - 1;
          event.preventDefault();
          break;
        default:
          return;
      }

      setActiveIndex(nextIndex);
      focusableElements[nextIndex]?.focus();
    };

    updateTabindices();
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, activeIndex, orientation]);

  return { activeIndex, setActiveIndex };
};

// Accessible modal/dialog management
export const useAccessibleModal = (isOpen: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      if (modalRef.current) {
        focusManager.focusFirst(modalRef.current);
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }

      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen || !modalRef.current) return;

    if (event.key === KEYBOARD_KEYS.ESCAPE) {
      // Handle escape key (should be handled by parent component)
      return;
    }

    // Trap focus within modal
    focusManager.trapFocus(modalRef.current, event);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return { modalRef };
};

// Accessible form validation
export const useAccessibleForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorRefs = useRef<Record<string, HTMLElement>>({});

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    
    // Focus the field with error
    setTimeout(() => {
      const errorElement = errorRefs.current[fieldName];
      if (errorElement) {
        errorElement.focus();
      }
    }, 100);
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const registerErrorRef = useCallback((fieldName: string, element: HTMLElement | null) => {
    if (element) {
      errorRefs.current[fieldName] = element;
    } else {
      delete errorRefs.current[fieldName];
    }
  }, []);

  return {
    errors,
    setFieldError,
    clearFieldError,
    registerErrorRef
  };
};

// Screen reader utilities
export const screenReaderUtils = {
  // Announce content changes
  announceChange: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create accessible descriptions
  createDescription: (id: string, text: string) => {
    let description = document.getElementById(id);
    if (!description) {
      description = document.createElement('div');
      description.id = id;
      description.className = 'sr-only';
      document.body.appendChild(description);
    }
    description.textContent = text;
    return id;
  },

  // Remove accessible descriptions
  removeDescription: (id: string) => {
    const description = document.getElementById(id);
    if (description) {
      document.body.removeChild(description);
    }
  }
};

// Color contrast utilities
export const colorContrastUtils = {
  // Calculate relative luminance
  getRelativeLuminance: (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Apply gamma correction
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // Calculate relative luminance
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  },

  // Calculate contrast ratio
  getContrastRatio: (color1: string, color2: string): number => {
    const l1 = colorContrastUtils.getRelativeLuminance(color1);
    const l2 = colorContrastUtils.getRelativeLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check WCAG compliance
  checkWCAGCompliance: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorContrastUtils.getContrastRatio(foreground, background);
    const threshold = level === 'AA' ? 4.5 : 7;
    return ratio >= threshold;
  }
};