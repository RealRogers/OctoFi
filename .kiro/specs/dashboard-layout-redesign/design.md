# Design Document

## Overview

Este documento describe el rediseño del layout del Agent Dashboard, transformándolo de un diseño de grid uniforme a un sistema de jerarquía visual clara con agrupación inteligente de información. El diseño prioriza la escanabilidad, reduce el ruido visual y optimiza el uso del espacio vertical para que la información crítica sea inmediatamente visible.

### Design Principles

1. **Information Hierarchy First** - El tamaño, posición y contraste reflejan la importancia
2. **Progressive Disclosure** - Información crítica primero, detalles después
3. **Breathing Room** - Espaciado generoso para reducir carga cognitiva
4. **Asymmetric Balance** - Grid no uniforme que refleja prioridades reales
5. **Contextual Density** - Más denso en áreas de análisis, más espaciado en controles

## Architecture

### Layout Structure

El nuevo layout se organiza en 5 zonas principales con jerarquía clara:

```
┌─────────────────────────────────────────────────────────────┐
│ ZONE 1: Hero Status Bar (Fixed Height: 120px)              │
│ - Agent Status + Quick Actions + Key Metrics               │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 2: Performance Overview (Flexible: 400-500px)         │
│ - Chart + Asset Allocation + Timeframe Controls            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 3: AI Intelligence Layer (Conditional)                │
│ - Recommendations + Insights (only if present)             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 4: Control & Analysis Grid (Asymmetric 2:1:1.5)      │
│ - Agent Controls | Audit Trail | AI Insights              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ZONE 5: Extended Analytics (Below Fold)                    │
│ - Performance Comparison + Historical Data                 │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop Large (>1536px)**: Full asymmetric grid, all zones visible
- **Desktop (1280-1536px)**: Adjusted proportions, maintain structure
- **Tablet (768-1280px)**: 2-column layout, some stacking
- **Mobile (<768px)**: Single column + tabs for Zone 4

## Components and Interfaces

### Zone 1: Hero Status Bar

**Purpose**: Proporcionar visión instantánea del estado del agente y métricas críticas.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────┐
│  [●] Agent Active    [Pause] [Settings]     P&L: +$1,234.56 ↑  │
│  Conservative Strategy                       Win Rate: 67.8%    │
│  Last Action: 2m ago                         24h: +2.3%         │
└──────────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Height: 120px fixed
- Background: `glass-card` with subtle gradient overlay
- Agent status indicator: 16px pulsing dot + large text (24px)
- Metrics: Right-aligned, 32px font for values, 14px for labels
- Quick actions: Icon buttons, 40px size
- Spacing: 32px horizontal padding, 24px vertical

**Component Structure**:
```typescript
<HeroStatusBar>
  <AgentStatusSection>
    <StatusIndicator size="lg" />
    <StatusText />
    <StrategyBadge />
    <LastActionTimestamp />
  </AgentStatusSection>
  
  <QuickActionsSection>
    <PauseButton />
    <SettingsButton />
  </QuickActionsSection>
  
  <KeyMetricsSection>
    <MetricDisplay metric="profitLoss" size="lg" />
    <MetricDisplay metric="winRate" size="lg" />
    <MetricDisplay metric="change24h" size="md" />
  </KeyMetricsSection>
</HeroStatusBar>
```

**Interactions**:
- Hover on status: Show detailed tooltip with uptime, trades today
- Click pause: Immediate action with confirmation toast
- Metrics animate on update using CountUp

---

### Zone 2: Performance Overview

**Purpose**: Visualizar performance histórico y distribución de assets en una vista integrada.

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Performance                    [24h][7d][30d][All]        │
│  ┌──────────────────────────────────────┐  ┌────────────┐ │
│  │                                      │  │ Asset Mix  │ │
│  │         Chart Area                   │  │            │ │
│  │                                      │  │ ETH  45%   │ │
│  │                                      │  │ BTC  30%   │ │
│  └──────────────────────────────────────┘  │ USDC 15%   │ │
│                                            │ Other 10%  │ │
│                                            └────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Height: Flexible 400-500px based on content
- Chart: 70% width, asset allocation: 30% width
- Background: `glass-card-hover` for interactivity
- Timeframe buttons: Pill style, 32px height
- Chart padding: 24px all sides
- Asset allocation: Donut chart + list, 16px spacing

**Component Structure**:
```typescript
<PerformanceOverview>
  <PerformanceHeader>
    <Title>Performance</Title>
    <TimeframeSelector 
      options={['24h', '7d', '30d', 'all']}
      value={timeframe}
      onChange={setTimeframe}
    />
  </PerformanceHeader>
  
  <PerformanceContent>
    <ChartSection width="70%">
      <ResponsiveChart data={performanceData} />
    </ChartSection>
    
    <AssetAllocationSection width="30%">
      <DonutChart data={assetAllocation} />
      <AssetList data={assetAllocation} />
    </AssetAllocationSection>
  </PerformanceContent>
</PerformanceOverview>
```

**Interactions**:
- Hover on chart: Crosshair with tooltip showing exact values
- Click timeframe: Smooth transition with skeleton during load
- Hover on asset: Highlight corresponding chart segment

---

### Zone 3: AI Intelligence Layer

**Purpose**: Mostrar recomendaciones y alertas de AI cuando existan, sin ocupar espacio cuando no hay.

**Layout** (Conditional Rendering):
```
┌────────────────────────────────────────────────────────────┐
│  🤖 AI Recommendations                        [Refresh]    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ⚠️ HIGH  Consider reducing position size in ETH      │ │
│  │          Current exposure: 45% (recommended: <35%)   │ │
│  │          [Apply] [Dismiss]                           │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💡 MEDIUM Market volatility increasing               │ │
│  │           Consider switching to conservative mode    │ │
│  │           [Apply] [Dismiss]                          │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Height: Auto (0px if no recommendations)
- Max visible: 3 recommendations, rest in "View All" modal
- Priority colors: Critical (red), High (orange), Medium (yellow), Low (blue)
- Card spacing: 12px between recommendations
- Border-left: 4px solid priority color
- Animation: Slide down when new recommendation appears

**Component Structure**:
```typescript
<AIIntelligenceLayer>
  {recommendations.length > 0 && (
    <RecommendationsContainer>
      <Header>
        <Icon icon={Bot} />
        <Title>AI Recommendations</Title>
        <RefreshButton onClick={handleRefresh} />
      </Header>
      
      <RecommendationsList>
        {recommendations.slice(0, 3).map(rec => (
          <RecommendationCard
            key={rec.id}
            priority={rec.priority}
            message={rec.message}
            onApply={() => handleApply(rec)}
            onDismiss={() => handleDismiss(rec)}
          />
        ))}
      </RecommendationsList>
      
      {recommendations.length > 3 && (
        <ViewAllButton onClick={openModal} />
      )}
    </RecommendationsContainer>
  )}
</AIIntelligenceLayer>
```

**Interactions**:
- Click Apply: Execute recommendation with loading state + toast
- Click Dismiss: Fade out with animation
- Click Refresh: Pulse animation + fetch new recommendations

---

### Zone 4: Control & Analysis Grid

**Purpose**: Proporcionar acceso a controles del agente, historial de acciones e insights de mercado en un layout asimétrico que refleja uso.

**Layout** (Asymmetric Grid: 2fr : 1fr : 1.5fr):
```
┌──────────────────┬─────────────┬──────────────────┐
│ Agent Controls   │ Audit Trail │ AI Market        │
│                  │             │ Insights         │
│ [Strategy ▼]     │ 2m ago      │                  │
│ Conservative     │ Optimized   │ ETH/USDC         │
│                  │ portfolio   │                  │
│ Risk Limits      │             │ Confidence: 78%  │
│ Max Trade: $500  │ 5m ago      │                  │
│ Stop Loss: 5%    │ Rebalanced  │ Sentiment: 🟢    │
│                  │ to target   │                  │
│ [Optimize Now]   │             │ Volume: High     │
│ [Force Rebal.]   │ 15m ago     │                  │
│                  │ Executed    │ [View Details]   │
│                  │ swap        │                  │
└──────────────────┴─────────────┴──────────────────┘
```

**Design Specs**:
- Grid proportions: `2fr 1fr 1.5fr` (Controls: 40%, Trail: 20%, Insights: 30%, gaps: 10%)
- Min height: 400px, max height: 600px
- Each column: `glass-card` with independent scroll if needed
- Column padding: 24px
- Gap between columns: 24px

**Component Structure**:
```typescript
<ControlAnalysisGrid>
  <GridColumn span={2}>
    <AgentControls>
      <StrategySelector />
      <RiskLimitsSection />
      <ManualActionsSection />
    </AgentControls>
  </GridColumn>
  
  <GridColumn span={1}>
    <AgentAuditTrail
      maxVisible={8}
      showExport={true}
    />
  </GridColumn>
  
  <GridColumn span={1.5}>
    <AIInsightsPanel
      tokenPair={tokenPair}
      compact={true}
    />
  </GridColumn>
</ControlAnalysisGrid>
```

**Responsive Behavior**:
- Desktop (>1280px): 3 columns as shown
- Tablet (768-1280px): 2 columns (Controls full width top, Trail + Insights bottom)
- Mobile (<768px): Tabs (Controls | History | Insights)

---

### Zone 5: Extended Analytics

**Purpose**: Proporcionar análisis comparativo y datos históricos adicionales para usuarios que quieren profundizar.

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Performance Comparison                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Your Agent      ████████████████░░░░  78%            │ │
│  │ Market Average  ████████████░░░░░░░░  62%            │ │
│  │ Top 10%         ████████████████████░  92%            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Historical Metrics                                        │
│  ┌─────────────┬─────────────┬─────────────┬───────────┐ │
│  │ Total Trades│ Avg Trade   │ Best Trade  │ Worst     │ │
│  │ 156         │ $234.56     │ +$1,234     │ -$456     │ │
│  └─────────────┴─────────────┴─────────────┴───────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Position: Below fold (starts ~1200px from top)
- Background: Subtle `glass-card` with lower opacity (0.2)
- Comparison bars: Animated width on scroll into view
- Metrics grid: 4 equal columns
- Spacing: 32px between sections

---

## Data Models

### LayoutConfig

```typescript
interface LayoutConfig {
  zones: {
    hero: ZoneConfig
    performance: ZoneConfig
    aiLayer: ZoneConfig
    controlGrid: ZoneConfig
    analytics: ZoneConfig
  }
  breakpoints: {
    desktop: number
    tablet: number
    mobile: number
  }
  spacing: SpacingConfig
}

interface ZoneConfig {
  height: 'fixed' | 'flexible' | 'auto'
  minHeight?: number
  maxHeight?: number
  visible: boolean | 'conditional'
  order: number
}

interface SpacingConfig {
  zoneGap: number
  cardPadding: number
  gridGap: number
  sectionMargin: number
}
```

### GridSystem

```typescript
interface GridSystem {
  columns: number
  columnTemplate: string // e.g., "2fr 1fr 1.5fr"
  gap: number
  responsive: {
    [breakpoint: string]: GridSystem
  }
}

const controlGridSystem: GridSystem = {
  columns: 3,
  columnTemplate: "2fr 1fr 1.5fr",
  gap: 24,
  responsive: {
    tablet: {
      columns: 2,
      columnTemplate: "1fr 1fr",
      gap: 20
    },
    mobile: {
      columns: 1,
      columnTemplate: "1fr",
      gap: 16
    }
  }
}
```

## Error Handling

### Layout Failures

1. **Zone Rendering Errors**: Each zone wrapped in ErrorBoundary, falls back to minimal version
2. **Grid Calculation Errors**: Falls back to equal columns if asymmetric calculation fails
3. **Responsive Breakpoint Issues**: Uses mobile layout as ultimate fallback

### Content Overflow

1. **Long Text**: Truncate with ellipsis + tooltip
2. **Too Many Recommendations**: Show max 3, rest in modal
3. **Audit Trail Overflow**: Scroll within card, max height 600px
4. **Chart Data Overflow**: Auto-scale axes, show aggregated data for large datasets

## Testing Strategy

### Visual Regression Tests

1. **Snapshot Tests**: Capture each zone at all breakpoints
2. **Layout Shift Tests**: Measure CLS (Cumulative Layout Shift) < 0.1
3. **Animation Performance**: Ensure 60fps during transitions
4. **Responsive Behavior**: Test all breakpoint transitions

### User Testing Scenarios

1. **First Glance Test**: Can user identify agent status in <2 seconds?
2. **Critical Action Test**: Can user pause agent in <3 seconds?
3. **Information Scent Test**: Can user find specific metric in <5 seconds?
4. **Mobile Usability**: Can user complete key tasks on mobile?

### A/B Testing Metrics

- Time to first interaction
- Scroll depth before first action
- Number of clicks to complete common tasks
- User satisfaction score (before/after)
- Task completion rate

## Implementation Notes

### CSS Architecture

Use CSS Grid with named areas for semantic layout:

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

@media (max-width: 1280px) {
  .dashboard-layout {
    grid-template-areas:
      "hero hero"
      "performance performance"
      "ai-layer ai-layer"
      "controls controls"
      "trail insights"
      "analytics analytics";
    grid-template-columns: 1fr 1fr;
  }
}
```

### Animation Strategy

1. **Zone Entrance**: Stagger by 100ms, fade + slide up
2. **Metric Updates**: CountUp for numbers, color pulse for changes
3. **Layout Transitions**: CSS transitions for smooth responsive changes
4. **Micro-interactions**: Hover states, button presses, card lifts

### Performance Optimizations

1. **Lazy Load Zone 5**: Only render when scrolled into view
2. **Virtualize Audit Trail**: Only render visible items
3. **Memoize Grid Calculations**: Cache responsive breakpoint calculations
4. **Debounce Resize**: Prevent layout thrashing on window resize

## Accessibility Considerations

1. **Keyboard Navigation**: Logical tab order following visual hierarchy
2. **Screen Readers**: Semantic HTML with proper ARIA labels
3. **Focus Management**: Visible focus indicators, skip links
4. **Reduced Motion**: Respect `prefers-reduced-motion` for animations
5. **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)

## Design Tokens

```typescript
const designTokens = {
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
  breakpoints: {
    mobile: '768px',
    tablet: '1280px',
    desktop: '1536px'
  },
  animations: {
    staggerDelay: '100ms',
    transitionDuration: '300ms',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
}
```
