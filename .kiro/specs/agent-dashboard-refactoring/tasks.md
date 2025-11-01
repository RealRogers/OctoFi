# Implementation Plan

- [x] 1. Set up foundation and infrastructure
  - [x] 1.1 Create constants file with animation delays, polling intervals, and breakpoints
    - Write src/constants/dashboard.ts with all magic numbers as named constants
    - Export ANIMATION_DELAYS, POLLING_INTERVALS, CACHE_TIMES, BREAKPOINTS, TOAST_DURATIONS
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 1.2 Create validation utilities
    - Write src/utils/validators.ts with type guard functions
    - Implement isValidPerformanceData, isValidStrategy, validateRecommendation functions
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 1.3 Define proper TypeScript interfaces for action types
    - Update src/services/types.ts with SwapActionData, PauseActionData, StrategyChangeActionData
    - Create discriminated union type for AgentActionData
    - Remove all 'any' types from action handling
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 1.4 Create centralized error handling utilities
    - Write src/utils/errorHandling.ts with handleDashboardError and getUserFriendlyErrorMessage
    - Implement error logging and user-friendly error messages
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Extract business logic to custom hooks
  - [x] 2.1 Create useAgentNotifications hook
    - Write src/hooks/useAgentNotifications.ts to encapsulate toast notification logic
    - Subscribe to tradingAgentService actions and display appropriate toasts
    - Handle all action types with proper TypeScript types
    - _Requirements: 5.1, 7.1, 7.2_

  - [x] 2.2 Create useRecommendations hook
    - Write src/hooks/useRecommendations.ts to manage recommendations state
    - Fix broken recommendations generation logic from original component
    - Implement applyRecommendation, dismissRecommendation, and refreshRecommendations functions
    - Add proper error handling with try-catch and toast notifications
    - Include all dependencies in useEffect dependency array
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 5.2_

  - [x] 2.3 Create usePerformanceData hook with smart polling
    - Write src/hooks/usePerformanceData.ts to fetch real performance data
    - Implement Page Visibility API to pause polling when tab is inactive
    - Add exponential backoff for error handling
    - Configure React Query with proper staleTime and cacheTime
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 11.1, 11.2, 11.3, 11.4, 5.3_

  - [x] 2.4 Create useAssetAllocation hook
    - Write src/hooks/useAssetAllocation.ts to fetch real portfolio data
    - Replace hardcoded mock asset allocation with API calls
    - Add loading and error states
    - _Requirements: 3.1, 3.2, 3.4, 5.4_

- [x] 3. Create and enhance services
  - [x] 3.1 Create portfolioService for asset allocation
    - Write src/services/portfolioService.ts with getAssetAllocation and getTotalValue methods
    - Implement API calls to fetch real portfolio data
    - Add error handling and data transformation
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 3.2 Enhance performanceService to return real data
    - Update src/services/performanceService.ts to fetch historical data from API
    - Remove mock data generation logic
    - Implement getHistoricalPerformance and getCurrentMetrics methods
    - _Requirements: 3.3, 3.4_

- [x] 4. Refactor AgentDashboardPage component
  - [x] 4.1 Replace inline logic with custom hooks
    - Import and use useAgentNotifications, useRecommendations, usePerformanceData, useAssetAllocation
    - Remove all inline useEffect hooks for notifications and recommendations
    - Remove mock data generation code
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 1.1, 3.1, 3.3_

  - [x] 4.2 Implement proper error handling in event handlers
    - Update handleApplyRecommendation to catch errors and show toast notifications
    - Add try-catch blocks to all async operations
    - Use centralized error handling utility
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.3 Add loading and error states to UI
    - Destructure isLoading and error from useQuery and custom hooks
    - Display skeleton loaders when isLoading is true
    - Show error messages with retry buttons when errors occur
    - Implement smooth transitions from loading to loaded states
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 4.4 Memoize callbacks and computed values
    - Wrap handleApplyRecommendation, handleDismissRecommendation, handleRefreshRecommendations with useCallback
    - Ensure all dependencies are properly listed
    - Verify performanceData and assetAllocation are already memoized
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 4.5 Replace magic numbers with constants
    - Import constants from src/constants/dashboard.ts
    - Replace all hardcoded animation delays with ANIMATION_DELAYS constants
    - Replace polling interval with POLLING_INTERVALS.ACTIVE
    - Replace breakpoint value with BREAKPOINTS.DESKTOP
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 4.6 Refactor duplicate AIInsightsPanel code
    - Extract AIInsightsPanel rendering logic to a separate component or function
    - Use single instance with conditional props instead of duplicating code
    - Maintain mobile and desktop layout differences through props
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 4.7 Clean up unused imports and code
    - Remove unused Button import
    - Remove unused icon imports (CheckCircle, XCircle, AlertTriangle)
    - Verify all remaining imports are used
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 5. Implement consistent empty states
  - [x] 5.1 Add empty state for recommendations section
    - Display empty state component when recommendations array is empty
    - Show message explaining why no recommendations are available
    - Include refresh button as call-to-action
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 5.2 Add empty state for performance comparison
    - Display empty state when performance.totalTrades is 0
    - Explain that data will appear after first trade
    - Maintain consistent styling with other empty states
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 6. Enhance accessibility
  - [x] 6.1 Add ARIA attributes to animated numbers
    - Add aria-live="polite" to AnimatedNumber components
    - Add aria-atomic="true" for complete announcements
    - Add descriptive aria-label attributes
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 6.2 Add ARIA attributes to tooltips and tabs
    - Add aria-label to tooltip triggers
    - Add role="tooltip" to tooltip content
    - Add aria-selected to tab triggers
    - Add aria-controls to link tabs with panels
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 6.3 Implement proper focus management
    - Ensure keyboard navigation works for all interactive elements
    - Add visible focus indicators
    - Test tab order is logical
    - _Requirements: 10.4_

- [x] 7. Optimize React Query configuration
  - [x] 7.1 Configure cache strategy for performance query
    - Add staleTime: CACHE_TIMES.STALE_TIME to useQuery config
    - Add cacheTime: CACHE_TIMES.CACHE_TIME to useQuery config
    - Verify cache persists across page navigation
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 7.2 Implement smart polling with visibility detection
    - Use Page Visibility API in usePerformanceData hook
    - Adjust refetchInterval based on document.hidden state
    - Reduce polling frequency when agent is inactive
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Add data validation guards
  - [x] 8.1 Validate performance data before rendering
    - Use isValidPerformanceData validator before accessing performance properties
    - Provide default values or empty states for invalid data
    - Log warnings when validation fails
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 8.2 Add null checks and optional chaining
    - Replace direct property access with optional chaining (?.)
    - Use nullish coalescing (??) for default values
    - Ensure no runtime errors from undefined/null values
    - _Requirements: 14.3, 14.4_

- [x] 9. Create responsive style utilities
  - [x] 9.1 Extract repeated responsive styles to CSS classes
    - Create utility classes for mobile text sizes and padding
    - Replace inline conditional className logic with CSS classes
    - Maintain existing responsive behavior
    - _Requirements: 12.2, 12.3, 12.4_

- [ ]* 10. Testing and validation
  - [ ]* 10.1 Write unit tests for custom hooks
    - Test useAgentNotifications subscription and cleanup
    - Test useRecommendations state management and error handling
    - Test usePerformanceData polling and caching
    - Test useAssetAllocation data fetching
    - _Requirements: 1.1, 2.1, 4.1, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 10.2 Write unit tests for validators and utilities
    - Test isValidPerformanceData with valid and invalid inputs
    - Test isValidStrategy with edge cases
    - Test error handling utilities
    - _Requirements: 7.1, 14.1_

  - [ ]* 10.3 Write integration tests for AgentDashboardPage
    - Test loading states display correctly
    - Test error states show appropriate messages
    - Test recommendation application flow
    - Test responsive layout switching
    - _Requirements: 6.1, 6.2, 9.1, 12.1_

  - [ ]* 10.4 Perform accessibility audit
    - Run axe-core or similar accessibility testing tool
    - Verify all ARIA attributes are correct
    - Test keyboard navigation
    - Test screen reader compatibility
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 11. Performance optimization and verification
  - [x] 11.1 Verify memoization is working correctly
    - Use React DevTools Profiler to check re-render frequency
    - Ensure child components don't re-render unnecessarily
    - Verify callbacks maintain referential equality
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 11.2 Measure and optimize bundle size
    - Run bundle analyzer to identify large dependencies
    - Verify unused code has been removed
    - Check that tree-shaking is working correctly
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 11.3 Test polling behavior
    - Verify polling pauses when tab is inactive
    - Verify polling resumes when tab becomes active
    - Test exponential backoff on errors
    - Monitor network requests in DevTools
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 12. Final integration and cleanup
  - [x] 12.1 Run TypeScript compiler and fix any type errors
    - Ensure no 'any' types remain
    - Fix all type errors and warnings
    - Verify strict mode compliance
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 12.2 Run linter and fix code style issues
    - Fix ESLint warnings and errors
    - Ensure consistent code formatting
    - Remove console.log statements (except error logging)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 12.3 Verify all functionality works end-to-end
    - Test all user interactions manually
    - Verify no regressions in existing features
    - Test on different screen sizes
    - Test with different data states (empty, loading, error, success)
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 9.1, 12.4_

  - [x] 12.4 Update documentation and comments
    - Add JSDoc comments to custom hooks
    - Document complex logic and edge cases
    - Update README if necessary
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
