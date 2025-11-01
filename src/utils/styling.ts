/**
 * Styling Utilities
 * Consistent styling helpers and theme utilities
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Enhanced cn function with additional utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status color mappings
export const statusColors = {
  active: 'text-green-400 bg-green-500/10 border-green-500/20',
  inactive: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  error: 'text-red-400 bg-red-500/10 border-red-500/20',
  warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  success: 'text-green-400 bg-green-500/10 border-green-500/20'
} as const

// Priority color mappings
export const priorityColors = {
  low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  critical: 'text-red-400 bg-red-500/10 border-red-500/20'
} as const

// Glassmorphism variants
export const glassVariants = {
  default: 'bg-gray-800/30 backdrop-blur-xl border border-white/10',
  light: 'bg-gray-800/20 backdrop-blur-lg border border-white/5',
  heavy: 'bg-gray-800/50 backdrop-blur-2xl border border-white/20',
  colored: {
    blue: 'bg-blue-900/20 backdrop-blur-xl border border-blue-500/20',
    purple: 'bg-purple-900/20 backdrop-blur-xl border border-purple-500/20',
    green: 'bg-green-900/20 backdrop-blur-xl border border-green-500/20',
    red: 'bg-red-900/20 backdrop-blur-xl border border-red-500/20'
  }
} as const

// Animation duration presets
export const animationDurations = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
  slower: 'duration-700'
} as const

// Easing presets
export const easingPresets = {
  smooth: 'ease-out',
  bounce: 'ease-in-out',
  sharp: 'ease-in',
  custom: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
} as const

// Shadow presets
export const shadowPresets = {
  soft: 'shadow-lg shadow-black/10',
  medium: 'shadow-xl shadow-black/20',
  hard: 'shadow-2xl shadow-black/30',
  glow: {
    blue: 'shadow-lg shadow-blue-500/20',
    purple: 'shadow-lg shadow-purple-500/20',
    green: 'shadow-lg shadow-green-500/20',
    red: 'shadow-lg shadow-red-500/20'
  }
} as const

// Utility functions
export const getStatusColor = (status: keyof typeof statusColors) => {
  return statusColors[status] || statusColors.inactive
}

export const getPriorityColor = (priority: keyof typeof priorityColors) => {
  return priorityColors[priority] || priorityColors.low
}

export const getGlassVariant = (variant: keyof typeof glassVariants | keyof typeof glassVariants.colored = 'default') => {
  if (variant in glassVariants.colored) {
    return glassVariants.colored[variant as keyof typeof glassVariants.colored]
  }
  return glassVariants[variant as keyof typeof glassVariants] || glassVariants.default
}

// Responsive breakpoint helpers
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

// Color palette for consistent theming
export const colorPalette = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
} as const

// Typography scale
export const typography = {
  display: 'text-4xl font-bold tracking-tight',
  h1: 'text-3xl font-bold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold tracking-tight',
  h4: 'text-lg font-semibold tracking-tight',
  body: 'text-base font-normal',
  small: 'text-sm font-normal',
  caption: 'text-xs font-normal',
  code: 'font-mono text-sm'
} as const

// Layout utilities
export const layouts = {
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12 lg:py-16',
  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    dashboard: 'grid grid-cols-1 xl:grid-cols-3 gap-6',
    cards: 'grid grid-cols-1 md:grid-cols-4 gap-4'
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end'
  }
} as const

// Helper to create consistent card styles
export const createCardStyle = (options: {
  variant?: keyof typeof glassVariants | keyof typeof glassVariants.colored
  hover?: boolean
  shadow?: keyof typeof shadowPresets | keyof typeof shadowPresets.glow
  padding?: 'sm' | 'md' | 'lg'
} = {}) => {
  const {
    variant = 'default',
    hover = true,
    shadow = 'soft',
    padding = 'md'
  } = options

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return cn(
    getGlassVariant(variant),
    hover && 'glass-card-hover',
    typeof shadow === 'string' && shadow in shadowPresets ? shadowPresets[shadow as keyof typeof shadowPresets] : '',
    paddingClasses[padding],
    'rounded-lg'
  )
}

// Helper to create consistent button styles
export const createButtonStyle = (options: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  state?: 'default' | 'loading' | 'disabled'
} = {}) => {
  const { variant = 'primary', size = 'md', state = 'default' } = options

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all'
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  }

  const variantClasses = {
    primary: 'btn-primary text-white',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800',
    ghost: 'text-gray-300 hover:bg-gray-800'
  }

  const stateClasses = {
    default: '',
    loading: 'opacity-70 cursor-not-allowed',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
  }

  return cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses[state]
  )
}