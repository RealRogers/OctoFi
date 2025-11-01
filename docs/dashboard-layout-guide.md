# Dashboard Layout Guide

## Overview

This guide documents the redesigned Agent Dashboard layout system, which transforms the original uniform grid into a hierarchical, zone-based layout that prioritizes information based on user needs and usage patterns.

## Layout Architecture

### Zone-Based Design

The dashboard is organized into 5 distinct zones, each with specific purposes and visual hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ ZONE 1: Hero Status Bar (120px fixed)                      │
│ Agent Status + Quick Actions + Key Metrics                 │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 2: Performance Overview (400-500px flexible)          │
│ Integrated Chart + Asset Allocation                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 3: AI Intelligence Layer (conditional)                │
│ AI Recommendations (only when present)                     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 4: Control & Analysis Grid (asymmetric 2:1:1.5)      │
│ Agent Controls | Audit Trail | AI Insights                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 5: Extended Analytics (below fold, lazy loaded)       │
│ Performance Comparison + Historical Metrics                │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Information Hierarchy First** - Size, position, and contrast reflect importance
2. **Progressive Disclosure** - Critical information first, details after
3. **Breathing Room** - Generous spacing reduces cognitive load
4. **Asymmetric Balance** - Non-uniform grid reflects real usage patterns
5. **Contextual Density** - Dense in analysis areas, spacious in controls

## Zone Documentation

### Zone 1: Hero Status Bar

**Purpose**: Instant overview of agent status and critical metrics

**Component**: `HeroStatusBar`
**Location**: `src/components/organisms/HeroStatusBar.tsx`

**Layout Structure**:
- **Left**: Agent status indicator, strategy badge, last action
- **Center**: Quick action buttons (Pause/Resume, Settings)
- **Right**: Key metrics (P&L, Win Rate, 24h Change)

**Responsive Behavior**:
- Desktop: Horizontal 3-section layout
- Mobile: Vertical stacked layout with centered alignment

**Key Features**:
- Pulsing status indicator for active agent
- Animated metrics with CountUp effects
- Tooltips with detailed uptime information
- Glass morphism with gradient overlay

### Zone 2: Performance Overview

**Purpose**: Integrated performance visualization and asset allocation

**Component**: `PerformanceOverviewIntegrated`
**Location**: `src/components/organisms/PerformanceOverviewIntegrated.tsx`

**Layout Structure**:
- **70% Width**: Performance chart with P&L/Balance toggle
- **30% Width**: Asset allocation donut chart + list

**Responsive Behavior**:
- Desktop: Side-by-side 70/30 layout
- Mobile: Stacked vertical layout

**Key Features**:
- Smooth timeframe transitions with skeleton loading
- Interactive asset allocation with hover effects
- Integrated chart controls
- Summary metrics in header

### Zone 3: AI Intelligence Layer

**Purpose**: Conditional display of AI recommendations

**Component**: `AIIntelligenceLayer`
**Location**: `src/components/organisms/AIIntelligenceLayer.tsx`

**Layout Structure**:
- Conditional rendering (height: 0 when no recommendations)
- Maximum 3 visible recommendations
- Priority-based color coding
- Expandable details

**Key Features**:
- Slide-down entrance animation
- Priority-based border colors (Critical: red, High: orange, etc.)
- Auto-applicable vs manual recommendations
- Refresh functionality with loading states

### Zone 4: Control & Analysis Grid

**Purpose**: Asymmetric grid for controls, audit trail, and insights

**Layout Structure**:
- **Desktop**: 2fr : 1fr : 1.5fr (40% : 20% : 30%)
- **Tablet**: 2-column with controls full-width
- **Mobile**: Tabs (Controls | Insights | History)

**Components**:
- `AgentControls` (40% width)
- `AgentAuditTrail` (20% width)  
- `AIInsightsPanel` (30% width)

**Key Features**:
- Asymmetric proportions reflect usage patterns
- Independent scrolling per column
- Custom scrollbars
- Smooth responsive transitions

### Zone 5: Extended Analytics

**Purpose**: Below-fold analytics with lazy loading

**Component**: `ExtendedAnalyticsZone`
**Location**: `src/components/organisms/ExtendedAnalyticsZone.tsx`

**Layout Structure**:
- Performance comparison with animated bars
- Historical metrics in 4-column grid
- Additional statistics row

**Key Features**:
- Lazy loading with Intersection Observer
- Skeleton loading states
- Animated entrance when scrolled into view
- Performance comparison vs benchmarks

## Responsive System

### Breakpoints

```typescript
export const breakpoints = {
  mobile: 768,    // <768px
  tablet: 1280,   // 768px - 1279px  
  desktop: 1536   // ≥1280px
};
```

### Grid Transformations

**Desktop (≥1280px)**:
```css
grid-template-columns: 2fr 1fr 1.5fr;
grid-template-areas:
  "hero hero hero"
  "performance performance performance"
  "ai-layer ai-layer ai-layer"
  "controls trail insights"
  "analytics analytics analytics";
```

**Tablet (768px - 1279px)**:
```css
grid-template-columns: 1fr 1fr;
grid-template-areas:
  "hero hero"
  "performance performance"
  "ai-layer ai-layer"
  "controls controls"
  "trail insights"
  "analytics analytics";
```

**Mobile (<768px)**:
```css
grid-template-columns: 1fr;
grid-template-areas:
  "hero"
  "performance"
  "ai-layer"
  "controls-tabs"
  "analytics";
```

## Component API

### HeroStatusBar

```typescript
interface HeroStatusBarProps {
  isActive: boolean;
  canExecuteTrades: boolean;
  strategy?: { riskTolerance: string };
  totalProfitLoss: number;
  winRate: number;
  change24h: number;
  lastAction?: { type: string; timestamp: Date };
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onSettings: () => void;
  className?: string;
}
```

### PerformanceOverviewIntegrated

```typescript
interface PerformanceOverviewIntegratedProps {
  data: PerformanceDataPoint[];
  assetAllocation: AssetAllocation[];
  timeframe: '24h' | '7d' | '30d' | 'all';
  onTimeframeChange: (timeframe: '24h' | '7d' | '30d' | 'all') => void;
  isLoading?: boolean;
  className?: string;
}
```

### AIIntelligenceLayer

```typescript
interface AIIntelligenceLayerProps {
  recommendations: AIRecommendation[];
  onApplyRecommendation: (recommendation: AIRecommendation) => Promise<void>;
  onDismissRecommendation: (recommendationId: string) => void;
  onRefresh?: () => void;
  maxVisible?: number;
  className?: string;
}
```

## Styling System

### Design Tokens

```typescript
export const designTokens = {
  spacing: {
    zoneGap: '24px',
    cardPadding: '24px',
    gridGap: '24px',
    sectionMargin: '32px'
  },
  heights: {
    heroBar: '120px',
    performanceMin: '400px',
    performanceMax: '500px',
    controlGridMin: '400px',
    controlGridMax: '600px'
  },
  animations: {
    staggerDelay: 100,
    transitionDuration: '300ms',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
};
```

### Glassmorphism Classes

```css
.glass-card {
  @apply bg-gray-800/30 backdrop-blur-xl border border-white/10;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card-hover {
  @apply glass-card transition-all duration-300;
  @apply hover:bg-gray-800/40 hover:border-white/20 hover:shadow-2xl;
}
```

## Performance Optimizations

### Core Web Vitals Targets

- **CLS < 0.1**: Cumulative Layout Shift
- **FCP < 1.5s**: First Contentful Paint
- **LCP < 2.5s**: Largest Contentful Paint
- **FID < 100ms**: First Input Delay

### Optimization Strategies

1. **Layout Stability**:
   - CSS containment for zone isolation
   - Reserved space for dynamic content
   - Skeleton loading with proper dimensions

2. **Animation Performance**:
   - GPU acceleration with `will-change`
   - CSS transforms instead of layout properties
   - Reduced motion support

3. **Loading Performance**:
   - Lazy loading for Zone 5
   - Component code splitting
   - Resource preloading

4. **Memory Management**:
   - Proper cleanup of observers and subscriptions
   - Memoized calculations
   - Efficient re-rendering

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: ARIA labels and live regions
- **Color Contrast**: 4.5:1 minimum ratio
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user preferences

### Navigation Patterns

**Tab Order**: Hero → Performance → AI Layer → Controls → Trail → Insights → Analytics

**Skip Links**:
- Alt+1: Skip to agent status
- Alt+2: Skip to performance overview  
- Alt+3: Skip to agent controls
- Alt+4: Skip to analytics

### Screen Reader Experience

**Announcements**:
- Agent status changes
- Trade executions
- Error notifications
- Loading states

**Descriptions**:
- Detailed metric explanations
- Context for interactive elements
- Progress indicators
- Form validation messages

## Error Handling

### Zone-Level Error Boundaries

Each zone has its own error boundary with appropriate fallbacks:

- **Hero Zone**: Minimal fallback to maintain layout
- **Performance Zone**: Detailed fallback with retry option
- **AI Layer**: Graceful degradation with refresh option
- **Controls Zone**: Fallback with manual refresh
- **Analytics Zone**: Optional zone, fails silently

### Content Overflow Handling

- **Text Truncation**: With tooltips for full content
- **Scrollable Containers**: Custom scrollbars and indicators
- **Expandable Content**: Auto-expand for long content
- **Empty States**: Contextual empty states with actions

## Testing Strategy

### Automated Tests

1. **First Glance Test**: Agent status identifiable in <2 seconds
2. **Critical Action Test**: Pause agent in <3 seconds
3. **Information Scent Test**: Find specific metric in <5 seconds
4. **Mobile Usability Test**: Complete tasks on mobile

### Performance Tests

1. **CLS Monitoring**: Real-time layout shift tracking
2. **FPS Monitoring**: Animation frame rate measurement
3. **Bundle Analysis**: JavaScript and CSS size analysis
4. **Memory Profiling**: Memory usage tracking

### Accessibility Tests

1. **Keyboard Navigation**: Tab order and shortcuts
2. **Screen Reader**: ARIA labels and announcements
3. **Color Contrast**: WCAG AA compliance
4. **Reduced Motion**: Animation preference respect

## Usage Examples

### Basic Implementation

```typescript
import AgentDashboardPageRedesigned from '@/pages/AgentDashboardPageRedesigned';

// Use the redesigned dashboard
<AgentDashboardPageRedesigned />
```

### Custom Zone Implementation

```typescript
import { HeroStatusBar } from '@/components/organisms/HeroStatusBar';
import { HeroErrorBoundary } from '@/components/ui/zone-error-boundary';

<HeroErrorBoundary>
  <HeroStatusBar
    isActive={isActive}
    canExecuteTrades={canExecuteTrades}
    // ... other props
  />
</HeroErrorBoundary>
```

### Performance Monitoring

```typescript
import { usePerformanceMonitoring } from '@/lib/performanceAuditUtils';

const { metrics, score } = usePerformanceMonitoring();

// metrics.cls, metrics.fps, etc.
// score: 0-100 performance score
```

## Migration Guide

### From Original Dashboard

1. **Replace imports**:
   ```typescript
   // Old
   import AgentDashboardPage from '@/pages/AgentDashboardPage';
   
   // New
   import AgentDashboardPageRedesigned from '@/pages/AgentDashboardPageRedesigned';
   ```

2. **Update CSS imports**:
   ```css
   @import './styles/dashboard-layout.css';
   ```

3. **Add design tokens**:
   ```typescript
   import { designTokens } from '@/lib/designTokens';
   ```

### Breaking Changes

- Layout structure completely changed
- Some component props may have changed
- CSS classes updated for new system
- Animation system replaced

### Backward Compatibility

The original `AgentDashboardPage.tsx` remains unchanged for backward compatibility. The new system is in `AgentDashboardPageRedesigned.tsx`.

## Development Tools

### Available in Development Console

```javascript
// Visual polish audit
window.visualPolish.runAudit()
window.visualPolish.generateReport(results)

// Performance audit
window.performanceAudit.runAudit()
window.performanceAudit.analyzeBundleSize()

// User testing
window.userTesting.runFirstGlanceTest()
window.userTesting.runCriticalActionTest()
```

### Testing Overlay

In development, a testing overlay shows:
- Current viewport dimensions
- Active breakpoint
- CLS score in real-time
- Reduced motion preference

## Troubleshooting

### Common Issues

**Layout Shifts**:
- Check for missing min-height/min-width
- Ensure skeleton loading matches content dimensions
- Verify CSS containment is applied

**Animation Performance**:
- Check for missing `will-change` properties
- Verify GPU acceleration is enabled
- Monitor frame rate in dev tools

**Responsive Issues**:
- Test at critical breakpoint boundaries (767px, 768px, 1279px, 1280px)
- Verify grid template changes correctly
- Check for horizontal overflow

**Accessibility Issues**:
- Test keyboard navigation path
- Verify ARIA labels are present
- Check color contrast ratios
- Test with screen reader

### Debug Commands

```javascript
// Check layout consistency
window.visualPolish.runAudit().summary.score

// Monitor performance
window.performanceAudit.monitor.getPerformanceScore()

// Test responsive behavior
window.userTesting.scenarios
```

## Performance Benchmarks

### Target Metrics

- **Lighthouse Performance**: >90
- **CLS**: <0.1
- **FCP**: <1.5s
- **LCP**: <2.5s
- **FPS**: >55fps
- **Bundle Size**: <500KB (JS), <100KB (CSS)

### Optimization Checklist

- [ ] All images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] JavaScript code split by route
- [ ] Unused CSS purged
- [ ] Resource hints added (preconnect, dns-prefetch)
- [ ] Service worker for caching
- [ ] Gzip/Brotli compression enabled

## Maintenance

### Regular Audits

Run these audits monthly:

1. **Visual Consistency**: `window.visualPolish.runAudit()`
2. **Performance**: `window.performanceAudit.runAudit()`
3. **Accessibility**: Manual testing with screen reader
4. **Responsive**: Test on real devices

### Code Quality

- Follow established design tokens
- Use provided utility functions
- Maintain error boundaries
- Document component changes
- Update tests when modifying layout

### Performance Monitoring

- Monitor CLS in production
- Track Core Web Vitals
- Set up performance budgets
- Alert on regressions

## Future Enhancements

### Planned Improvements

1. **Dynamic Zone Sizing**: Zones that adapt based on content
2. **Personalization**: User-customizable zone priorities
3. **Advanced Analytics**: More detailed performance insights
4. **Real-time Collaboration**: Multi-user dashboard features

### Extension Points

- **Custom Zones**: Add new zones to the layout
- **Theme System**: Dark/light mode support
- **Widget System**: Draggable/resizable components
- **Export System**: PDF/PNG dashboard exports

## Support

### Documentation

- **Design System**: `src/lib/designTokens.ts`
- **Component Library**: `src/components/organisms/`
- **Utility Functions**: `src/lib/`
- **Testing Tools**: `src/lib/*TestUtils.ts`

### Getting Help

1. Check this documentation first
2. Run development audit tools
3. Review component source code
4. Check browser dev tools for errors
5. Test with different viewport sizes

---

*Last updated: October 2025*
*Version: 1.0.0*