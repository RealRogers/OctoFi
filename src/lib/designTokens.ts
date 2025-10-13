/**
 * Design Tokens for Dashboard Layout
 * Centralized design system values for consistent spacing, sizing, and responsive behavior
 * 
 * Design Philosophy:
 * - 8px grid system for mathematical consistency and visual harmony
 * - Hierarchical spacing that reflects content importance
 * - Responsive scaling that maintains proportions across devices
 * - Semantic naming for clear intent and maintainability
 * 
 * Usage:
 * - Import tokens in components: import { designTokens } from '@/lib/designTokens'
 * - Use CSS custom properties: var(--zone-gap) 
 * - Reference in Tailwind config for utility classes
 */

export const designTokens = {
  // Spacing system - Based on 8px grid for mathematical consistency
  spacing: {
    // Zone-level spacing (gaps between major layout zones)
    zoneGap: '24px',        // 3 × 8px - Generous breathing room between zones
    zoneGapMobile: '16px',  // 2 × 8px - Reduced for mobile space constraints
    
    // Card-level spacing (internal padding within components)
    cardPadding: '24px',        // 3 × 8px - Standard card internal spacing
    cardPaddingMobile: '16px',  // 2 × 8px - Reduced for mobile touch targets
    cardPaddingLarge: '32px',   // 4 × 8px - Hero zone needs extra breathing room
    
    // Grid spacing (gaps between grid columns/rows)
    gridGap: '24px',        // 3 × 8px - Optimal separation for related content
    gridGapMobile: '16px',  // 2 × 8px - Tighter spacing for mobile screens
    
    // Section spacing (margins between major content sections)
    sectionMargin: '32px',        // 4 × 8px - Clear separation between sections
    sectionMarginMobile: '24px',  // 3 × 8px - Proportional reduction for mobile
    
    // Component spacing (gaps between related UI elements)
    componentGap: '16px',        // 2 × 8px - Standard gap for related elements
    componentGapSmall: '8px',    // 1 × 8px - Tight spacing for grouped items
    componentGapLarge: '32px',   // 4 × 8px - Separation for distinct components
    
    // Hero-specific spacing
    heroHorizontalPadding: '32px',        // 4 * 8px
    heroHorizontalPaddingMobile: '20px',  // 2.5 * 8px
    heroVerticalPadding: '24px',          // 3 * 8px
    heroVerticalPaddingMobile: '16px',    // 2 * 8px
    
    // Content spacing
    contentSpacing: '24px',        // 3 * 8px - Standard content spacing
    contentSpacingTight: '16px',   // 2 * 8px - Tight content spacing
    contentSpacingLoose: '32px',   // 4 * 8px - Loose content spacing
  },

  // Zone heights
  heights: {
    heroBar: '120px',
    performanceMin: '400px',
    performanceMax: '500px',
    controlGridMin: '400px',
    controlGridMax: '600px',
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1280,
    desktop: 1536,
  },

  // Animation settings
  animations: {
    staggerDelay: 100, // ms
    transitionDuration: '300ms',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    entranceDuration: '400ms',
  },

  // Grid system
  grid: {
    desktop: {
      columns: 3,
      columnTemplate: '2fr 1fr 1.5fr',
      gap: '24px',
    },
    tablet: {
      columns: 2,
      columnTemplate: '1fr 1fr',
      gap: '20px',
    },
    mobile: {
      columns: 1,
      columnTemplate: '1fr',
      gap: '16px',
    },
  },

  // Typography scale - Hierarchical system based on visual importance
  typography: {
    // Display sizes (largest) - For major page elements and hero content
    displayLarge: '48px',      // Page titles, major hero headings
    displayMedium: '40px',     // Section titles, important announcements  
    displaySmall: '32px',      // Subsection titles, card headers
    
    // Heading sizes - For component and content organization
    headingLarge: '28px',      // Major component titles, important cards
    headingMedium: '24px',     // Hero status text, primary labels
    headingSmall: '20px',      // Component headers, secondary titles
    
    // Body sizes - For readable content and interface text
    bodyLarge: '18px',         // Important body text, key descriptions
    bodyMedium: '16px',        // Standard body text, form labels
    bodySmall: '14px',         // Secondary text, helper text, small labels
    
    // Caption sizes - For metadata and supplementary information
    captionLarge: '13px',      // Small labels, metadata, timestamps
    captionMedium: '12px',     // Tiny labels, fine print
    captionSmall: '11px',      // Micro text, footnotes, legal text
    
    // Metric sizes (special purpose) - For numerical data display
    metricHero: '36px',        // Hero zone metrics (P&L, Win Rate) - maximum impact
    metricLarge: '28px',       // Important dashboard metrics
    metricMedium: '24px',      // Standard metric displays
    metricSmall: '20px',       // Secondary metrics, comparison data
    
    // Mobile adjustments
    mobile: {
      displayLarge: '32px',
      displayMedium: '28px',
      displaySmall: '24px',
      headingLarge: '22px',
      headingMedium: '20px',
      headingSmall: '18px',
      bodyLarge: '16px',
      bodyMedium: '14px',
      bodySmall: '13px',
      metricHero: '28px',
      metricLarge: '24px',
      metricMedium: '20px',
      metricSmall: '18px',
    }
  },

  // Font weights with semantic names
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights for better readability
  lineHeights: {
    tight: 1.2,      // For headings and metrics
    normal: 1.4,     // For body text
    relaxed: 1.6,    // For longer text blocks
    loose: 1.8,      // For captions and small text
  },

  // Color hierarchy system
  colors: {
    // Text hierarchy (importance-based)
    text: {
      primary: 'hsl(210, 40%, 98%)',      // White - Most important text
      secondary: 'hsl(215, 20%, 75%)',    // Light gray - Secondary text
      tertiary: 'hsl(215, 20%, 65%)',     // Medium gray - Tertiary text
      quaternary: 'hsl(215, 20%, 45%)',   // Dark gray - Least important text
      disabled: 'hsl(215, 20%, 35%)',     // Disabled text
    },

    // Status colors (semantic)
    status: {
      success: 'hsl(142, 76%, 36%)',      // Green - Success states
      warning: 'hsl(38, 92%, 50%)',       // Yellow - Warning states
      error: 'hsl(0, 84%, 60%)',          // Red - Error states
      info: 'hsl(217, 91%, 60%)',         // Blue - Info states
    },

    // Accent colors (brand/interactive)
    accent: {
      primary: 'hsl(267, 84%, 65%)',      // Purple - Primary brand
      secondary: 'hsl(195, 92%, 58%)',    // Cyan - Secondary brand
      tertiary: 'hsl(142, 76%, 36%)',     // Green - Tertiary accent
    },

    // Background hierarchy
    background: {
      primary: 'hsl(220, 40%, 6%)',       // Main background
      secondary: 'hsl(220, 35%, 8%)',     // Card backgrounds
      tertiary: 'hsl(220, 30%, 15%)',     // Elevated surfaces
      overlay: 'hsla(220, 40%, 6%, 0.8)', // Modal overlays
    },

    // Border hierarchy
    border: {
      primary: 'hsl(220, 30%, 18%)',      // Main borders
      secondary: 'hsla(255, 255%, 255%, 0.1)', // Subtle borders
      accent: 'hsla(267, 84%, 65%, 0.3)', // Accent borders
      focus: 'hsl(267, 84%, 65%)',        // Focus indicators
    },

    // Metric-specific colors
    metrics: {
      positive: 'hsl(142, 76%, 36%)',     // Green for gains
      negative: 'hsl(0, 84%, 60%)',       // Red for losses
      neutral: 'hsl(215, 20%, 65%)',      // Gray for neutral
      highlight: 'hsl(267, 84%, 65%)',    // Purple for highlights
    },
  },

  // Contrast ratios for accessibility
  contrast: {
    aa: 4.5,      // WCAG AA standard
    aaa: 7,       // WCAG AAA standard
  },
} as const;

// Helper function to get breakpoint media query
export const getBreakpoint = (size: keyof typeof designTokens.breakpoints) => {
  return `${designTokens.breakpoints[size]}px`;
};

// Helper function to get media query string
export const mediaQuery = {
  mobile: `@media (max-width: ${designTokens.breakpoints.mobile - 1}px)`,
  tablet: `@media (min-width: ${designTokens.breakpoints.mobile}px) and (max-width: ${designTokens.breakpoints.tablet - 1}px)`,
  desktop: `@media (min-width: ${designTokens.breakpoints.tablet}px)`,
  desktopLarge: `@media (min-width: ${designTokens.breakpoints.desktop}px)`,
};

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type Breakpoint = keyof typeof designTokens.breakpoints;
