# Design Document

## Overview

This design document outlines the refactoring strategy for the AgentDashboardPage component to address critical bugs, performance issues, and architectural concerns. The refactoring will improve code quality, maintainability, performance, and user experience while maintaining backward compatibility with existing features.

## Architecture

### Current Architecture Issues

```
AgentDashboardPage (Current - 450+ lines)
├── Multiple useEffect hooks with complex logic
├── Inline business logic mixed with presentation
├── Duplicated code for mobile/desktop layouts
├── Mock data generation in component
├── No separation of concerns
└── Weak error handling
```

### Proposed Architecture

```
AgentDashboardPage (Refactored - ~200 lines)
├── Custom Hooks (Business Logic)
│   ├── useAgentNotifications
│   ├── useRecommendations
│   ├── usePerformanceData
│   └── useAssetAllocation
├── Presentation Components
│   ├── DashboardHeader
│   ├── StatusCards
│   ├── PerformanceSection
│   ├── RecommendationsSection
│   └── ControlsSection
├── Utilities
│   ├── constants.ts
│   ├── validators.ts
│   └── formatters.ts
└── Services (Enhanced)
    ├── portfolioService (new)
    └── performanceService (enhanced)
```

## Components and Interfaces

### 1. Custom Hooks

#### useAgentNotifications Hook

```typescript
interface UseAgentNotificationsReturn {
  // No return value - handles side effects only
}

function useAgentNotifications(): void {
  // Subscribes to agent actions
  // Displays appropriate toasts
  // Cleans up subscriptions
}
```

**Purpose**: Encapsulate all toast notification logic
**Benefits**: 
- Separates notification logic from component
- Easier to test in isolation
- Reusable across other components

#### useRecommendations Hook

```typescript
interface UseRecommendationsOptions {
  strategy?: TradingStrategy
  performance?: PerformanceMetrics
}

interface UseRecommendationsReturn {
  recommendations: AIRecommendation[]
  isLoading: boolean
  error: Error | null
  applyRecommendation: (id: string) => Promise<void>
  dismissRecommendation: (id: string) => void
  refreshRecommendations: () => void
}

function useRecommendations(
  options: UseRecommendationsOptions
): UseRecommendationsReturn
```

**Purpose**: Manage AI recommendations state and actions
**Benefits**:
- Fixes broken recommendations logic
- Centralizes recommendation management
- Provides loading and error states

#### usePerformanceData Hook

```typescript
interface UsePerformanceDataOptions {
  timeframe: '24h' | '7d' | '30d' | 'all'
  isActive: boolean
}

interface UsePerformanceDataReturn {
  data: PerformanceDataPoint[]
  livePerformance: PerformanceMetrics | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

function usePerformanceData(
  options: UsePerformanceDataOptions
): UsePerformanceDataReturn
```

**Purpose**: Fetch and manage performance data with optimized polling
**Benefits**:
- Replaces mock data with real data
- Implements smart polling with visibility detection
- Provides proper loading/error states

#### useAssetAllocation Hook

```typescript
interface AssetAllocationItem {
  name: string
  value: number
  color: string
  balance: number
}

interface UseAssetAllocationReturn {
  allocation: AssetAllocationItem[]
  isLoading: boolean
  error: Error | null
  totalValue: number
}

function useAssetAllocation(): UseAssetAllocationReturn
```

**Purpose**: Fetch real portfolio allocation data
**Benefits**:
- Replaces hardcoded mock data
- Provides actual portfolio distribution
- Handles loading and error states

### 2. Enhanced Services

#### Portfolio Service (New)

```typescript
interface PortfolioService {
  getAssetAllocation(): Promise<AssetAllocationItem[]>
  getTotalValue(): Promise<number>
  getAssetHistory(asset: string, timeframe: string): Promise<HistoricalData[]>
}

class PortfolioServiceImpl implements PortfolioService {
  async getAssetAllocation(): Promise<AssetAllocationItem[]> {
    // Fetch from API or calculate from wallet balances
  }
  
  async getTotalValue(): Promise<number> {
    // Calculate total portfolio value
  }
  
  async getAssetHistory(asset: string, timeframe: string): Promise<HistoricalData[]> {
    // Fetch historical price data
  }
}

export const portfolioService = new PortfolioServiceImpl()
```

#### Performance Service (Enhanced)

```typescript
interface PerformanceService {
  getHistoricalPerformance(timeframe: string): Promise<PerformanceDataPoint[]>
  getCurrentMetrics(): Promise<PerformanceMetrics>
  subscribeToUpdates(callback: (metrics: PerformanceMetrics) => void): Subscription
}

// Enhanced with real data fetching instead of mock generation
```

### 3. Type Definitions

#### Action Types (Enhanced)

```typescript
// Replace 'any' types with proper interfaces

interface SwapActionData {
  type: 'optimization' | 'rebalancing' | 'standard'
  fromToken: string
  toToken: string
  amount: number
  executedPrice: number
}

interface PauseActionData {
  reason: string
  timestamp: number
}

interface StrategyChangeActionData {
  oldStrategy: TradingStrategy
  newStrategy: TradingStrategy
}

type AgentActionData = 
  | SwapActionData 
  | PauseActionData 
  | StrategyChangeActionData

interface AgentAction {
  type: 'swap' | 'pause' | 'resume' | 'strategy_change'
  result: 'success' | 'failure'
  data?: AgentActionData
  error?: string
  timestamp: number
}
```

#### Recommendation Action Types

```typescript
interface RecommendationAction {
  type: 'strategy_update' | 'pause_agent' | 'rebalance' | 'adjust_risk'
  payload: Record<string, unknown>
}

interface AIRecommendation {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'strategy' | 'risk' | 'opportunity' | 'warning'
  action?: RecommendationAction
  createdAt: number
  expiresAt?: number
}
```

### 4. Constants File

```typescript
// src/constants/dashboard.ts

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

export const POLLING_INTERVALS = {
  ACTIVE: 10000, // 10 seconds when agent is active
  INACTIVE: 30000, // 30 seconds when agent is inactive
  ERROR_BACKOFF_BASE: 5000, // 5 seconds base for exponential backoff
  ERROR_BACKOFF_MAX: 60000, // 1 minute max backoff
} as const

export const CACHE_TIMES = {
  STALE_TIME: 30000, // 30 seconds
  CACHE_TIME: 300000, // 5 minutes
} as const

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  XL: 1536,
} as const

export const TOAST_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
} as const
```

### 5. Validation Utilities

```typescript
// src/utils/validators.ts

export function isValidPerformanceData(data: unknown): data is PerformanceMetrics {
  if (!data || typeof data !== 'object') return false
  
  const metrics = data as Record<string, unknown>
  return (
    typeof metrics.totalProfitLoss === 'number' &&
    typeof metrics.winRate === 'number' &&
    typeof metrics.totalTrades === 'number' &&
    metrics.winRate >= 0 &&
    metrics.winRate <= 100
  )
}

export function isValidStrategy(strategy: unknown): strategy is TradingStrategy {
  if (!strategy || typeof strategy !== 'object') return false
  
  const strat = strategy as Record<string, unknown>
  return (
    typeof strat.riskTolerance === 'string' &&
    ['low', 'medium', 'high'].includes(strat.riskTolerance)
  )
}

export function validateRecommendation(rec: unknown): rec is AIRecommendation {
  if (!rec || typeof rec !== 'object') return false
  
  const recommendation = rec as Record<string, unknown>
  return (
    typeof recommendation.id === 'string' &&
    typeof recommendation.title === 'string' &&
    typeof recommendation.priority === 'string' &&
    ['low', 'medium', 'high', 'critical'].includes(recommendation.priority as string)
  )
}
```

## Data Models

### Performance Data Point (Enhanced)

```typescript
interface PerformanceDataPoint {
  timestamp: Date
  profitLoss: number
  trades: number
  winRate: number
  balance: number
  // New fields for real data
  volume?: number
  fees?: number
  slippage?: number
}
```

### Dashboard State

```typescript
interface DashboardState {
  timeframe: '24h' | '7d' | '30d' | 'all'
  isLoading: boolean
  error: Error | null
  lastUpdated: Date | null
}
```

## Error Handling

### Error Handling Strategy

```typescript
// Centralized error handler
function handleDashboardError(error: Error, context: string): void {
  console.error(`[Dashboard Error - ${context}]:`, error)
  
  // Log to error tracking service (e.g., Sentry)
  if (window.errorTracker) {
    window.errorTracker.captureException(error, {
      tags: { component: 'AgentDashboard', context }
    })
  }
  
  // Show user-friendly toast
  toast({
    title: 'Something went wrong',
    description: getUserFriendlyErrorMessage(error),
    variant: 'destructive',
  })
}

function getUserFriendlyErrorMessage(error: Error): string {
  if (error.message.includes('network')) {
    return 'Network connection issue. Please check your internet.'
  }
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }
  if (error.message.includes('unauthorized')) {
    return 'Session expired. Please log in again.'
  }
  return 'An unexpected error occurred. Please try again.'
}
```

### Error Boundaries

```typescript
// Wrap sections in error boundaries
<ErrorBoundary
  fallback={<DashboardErrorFallback />}
  onError={(error) => handleDashboardError(error, 'PerformanceChart')}
>
  <PerformanceChart {...props} />
</ErrorBoundary>
```

## Performance Optimizations

### Smart Polling with Page Visibility

```typescript
function useSmartPolling(
  queryKey: string[],
  queryFn: () => Promise<any>,
  options: {
    activeInterval: number
    inactiveInterval: number
    enabled: boolean
  }
) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  
  return useQuery({
    queryKey,
    queryFn,
    refetchInterval: isVisible ? options.activeInterval : options.inactiveInterval,
    enabled: options.enabled,
    staleTime: CACHE_TIMES.STALE_TIME,
    cacheTime: CACHE_TIMES.CACHE_TIME,
  })
}
```

### Memoization Strategy

```typescript
// Memoize expensive computations
const performanceData = useMemo(
  () => processPerformanceData(rawData, timeframe),
  [rawData, timeframe]
)

// Memoize callbacks passed to children
const handleApplyRecommendation = useCallback(
  async (recommendation: AIRecommendation) => {
    try {
      await applyRecommendation(recommendation.id)
      toast({ title: 'Recommendation applied successfully' })
    } catch (error) {
      handleDashboardError(error as Error, 'ApplyRecommendation')
    }
  },
  [applyRecommendation, toast]
)

// Memoize child components
const StatusCards = memo(StatusCardsComponent)
const PerformanceSection = memo(PerformanceSectionComponent)
```

### Code Splitting

```typescript
// Lazy load heavy components
const PerformanceChart = lazy(() => import('@/components/organisms/PerformanceChart'))
const AIRecommendationsCard = lazy(() => import('@/components/molecules/AIRecommendationsCard'))

// Use with Suspense
<Suspense fallback={<ChartSkeleton />}>
  <PerformanceChart {...props} />
</Suspense>
```

## Accessibility Improvements

### ARIA Attributes

```typescript
// Animated numbers with live regions
<AnimatedNumber
  value={profitLoss}
  aria-live="polite"
  aria-atomic="true"
  aria-label={`Total profit and loss: ${formatCurrency(profitLoss)}`}
/>

// Tooltips with proper labels
<Tooltip>
  <TooltipTrigger aria-label="More information about agent status">
    <Info className="w-3 h-3" />
  </TooltipTrigger>
  <TooltipContent role="tooltip">
    <p>Current operational status of your AI trading agent</p>
  </TooltipContent>
</Tooltip>

// Tabs with proper ARIA
<TabsList role="tablist" aria-label="Dashboard sections">
  <TabsTrigger
    value="controls"
    role="tab"
    aria-selected={activeTab === 'controls'}
    aria-controls="controls-panel"
  >
    Controls
  </TabsTrigger>
</TabsList>
```

### Keyboard Navigation

```typescript
// Ensure proper focus management
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
  }
  if (e.key === 'Enter' && e.target === applyButton) {
    handleApplyRecommendation()
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// Test custom hooks
describe('useRecommendations', () => {
  it('should fetch recommendations on mount', async () => {
    const { result } = renderHook(() => useRecommendations({ strategy, performance }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.recommendations).toHaveLength(3)
  })
  
  it('should handle errors gracefully', async () => {
    mockService.generateRecommendations.mockRejectedValue(new Error('API Error'))
    const { result } = renderHook(() => useRecommendations({ strategy, performance }))
    await waitFor(() => expect(result.current.error).toBeTruthy())
  })
})

// Test validators
describe('validators', () => {
  it('should validate performance data correctly', () => {
    expect(isValidPerformanceData({ totalProfitLoss: 100, winRate: 75, totalTrades: 10 })).toBe(true)
    expect(isValidPerformanceData({ totalProfitLoss: 'invalid' })).toBe(false)
  })
})
```

### Integration Tests

```typescript
describe('AgentDashboardPage', () => {
  it('should display loading state initially', () => {
    render(<AgentDashboardPage />)
    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(4)
  })
  
  it('should display performance data after loading', async () => {
    render(<AgentDashboardPage />)
    await waitFor(() => {
      expect(screen.getByText(/Total P&L/i)).toBeInTheDocument()
      expect(screen.getByText(/\$1,234\.56/)).toBeInTheDocument()
    })
  })
  
  it('should handle recommendation application', async () => {
    render(<AgentDashboardPage />)
    const applyButton = await screen.findByRole('button', { name: /apply/i })
    fireEvent.click(applyButton)
    await waitFor(() => {
      expect(screen.getByText(/applied successfully/i)).toBeInTheDocument()
    })
  })
})
```

## Migration Strategy

### Phase 1: Foundation (High Priority)
1. Create constants file
2. Create validation utilities
3. Add proper TypeScript types
4. Set up error handling infrastructure

### Phase 2: Custom Hooks (High Priority)
1. Extract useAgentNotifications
2. Extract useRecommendations (fix broken logic)
3. Extract usePerformanceData
4. Extract useAssetAllocation

### Phase 3: Services (Medium Priority)
1. Create portfolioService
2. Enhance performanceService
3. Replace mock data with real API calls
4. Implement caching strategy

### Phase 4: Optimizations (Medium Priority)
1. Implement smart polling
2. Add memoization
3. Implement code splitting
4. Add loading/error states

### Phase 5: Polish (Low Priority)
1. Enhance accessibility
2. Clean up unused code
3. Refactor duplicate code
4. Add comprehensive tests

## Backward Compatibility

All refactoring will maintain backward compatibility:
- Existing props and APIs remain unchanged
- Component behavior stays consistent
- Visual appearance remains the same
- No breaking changes to parent components

## Performance Metrics

### Target Improvements
- **Bundle Size**: Reduce by ~15KB through code cleanup
- **Initial Load**: Improve by 200ms through code splitting
- **Re-renders**: Reduce by 40% through memoization
- **Network Requests**: Reduce by 30% through smart polling
- **Memory Usage**: Reduce by 20% through proper cleanup

## Success Criteria

1. All 22 identified issues resolved
2. Test coverage above 80%
3. No TypeScript 'any' types
4. No console errors or warnings
5. Lighthouse performance score > 90
6. All accessibility audits passing
7. Bundle size reduced
8. User-facing functionality unchanged
