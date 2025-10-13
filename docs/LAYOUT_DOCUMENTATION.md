# Dashboard Layout Documentation

## Overview

This document provides comprehensive documentation for the Agent Dashboard layout system, including zone structure, responsive behavior, design tokens, and implementation details.

## Table of Contents

1. [Zone Structure](#zone-structure)
2. [Responsive Breakpoints](#responsive-breakpoints)
3. [Design Tokens](#design-tokens)
4. [CSS Grid System](#css-grid-system)
5. [Component Architecture](#component-architecture)
6. [Accessibility Features](#accessibility-features)
7. [Performance Optimizations](#performance-optimizations)
8. [Code Comments Guide](#code-comments-guide)

## Zone Structure

The dashboard is organized into 5 distinct zones, each with a specific purpose and visual hierarchy:

### Zone 1: Hero Status Bar
**Purpose**: Provide instant visibility of agent status and critical metrics
- **Height**: Fixed 120px
- **Content**: Agent status, quick actions, key metrics (P&L, Win Rate, 24h change)
- **Priority**: Highest - Always visible above the fold
- **Grid Area**: `hero`

```css
.zone-hero {
  grid-area: hero;
  min-height: 120px;
  max-height: 120px;
}
```

### Zone 2: Performance Overview
**Purpose**: Visualize performance data and asset allocation
- **Height**: Flexible 400-500px
- **Content**: Performance chart (70% width) + Asset allocation (30% width)
- **Priority**: High - Critical for decision making
- **Grid Area**: `performance`

```css
.zone-performance {
  grid-area: performance;
  min-height: 400px;
  max-height: 500px;
}
```

### Zone 3: AI Intelligence Layer
**Purpose**: Display AI recommendations when available
- **Height**: Auto (conditional rendering)
- **Content**: AI recommendations with priority-based styling
- **Priority**: High when present - Interrupts normal flow for critical alerts
- **Grid Area**: `ai-layer`

```css
.zone-ai-layer {
  grid-area: ai-layer;
  min-height: 0;
  transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

### Zone 4: Control & Analysis Grid
**Purpose**: Provide agent controls and analysis tools
- **Height**: Flexible 400-600px
- **Content**: Agent controls (40%) + Audit trail (20%) + AI insights (30%)
- **Priority**: Medium - Accessible but not critical for quick decisions
- **Grid Areas**: `controls`, `trail`, `insights`

```css
.zone-controls { grid-area: controls; }
.zone-trail { grid-area: trail; }
.zone-insights { grid-area: insights; }
```

### Zone 5: Extended Analytics
**Purpose**: Detailed performance analysis and historical data
- **Height**: Auto (lazy loaded)
- **Content**: Performance comparison, historical metrics
- **Priority**: Low - Below the fold, contextual information
- **Grid Area**: `analytics`

```css
.zone-analytics {
  grid-area: analytics;
  min-height: 200px;
}
```

## Responsive Breakpoints

The layout adapts across three main breakpoints with smooth transitions:

### Desktop (≥1280px)
- **Layout**: Full 5-zone asymmetric grid
- **Zone 4**: 3-column asymmetric grid (2fr 1fr 1.5fr)
- **Spacing**: 24px gaps
- **All zones visible simultaneously**

```css
.dashboard-layout {
  grid-template-areas:
    "hero hero hero"
    "performance performance performance"
    "ai-layer ai-layer ai-layer"
    "controls trail insights"
    "analytics analytics analytics";
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 24px;
}
```

### Tablet (768px - 1279px)
- **Layout**: Modified grid with stacking
- **Zone 4**: Controls full-width, Trail + Insights side-by-side
- **Spacing**: 20px gaps
- **Maintains visual hierarchy**

```css
@media (min-width: 768px) and (max-width: 1279px) {
  .dashboard-layout {
    grid-template-areas:
      "hero hero"
      "performance performance"
      "ai-layer ai-layer"
      "controls controls"
      "trail insights"
      "analytics analytics";
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
```

### Mobile (<768px)
- **Layout**: Single column with tabs for Zone 4
- **Zone 4**: Tabbed interface (Controls | History | Insights)
- **Spacing**: 16px gaps
- **Optimized for touch interaction**

```css
@media (max-width: 767px) {
  .dashboard-layout {
    grid-template-areas:
      "hero"
      "performance"
      "ai-layer"
      "controls-tabs"
      "analytics";
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

## Design Tokens

### Spacing System (8px Grid)

All spacing follows an 8px grid system for consistency:

```typescript
spacing: {
  // Zone-level spacing
  zoneGap: '24px',        // 3 × 8px
  zoneGapMobile: '16px',  // 2 × 8px
  
  // Card-level spacing
  cardPadding: '24px',        // 3 × 8px
  cardPaddingMobile: '16px',  // 2 × 8px
  cardPaddingLarge: '32px',   // 4 × 8px
  
  // Component spacing
  componentGap: '16px',        // 2 × 8px
  componentGapSmall: '8px',    // 1 × 8px
  componentGapLarge: '32px',   // 4 × 8px
}
```

### Typography Hierarchy

```typescript
typography: {
  // Display sizes (largest)
  displayLarge: '48px',    // Hero titles
  displayMedium: '40px',   // Section titles
  displaySmall: '32px',    // Subsection titles
  
  // Metric sizes (special purpose)
  metricHero: '36px',      // Hero metrics (P&L, Win Rate)
  metricLarge: '28px',     // Important metrics
  metricMedium: '24px',    // Standard metrics
  
  // Heading sizes
  headingMedium: '24px',   // Hero status, important labels
  headingSmall: '20px',    // Component headers
  
  // Body sizes
  bodyMedium: '16px',      // Standard body text
  bodySmall: '14px',       // Secondary text, labels
}
```

### Color Hierarchy

```typescript
colors: {
  // Text hierarchy (importance-based)
  text: {
    primary: 'hsl(210, 40%, 98%)',    // Most important text
    secondary: 'hsl(215, 20%, 75%)',  // Secondary text
    tertiary: 'hsl(215, 20%, 65%)',   // Tertiary text
    quaternary: 'hsl(215, 20%, 45%)', // Least important text
  },
  
  // Status colors (semantic)
  status: {
    success: 'hsl(142, 76%, 36%)',    // Green - Success states
    warning: 'hsl(38, 92%, 50%)',     // Yellow - Warning states
    error: 'hsl(0, 84%, 60%)',        // Red - Error states
    info: 'hsl(217, 91%, 60%)',       // Blue - Info states
  },
  
  // Metric-specific colors
  metrics: {
    positive: 'hsl(142, 76%, 36%)',   // Green for gains
    negative: 'hsl(0, 84%, 60%)',     // Red for losses
    neutral: 'hsl(215, 20%, 65%)',    // Gray for neutral
    highlight: 'hsl(267, 84%, 65%)',  // Purple for highlights
  },
}
```

## CSS Grid System

### Main Dashboard Grid

The dashboard uses CSS Grid with named areas for semantic layout:

```css
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "hero hero hero"
    "performance performance performance"
    "ai-layer ai-layer ai-layer"
    "controls trail insights"
    "analytics analytics analytics";
  grid-template-columns: 2fr 1fr 1.5fr;
  grid-template-rows: 120px auto auto minmax(400px, 600px) auto;
  gap: 24px;
}
```

### Asymmetric Control Grid

Zone 4 uses an asymmetric grid that reflects real usage patterns:

```css
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr; /* 40% : 20% : 30% + gaps */
  gap: 24px;
}
```

**Rationale**: 
- Controls (2fr): Widest column for complex form elements
- Trail (1fr): Narrowest for compact list items
- Insights (1.5fr): Medium width for data visualization

### Grid Transitions

Smooth transitions between breakpoints prevent jarring layout shifts:

```css
.dashboard-layout {
  transition: 
    grid-template-columns 300ms cubic-bezier(0.25, 0.1, 0.25, 1),
    grid-template-rows 300ms cubic-bezier(0.25, 0.1, 0.25, 1),
    gap 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

## Component Architecture

### Zone Components

Each zone is implemented as a self-contained organism:

```
src/components/organisms/
├── HeroStatusBar.tsx           # Zone 1
├── PerformanceOverviewIntegrated.tsx  # Zone 2
├── AIIntelligenceLayer.tsx     # Zone 3
├── ResponsiveControlGrid.tsx   # Zone 4 wrapper
└── ExtendedAnalyticsZone.tsx   # Zone 5
```

### Error Boundaries

Each zone is wrapped in its own error boundary for graceful degradation:

```typescript
// Zone-specific error boundaries
import {
  HeroErrorBoundary,
  PerformanceErrorBoundary,
  AILayerErrorBoundary,
  ControlsErrorBoundary,
  AnalyticsErrorBoundary
} from '@/components/ui/zone-error-boundary';
```

### Responsive Components

Components adapt their internal layout based on available space:

```typescript
// Example: HeroStatusBar responsive behavior
@media (max-width: 767px) {
  .zone-hero {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .hero-metrics {
    flex-direction: row;
    justify-content: space-around;
  }
}
```

## Accessibility Features

### Semantic HTML Structure

```html
<main role="main" aria-label="Agent Dashboard">
  <section id="hero-section" aria-labelledby="hero-title">
    <h1 id="hero-title">Agent Status and Key Metrics</h1>
    <!-- Hero content -->
  </section>
  
  <section id="performance-section" aria-labelledby="performance-title">
    <h2 id="performance-title">Performance Overview</h2>
    <!-- Performance content -->
  </section>
  
  <!-- Additional sections... -->
</main>
```

### Keyboard Navigation

Logical tab order follows visual hierarchy:
1. Hero Status Bar → Pause/Resume → Settings
2. Performance Overview → Timeframe selector
3. AI Recommendations → Apply/Dismiss buttons
4. Control Grid → Form elements in reading order
5. Extended Analytics → Interactive elements

### ARIA Live Regions

Dynamic updates are announced to screen readers:

```typescript
// Announce metric changes
const { announce, LiveRegionComponent } = useAriaLiveRegion();

// Usage
announce('Portfolio optimized successfully', 'polite');
announce('Critical recommendation available', 'assertive');
```

### Skip Links

Allow keyboard users to jump to main sections:

```typescript
const { SkipLinksComponent } = useSkipLinks();

// Renders:
// Skip to main content
// Skip to agent controls  
// Skip to performance data
// Skip to recommendations
```

## Performance Optimizations

### Layout Containment

Each zone uses CSS containment to isolate layout calculations:

```css
.zone-hero,
.zone-performance,
.zone-ai-layer,
.zone-controls,
.zone-trail,
.zone-insights,
.zone-analytics {
  contain: layout style paint;
}
```

### GPU Acceleration

Animations use transform properties for GPU acceleration:

```css
.zone-animate-in {
  will-change: transform, opacity;
  animation: slideUpFadeIn 400ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Lazy Loading

Zone 5 (Extended Analytics) loads only when scrolled into view:

```typescript
const ExtendedAnalyticsZone = lazy(() => 
  import('@/components/organisms/ExtendedAnalyticsZone')
);

// Usage with intersection observer
{performance && performance.totalTrades > 0 && (
  <LazyLoad>
    <ExtendedAnalyticsZone performance={performance} />
  </LazyLoad>
)}
```

### Reduced Motion Support

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .dashboard-layout,
  .dashboard-layout > *,
  .zone-animate-in {
    animation: none;
    transition: none;
  }
}
```

## Code Comments Guide

### Complex Layout Logic Comments

Key areas that require detailed comments:

#### 1. Grid Template Areas

```css
/**
 * Dashboard Grid Layout
 * 
 * Desktop (≥1280px): 5-zone asymmetric layout
 * - Hero: Full width, fixed height (120px)
 * - Performance: Full width, flexible height (400-500px)  
 * - AI Layer: Full width, conditional (auto height)
 * - Control Grid: 3-column asymmetric (2fr 1fr 1.5fr)
 * - Analytics: Full width, lazy loaded
 * 
 * The asymmetric proportions in Zone 4 reflect usage patterns:
 * - Controls (40%): Needs space for form elements
 * - Trail (20%): Compact list, minimal width needed
 * - Insights (30%): Charts and data, medium width
 */
.dashboard-layout {
  grid-template-areas:
    "hero hero hero"
    "performance performance performance"  
    "ai-layer ai-layer ai-layer"
    "controls trail insights"
    "analytics analytics analytics";
  grid-template-columns: 2fr 1fr 1.5fr;
}
```

#### 2. Responsive Breakpoint Logic

```css
/**
 * Tablet Breakpoint (768px - 1279px)
 * 
 * Transforms Zone 4 from 3-column asymmetric to 2-row layout:
 * Row 1: Controls (full width) - Most important, gets priority
 * Row 2: Trail + Insights (50/50) - Secondary info, side-by-side
 * 
 * This maintains information hierarchy while adapting to narrower screens
 */
@media (min-width: 768px) and (max-width: 1279px) {
  .dashboard-layout {
    grid-template-areas:
      "hero hero"
      "performance performance"
      "ai-layer ai-layer"
      "controls controls"    /* Full width priority */
      "trail insights"       /* Equal split */
      "analytics analytics";
  }
}
```

#### 3. Animation Staggering

```css
/**
 * Staggered Zone Entrance Animation
 * 
 * Each zone animates in with 100ms delay to create a cascading effect
 * that guides the user's eye through the information hierarchy:
 * 
 * 1. Hero (0ms) - Immediate status visibility
 * 2. Performance (100ms) - Key metrics follow
 * 3. AI Layer (200ms) - Recommendations appear
 * 4. Controls (300ms) - Interactive elements
 * 5. Trail (400ms) - Historical context
 * 6. Insights (500ms) - Analysis tools
 * 7. Analytics (600ms) - Extended data
 */
.zone-hero { animation-delay: 0ms; }
.zone-performance { animation-delay: 100ms; }
.zone-ai-layer { animation-delay: 200ms; }
.zone-controls { animation-delay: 300ms; }
.zone-trail { animation-delay: 400ms; }
.zone-insights { animation-delay: 500ms; }
.zone-analytics { animation-delay: 600ms; }
```

#### 4. Conditional Zone Rendering

```typescript
/**
 * AI Intelligence Layer - Conditional Rendering
 * 
 * This zone only appears when AI recommendations are available.
 * The conditional rendering prevents empty space and maintains
 * visual flow when no recommendations exist.
 * 
 * CSS handles the transition smoothly:
 * - height: 0 when hidden
 * - auto height when visible
 * - 300ms transition for smooth appearance/disappearance
 */
{recommendations.length > 0 && (
  <motion.div variants={zoneVariants}>
    <AccessibleSection
      title="AI Recommendations"
      description="Intelligent recommendations from your AI trading agent"
      level={2}
      className="zone-ai-layer"
    >
      <AIIntelligenceLayer
        recommendations={recommendations}
        onApplyRecommendation={handleApplyRecommendation}
        onDismissRecommendation={handleDismissRecommendation}
        onRefresh={handleRefreshRecommendations}
        maxVisible={3}
      />
    </AccessibleSection>
  </motion.div>
)}
```

#### 5. Mobile Tab Implementation

```typescript
/**
 * Mobile Control Grid - Tab Interface
 * 
 * On mobile (<768px), Zone 4's 3-column layout becomes a tabbed interface.
 * This transformation maintains access to all functionality while optimizing
 * for touch interaction and limited screen space.
 * 
 * Tab order prioritizes most common actions:
 * 1. Controls - Primary interaction (pause, settings, strategy)
 * 2. AI Insights - Decision support information  
 * 3. History - Audit trail for reference
 * 
 * Each tab content is wrapped in ErrorBoundary for graceful degradation.
 */
{isMobile ? (
  <div className="zone-controls-tabs">
    <Tabs defaultValue="controls" className="w-full">
      <TabsList className="grid w-full grid-cols-3 glass-card">
        <TabsTrigger value="controls">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Controls</span>
        </TabsTrigger>
        {/* Additional tabs... */}
      </TabsList>
      {/* Tab content... */}
    </Tabs>
  </div>
) : (
  /* Desktop grid layout */
)}
```

### Performance Comment Examples

```typescript
/**
 * Grid Optimization Hook
 * 
 * Memoizes grid calculations to prevent unnecessary recalculations
 * on every render. Particularly important for:
 * - Window resize events (debounced to 150ms)
 * - Responsive breakpoint transitions
 * - Dynamic content changes
 */
const { getGridConfig } = useOptimizedGrid();

/**
 * CLS (Cumulative Layout Shift) Monitoring
 * 
 * Tracks layout stability to ensure smooth user experience.
 * Threshold: 0.1 (Google's "good" CLS score)
 * 
 * Common causes of layout shift in dashboard:
 * - Dynamic content loading (charts, recommendations)
 * - Font loading (FOUT/FOIT)
 * - Image loading without dimensions
 */
const { cls } = useCLSMonitoring((cls) => {
  if (cls > 0.1) {
    console.warn(`CLS threshold exceeded: ${cls}`);
  }
});
```

## Implementation Files

### Key Files and Their Purpose

```
src/
├── styles/
│   └── dashboard-layout.css      # Main layout CSS with grid system
├── lib/
│   └── designTokens.ts          # Centralized design system values
├── pages/
│   └── AgentDashboardPageRedesigned.tsx  # Main dashboard component
├── components/
│   ├── organisms/
│   │   ├── HeroStatusBar.tsx           # Zone 1 implementation
│   │   ├── PerformanceOverviewIntegrated.tsx  # Zone 2 implementation
│   │   ├── AIIntelligenceLayer.tsx     # Zone 3 implementation
│   │   ├── ResponsiveControlGrid.tsx   # Zone 4 responsive wrapper
│   │   └── ExtendedAnalyticsZone.tsx   # Zone 5 implementation
│   └── ui/
│       ├── zone-error-boundary.tsx     # Error boundaries for each zone
│       ├── accessible-components.tsx   # Accessibility utilities
│       └── layout-transition.tsx       # Smooth layout transitions
└── hooks/
    ├── useResponsiveLayout.ts          # Responsive breakpoint detection
    ├── useHeroStatusBar.ts            # Hero zone state management
    └── useScrollAnimation.ts          # Scroll-based animations
```

This documentation serves as a comprehensive guide for understanding, maintaining, and extending the dashboard layout system. Each section provides both high-level concepts and implementation details to support developers at all levels.