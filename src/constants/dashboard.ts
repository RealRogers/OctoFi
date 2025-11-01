/**
 * Dashboard Constants
 * 
 * Centralized constants for the AgentDashboardPage component.
 * These values control animations, polling behavior, caching, and responsive breakpoints.
 */

/**
 * Animation delay constants for staggered entrance animations
 * Values are in seconds and used with framer-motion
 */
export const ANIMATION_DELAYS = {
  BASE: 0.1,
  STATUS_CARD_1: 0.1,
  STATUS_CARD_2: 0.2,
  STATUS_CARD_3: 0.3,
  STATUS_CARD_4: 0.4,
  PERFORMANCE_CHART: 0.5,
  RECOMMENDATIONS: 0.55,
  COMPARISON: 0.58,
  CONTROLS: 0.6,
  INSIGHTS: 0.7,
  AUDIT: 0.8,
  INFO: 0.9,
} as const

/**
 * Polling interval constants for data fetching
 * Values are in milliseconds
 */
export const POLLING_INTERVALS = {
  /** Polling interval when agent is active - 10 seconds */
  ACTIVE: 10000,
  /** Polling interval when agent is inactive - 30 seconds */
  INACTIVE: 30000,
  /** Base interval for exponential backoff on errors - 5 seconds */
  ERROR_BACKOFF_BASE: 5000,
  /** Maximum backoff interval on repeated errors - 1 minute */
  ERROR_BACKOFF_MAX: 60000,
} as const

/**
 * React Query cache time constants
 * Values are in milliseconds
 */
export const CACHE_TIMES = {
  /** Time before cached data is considered stale - 30 seconds */
  STALE_TIME: 30000,
  /** Time before cached data is garbage collected - 5 minutes */
  CACHE_TIME: 300000,
} as const

/**
 * Responsive breakpoint constants
 * Values are in pixels
 */
export const BREAKPOINTS = {
  /** Mobile breakpoint - 768px */
  MOBILE: 768,
  /** Tablet breakpoint - 1024px */
  TABLET: 1024,
  /** Desktop breakpoint - 1280px */
  DESKTOP: 1280,
  /** Extra large breakpoint - 1536px */
  XL: 1536,
} as const

/**
 * Toast notification duration constants
 * Values are in milliseconds
 */
export const TOAST_DURATIONS = {
  /** Short duration for simple notifications - 3 seconds */
  SHORT: 3000,
  /** Medium duration for standard notifications - 5 seconds */
  MEDIUM: 5000,
  /** Long duration for important notifications - 7 seconds */
  LONG: 7000,
} as const

/**
 * Type exports for type safety
 */
export type AnimationDelay = typeof ANIMATION_DELAYS[keyof typeof ANIMATION_DELAYS]
export type PollingInterval = typeof POLLING_INTERVALS[keyof typeof POLLING_INTERVALS]
export type CacheTime = typeof CACHE_TIMES[keyof typeof CACHE_TIMES]
export type Breakpoint = typeof BREAKPOINTS[keyof typeof BREAKPOINTS]
export type ToastDuration = typeof TOAST_DURATIONS[keyof typeof TOAST_DURATIONS]
