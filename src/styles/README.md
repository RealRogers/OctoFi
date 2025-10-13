# Dashboard Layout System

## Quick Reference

This directory contains the CSS files that implement the dashboard's responsive layout system.

## Files Overview

- **`dashboard-layout.css`** - Main layout system with CSS Grid and responsive breakpoints
- **`animations.css`** - Animation definitions and transitions
- **`color-system.css`** - Color hierarchy and theme definitions
- **`typography.css`** - Typography scale and text styling
- **`viewport-optimization.css`** - Performance optimizations and viewport handling

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ ZONE 1: Hero Status Bar (120px fixed)                      │
│ Agent Status + Quick Actions + Key Metrics                 │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 2: Performance Overview (400-500px flexible)          │
│ Chart (70%) + Asset Allocation (30%)                       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 3: AI Intelligence Layer (conditional)                │
│ Recommendations + Insights (only when present)             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 4: Control Grid (asymmetric 2:1:1.5)                 │
│ Controls (40%) | Trail (20%) | Insights (30%)             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 5: Extended Analytics (lazy loaded)                   │
│ Performance Comparison + Historical Data                   │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Breakpoints

| Breakpoint | Width | Layout | Zone 4 Behavior |
|------------|-------|--------|------------------|
| **Desktop** | ≥1280px | 5-zone grid | 3-column asymmetric (2fr 1fr 1.5fr) |
| **Tablet** | 768-1279px | Modified grid | Controls full-width, Trail+Insights 50/50 |
| **Mobile** | <768px | Single column | Tabbed interface |

## CSS Grid Template

### Desktop Layout
```css
grid-template-areas:
  "hero hero hero"
  "performance performance performance"
  "ai-layer ai-layer ai-layer"
  "controls trail insights"
  "analytics analytics analytics";
grid-template-columns: 2fr 1fr 1.5fr;
```

### Tablet Layout
```css
grid-template-areas:
  "hero hero"
  "performance performance"
  "ai-layer ai-layer"
  "controls controls"
  "trail insights"
  "analytics analytics";
grid-template-columns: 1fr 1fr;
```

### Mobile Layout
```css
grid-template-areas:
  "hero"
  "performance"
  "ai-layer"
  "controls-tabs"
  "analytics";
grid-template-columns: 1fr;
```

## Key CSS Classes

### Zone Classes
- `.zone-hero` - Hero status bar
- `.zone-performance` - Performance overview
- `.zone-ai-layer` - AI recommendations (conditional)
- `.zone-controls` - Agent controls
- `.zone-trail` - Audit trail
- `.zone-insights` - AI insights
- `.zone-analytics` - Extended analytics
- `.zone-controls-tabs` - Mobile tabbed interface

### Layout Classes
- `.dashboard-layout` - Main grid container
- `.grid-asymmetric` - Asymmetric 3-column grid
- `.zone-animate-in` - Entrance animation
- `.layout-transitioning` - Transition state

### Spacing Classes (8px Grid System)
- `.zone-gap` - 24px gap between zones
- `.card-padding` - 24px internal padding
- `.grid-gap` - 24px grid gaps
- `.component-gap` - 16px component spacing

## Animation System

Zones animate in with staggered delays:
- Hero: 0ms (immediate)
- Performance: 100ms
- AI Layer: 200ms
- Controls: 300ms
- Trail: 400ms
- Insights: 500ms
- Analytics: 600ms

## Performance Features

- **CSS Containment**: Each zone uses `contain: layout style paint`
- **GPU Acceleration**: Animations use `transform` properties
- **Lazy Loading**: Zone 5 loads only when scrolled into view
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Skip Links**: Jump to main sections
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Logical tab order
- **Focus Management**: Visible focus indicators

## Usage Examples

### Adding a New Zone
1. Define grid area in CSS:
```css
.zone-new-feature {
  grid-area: new-feature;
}
```

2. Update grid template:
```css
grid-template-areas:
  "hero hero hero"
  "new-feature new-feature new-feature"
  "performance performance performance"
  /* ... */;
```

3. Add animation delay:
```css
.zone-new-feature { animation-delay: 150ms; }
```

### Customizing Responsive Behavior
```css
@media (max-width: 1279px) {
  .zone-new-feature {
    /* Tablet-specific styles */
  }
}

@media (max-width: 767px) {
  .zone-new-feature {
    /* Mobile-specific styles */
  }
}
```

## Troubleshooting

### Common Issues

1. **Layout Shift**: Ensure min-heights are set for dynamic content
2. **Animation Performance**: Use `transform` instead of layout properties
3. **Mobile Scrolling**: Check for horizontal overflow on small screens
4. **Grid Gaps**: Verify gap values match design tokens

### Debug Tools

Development mode shows:
- Current CLS (Cumulative Layout Shift) score
- Reduced motion preference
- Mobile/tablet detection
- Grid calculation performance

## Related Files

- `src/lib/designTokens.ts` - Design system values
- `src/hooks/useResponsiveLayout.ts` - Responsive breakpoint detection
- `src/components/ui/layout-transition.tsx` - Smooth layout transitions
- `docs/LAYOUT_DOCUMENTATION.md` - Comprehensive documentation