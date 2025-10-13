# Implementation Plan

- [x] 1. Create layout foundation and design tokens
  - Create src/styles/dashboard-layout.css with CSS Grid system and named areas
  - Define design tokens in src/lib/designTokens.ts for spacing, heights, breakpoints
  - Add responsive media queries for mobile, tablet, and desktop layouts
  - _Requirements: 1.1, 1.2, 5.1, 5.2, 5.3_

- [x] 2. Implement Zone 1: Hero Status Bar component
  - [x] 2.1 Create HeroStatusBar component structure
    - Write src/components/organisms/HeroStatusBar.tsx with three-section layout
    - Implement AgentStatusSection with large status indicator and strategy badge
    - Add QuickActionsSection with pause/settings buttons
    - Create KeyMetricsSection with P&L, Win Rate, and 24h change displays
    - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2, 7.3_

  - [x] 2.2 Style Hero Status Bar with glassmorphism
    - Apply glass-card styling with gradient overlay
    - Implement 120px fixed height with proper padding (32px horizontal, 24px vertical)
    - Add pulsing animation to active status indicator
    - Style metrics with 32px font for values, right-aligned layout
    - _Requirements: 1.1, 7.1, 7.2_

  - [x] 2.3 Add interactions and animations
    - Implement hover tooltips for status showing uptime and trades today
    - Add click handler for pause button with confirmation
    - Integrate AnimatedNumber for metric value updates
    - _Requirements: 7.1, 7.3, 8.2_

- [x] 3. Implement Zone 2: Performance Overview component
  - [x] 3.1 Create integrated performance layout
    - Write src/components/organisms/PerformanceOverviewIntegrated.tsx
    - Implement 70/30 split layout for chart and asset allocation
    - Add timeframe selector in header with pill-style buttons
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 3.2 Integrate chart with asset allocation
    - Position donut chart and asset list in 30% right column
    - Add hover interactions to highlight corresponding segments
    - Implement smooth transitions when changing timeframes
    - _Requirements: 9.1, 9.3, 9.4_

  - [x] 3.3 Add loading states and animations
    - Create skeleton loader that maintains layout structure
    - Implement fade-in animation when data loads
    - Add crosshair tooltip on chart hover
    - _Requirements: 9.4_

- [x] 4. Implement Zone 3: AI Intelligence Layer
  - [x] 4.1 Create conditional recommendations container
    - Write src/components/organisms/AIIntelligenceLayer.tsx with conditional rendering
    - Implement recommendation card with priority-based border colors
    - Add slide-down animation when new recommendations appear
    - Limit visible recommendations to 3 with "View All" button for more
    - _Requirements: 1.4, 2.3, 3.3_

  - [x] 4.2 Add recommendation interactions
    - Implement Apply button with loading state and toast notification
    - Add Dismiss button with fade-out animation
    - Create Refresh button with pulse animation
    - _Requirements: 2.3, 3.3_

- [-] 5. Implement Zone 4: Asymmetric Control Grid
  - [x] 5.1 Create asymmetric grid layout
    - Update AgentDashboardPage with CSS Grid using "2fr 1fr 1.5fr" columns
    - Set min-height 400px, max-height 600px for grid
    - Add 24px gap between columns
    - _Requirements: 2.1, 2.2, 5.1, 10.1, 10.2, 10.3_

  - [-] 5.2 Optimize AgentControls for wider column
    - Refactor AgentControls to use 40% width effectively
    - Group strategy selector, risk limits, and manual actions vertically
    - Add proper spacing between sections (24px)
    - _Requirements: 2.2, 8.1, 8.2, 8.3_

  - [x] 5.3 Optimize AgentAuditTrail for narrow column
    - Refactor AgentAuditTrail to compact 20% width layout
    - Limit visible items to 8 with scroll
    - Add export dropdown at top
    - _Requirements: 2.1, 2.2_

  - [x] 5.4 Optimize AIInsightsPanel for medium column
    - Update AIInsightsPanel with compact prop for 30% width
    - Adjust confidence breakdown layout for narrower space
    - Maintain readability with proper font sizes
    - _Requirements: 2.1, 2.2_

- [x] 6. Implement responsive grid transformations
  - [x] 6.1 Add tablet layout (768-1280px)
    - Implement 2-column grid with Controls full-width on top
    - Stack Audit Trail and Insights side-by-side below
    - Adjust column proportions to "1fr 1fr" for bottom row
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 6.2 Add mobile layout (<768px)
    - Replace grid with Tabs component for Controls, History, Insights
    - Ensure smooth tab transitions
    - Maintain content within each tab without horizontal scroll
    - _Requirements: 5.3, 5.4_

  - [x] 6.3 Add smooth breakpoint transitions
    - Implement CSS transitions for layout changes (300ms duration)
    - Prevent layout shift during transitions
    - Test resize behavior with debounced handler
    - _Requirements: 5.4_

- [x] 7. Implement Zone 5: Extended Analytics
  - [x] 7.1 Create PerformanceComparison component
    - Write src/components/molecules/PerformanceComparisonBars.tsx
    - Implement animated comparison bars with labels
    - Add "Your Agent", "Market Average", "Top 10%" comparisons
    - _Requirements: 2.1, 2.2_

  - [x] 7.2 Create Historical Metrics grid
    - Add 4-column grid for Total Trades, Avg Trade, Best Trade, Worst Trade
    - Style with subtle glass-card background (opacity 0.2)
    - Position below fold (starts ~1200px from top)
    - _Requirements: 2.1, 4.3_

  - [x] 7.3 Add lazy loading for Zone 5
    - Implement intersection observer to load Zone 5 only when scrolled into view
    - Add fade-in animation when zone becomes visible
    - _Requirements: 4.2, 4.3_

- [x] 8. Remove or relocate "About" section
  - [x] 8.1 Create collapsible info panel
    - Convert "About Your AI Trading Agent" to collapsible accordion
    - Position at bottom of page or in settings modal
    - Default to collapsed state
    - _Requirements: 4.1, 4.4, 6.1, 6.2_

  - [x] 8.2 Add contextual help tooltips
    - Extract key information from About section into tooltips
    - Add info icons next to relevant sections (Hero, Controls, etc.)
    - Implement on-demand help without taking permanent space
    - _Requirements: 6.3, 6.4_

- [x] 9. Optimize vertical space and scrolling
  - [x] 9.1 Ensure critical info above fold
    - Verify Hero Status Bar + Performance Overview fit in 1080p viewport (1920x1080)
    - Adjust heights if needed to maximize above-fold content
    - Test on common resolutions (1366x768, 1920x1080, 2560x1440)
    - _Requirements: 4.1, 4.2_

  - [x] 9.2 Implement scroll-based animations
    - Add fade-in animations for zones as they scroll into view
    - Implement scroll progress indicator for long pages
    - Add smooth scroll behavior for anchor links
    - _Requirements: 3.1, 3.2_

- [x] 10. Apply consistent spacing and visual hierarchy
  - [x] 10.1 Implement spacing system
    - Apply 24px gap between all zones
    - Use 24px padding inside all cards
    - Add 32px margin for major sections
    - Ensure consistent spacing across all breakpoints
    - _Requirements: 1.3, 6.1, 6.2_

  - [x] 10.2 Enhance visual hierarchy with typography
    - Use 24px font for Hero status text
    - Use 32px font for key metric values
    - Use 14px font for labels and secondary text
    - Implement proper font weights (semibold for values, medium for labels)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 10.3 Apply color hierarchy
    - Use high contrast (white/green/red) for critical information
    - Use medium contrast (gray-300) for secondary information
    - Use low contrast (gray-500) for tertiary information
    - Ensure WCAG AA compliance (4.5:1 contrast ratio minimum)
    - _Requirements: 1.2, 1.3, 6.1_

- [x] 11. Implement error boundaries and fallbacks
  - [x] 11.1 Add zone-level error boundaries
    - Wrap each zone in ErrorBoundary component
    - Create minimal fallback UI for each zone type
    - Log errors without breaking entire dashboard
    - _Requirements: 1.4, 2.4_

  - [x] 11.2 Add content overflow handling
    - Implement text truncation with ellipsis + tooltip for long text
    - Add scroll within cards when content exceeds max height
    - Handle empty states gracefully with EmptyState component
    - _Requirements: 6.2, 6.3_

- [x] 12. Performance optimization
  - [x] 12.1 Optimize grid calculations
    - Memoize responsive breakpoint calculations
    - Cache grid template strings
    - Debounce window resize handler (150ms)
    - _Requirements: 5.4_

  - [x] 12.2 Optimize animations
    - Ensure all animations run at 60fps
    - Use CSS transforms instead of layout properties
    - Implement will-change hints for animated elements
    - Add cleanup for framer-motion animations
    - _Requirements: 1.4, 3.1_

  - [x] 12.3 Measure and optimize layout shift
    - Measure CLS (Cumulative Layout Shift) and ensure < 0.1
    - Reserve space for dynamic content with min-heights
    - Prevent layout shift during image/chart loading
    - _Requirements: 4.2, 4.3_

- [x] 13. Accessibility enhancements
  - [x] 13.1 Implement keyboard navigation
    - Ensure logical tab order following visual hierarchy (Hero → Performance → AI Layer → Controls → Trail → Insights)
    - Add skip links for main sections
    - Implement visible focus indicators with 2px outline
    - _Requirements: 3.1, 3.2_

  - [x] 13.2 Add ARIA labels and semantic HTML
    - Use semantic HTML5 elements (header, main, section, aside)
    - Add ARIA labels for all interactive elements
    - Implement ARIA live regions for dynamic updates (metrics, recommendations)
    - _Requirements: 6.4_

  - [x] 13.3 Support reduced motion preference
    - Detect prefers-reduced-motion media query
    - Disable entrance animations when reduced motion is preferred
    - Keep essential feedback animations (loading states)
    - _Requirements: 1.4, 3.4_

- [x] 14. Integration and testing
  - [x] 14.1 Integrate all zones into AgentDashboardPage
    - Replace current layout with new zone-based structure
    - Connect all data flows and state management
    - Ensure proper component composition
    - Test all interactions work together smoothly
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 14.2 Test responsive behavior
    - Test all breakpoint transitions (mobile, tablet, desktop)
    - Verify layout integrity at edge cases (767px, 768px, 1279px, 1280px)
    - Test orientation changes on mobile devices
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 14.3 Conduct user testing
    - Run "First Glance Test" - can user identify agent status in <2 seconds?
    - Run "Critical Action Test" - can user pause agent in <3 seconds?
    - Run "Information Scent Test" - can user find specific metric in <5 seconds?
    - Collect feedback and iterate on pain points
    - _Requirements: 1.1, 3.1, 3.2, 4.1_

  - [ ]* 14.4 Write component tests
    - Create tests for HeroStatusBar component
    - Test PerformanceOverviewIntegrated component
    - Test AIIntelligenceLayer conditional rendering
    - Test responsive grid transformations
    - Test accessibility features (keyboard nav, ARIA labels)
    - _Requirements: 1.1, 2.1, 5.1, 9.1_

- [-] 15. Final polish and documentation
  - [x] 15.1 Visual polish pass
    - Review all glassmorphism effects for consistency
    - Verify all animations are smooth and purposeful
    - Check color contrast ratios meet WCAG AA
    - Ensure consistent border-radius and shadows
    - _Requirements: 1.3, 6.1, 6.2_

  - [x] 15.2 Performance audit
    - Run Lighthouse audit and achieve >90 performance score
    - Measure First Contentful Paint (FCP) < 1.5s
    - Measure Largest Contentful Paint (LCP) < 2.5s
    - Measure Cumulative Layout Shift (CLS) < 0.1
    - _Requirements: 4.2, 4.3_

  - [x] 15.3 Create layout documentation
    - Document zone structure and purpose
    - Document responsive breakpoints and behavior
    - Document design tokens and spacing system
    - Add comments in code for complex layout logic
    - _Requirements: 1.1, 5.1, 10.1_
