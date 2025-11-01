# Implementation Plan

- [x] 1. Set up core infrastructure and types
  - Create type definitions for staking domain
  - Set up constants and configuration
  - Create utility functions for calculations and formatting
  - _Requirements: All requirements depend on proper type definitions_

- [x] 1.1 Create staking type definitions
  - Write `src/types/staking.ts` with all interfaces (StakingPool, StakingPosition, StakingTransaction, etc.)
  - Include blockchain-related types (contract interfaces, transaction types)
  - Add AI prediction types (APYPrediction, SentimentAnalysis, RiskAssessment)
  - _Requirements: 1.1, 2.1, 3.1, 12.1, 22.1_

- [x] 1.2 Create staking constants
  - Write `src/lib/stakingConstants.ts` with network config, contract addresses, query config
  - Define Somnia Testnet configuration (Chain ID 997, RPC URL)
  - Add error and success message constants
  - Define UI configuration constants
  - _Requirements: 23.1, 24.1_

- [x] 1.3 Create staking utility functions
  - Write `src/lib/stakingUtils.ts` with formatting, calculation, and helper functions
  - Implement token amount formatting and parsing
  - Implement APY and rewards calculations
  - Implement time remaining and fee calculations
  - Add address shortening and explorer URL generation
  - _Requirements: 16.2, 20.3, 25.2, 28.2, 29.2, 30.2_

- [x] 1.4 Create validation schemas
  - Write `src/lib/stakingValidators.ts` with Zod schemas
  - Create stake validation schema with dynamic validators
  - Create withdraw validation schema with lock period checks
  - Create network and address validation schemas
  - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 24.1_

- [x] 2. Implement blockchain services layer
  - Create services for blockchain interactions
  - Implement contract communication with ethers.js
  - Set up error handling for blockchain operations
  - _Requirements: 2.1, 3.1, 5.1, 6.3, 23.1, 23.3_

- [x] 2.1 Create blockchain service
  - Write `src/services/blockchainService.ts` for wallet and network operations
  - Implement wallet connection and disconnection
  - Implement network switching and validation
  - Implement token balance and info queries
  - Add event listeners for account and chain changes
  - _Requirements: 23.1, 23.2, 23.3, 24.1, 24.2, 24.3_

- [x] 2.2 Create staking service
  - Write `src/services/stakingService.ts` for contract interactions
  - Implement pool query functions (getPool, getAllPools, getPoolAPY, getPoolTVL)
  - Implement user position queries (getUserPosition, getUserPositions, getUserRewards)
  - Implement transaction functions (approveToken, stake, withdraw, claimRewards)
  - Implement utility functions (checkAllowance, estimateGas, waitForTransaction)
  - Add comprehensive error handling with StakingError class
  - _Requirements: 2.1, 3.1, 5.1, 6.3, 12.1, 13.1_

- [x] 2.3 Create pool service
  - Write `src/services/poolService.ts` for pool data management
  - Implement pool data fetching with caching
  - Implement historical APY data retrieval
  - Implement pool statistics calculation
  - Add cache management for performance
  - _Requirements: 12.1, 12.2, 14.2, 21.2_

- [x] 2.4 Create rewards service
  - Write `src/services/rewardsService.ts` for reward calculations
  - Implement current rewards calculation
  - Implement projected rewards calculation
  - Implement APY calculation from reward rate
  - Implement rewards history retrieval
  - _Requirements: 13.2, 16.2, 16.3_

- [x] 2.5 Create AI prediction service
  - Write `src/services/aiPredictionService.ts` with Vertex AI placeholders
  - Implement APY prediction with fallback logic
  - Implement market sentiment analysis
  - Implement risk assessment
  - Add fallback predictions when AI unavailable
  - _Requirements: 22.1, 22.2, 22.4, 22.5_

- [x] 3. Implement data layer with TanStack Query hooks
  - Create custom hooks for data fetching and mutations
  - Set up query keys and caching strategies
  - Implement optimistic updates
  - _Requirements: 12.1, 13.1, 13.3, 15.1_

- [x] 3.1 Create useStakingPools hook
  - Write `src/hooks/useStakingPools.ts` for pool data management
  - Implement pool fetching with TanStack Query
  - Implement AI predictions fetching
  - Add filtering logic (search, APY range, TVL range, lock period)
  - Add sorting logic (APY, TVL, name)
  - _Requirements: 12.1, 12.2, 17.1, 17.2, 18.1, 19.1, 22.1_

- [x] 3.2 Create useStakingPositions hook
  - Write `src/hooks/useStakingPositions.ts` for user positions
  - Implement position fetching with auto-refresh
  - Set up 30-second refetch interval for rewards updates
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 3.3 Create useStakingTransactions hook
  - Write `src/hooks/useStakingTransactions.ts` for transaction history
  - Implement transaction fetching from blockchain events
  - Add pagination support
  - _Requirements: 15.1, 15.2_

- [x] 3.4 Create useWalletBalance hook
  - Write `src/hooks/useWalletBalance.ts` for token balances
  - Implement balance fetching with frequent updates
  - Include USD value calculation
  - _Requirements: 7.1, 7.5_

- [x] 3.5 Create mutation hooks
  - Write `src/hooks/useStakeMutation.ts` for stake operations
  - Write `src/hooks/useWithdrawMutation.ts` for withdraw operations
  - Write `src/hooks/useClaimMutation.ts` for claim operations
  - Write `src/hooks/useApproveMutation.ts` for token approvals
  - Implement query invalidation on success
  - Add optimistic updates where appropriate
  - _Requirements: 2.3, 3.3, 5.3, 6.3_

- [x] 3.6 Create main useStaking hook
  - Write `src/hooks/useStaking.ts` as orchestration hook
  - Combine pools, positions, and stats queries
  - Provide unified interface for all staking operations
  - Implement stake, withdraw, and claim actions with approval checks
  - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1_

- [-] 4. Create modal components for user actions
  - Build interactive modals for stake, withdraw, and claim
  - Implement form handling with React Hook Form
  - Add real-time validation and preview
  - _Requirements: 1.1, 4.1, 6.1, 25.1_

- [x] 4.1 Create StakeModal component
  - Write `src/components/molecules/StakeModal.tsx`
  - Implement pool information display
  - Add amount input with balance display and max button
  - Implement real-time validation with Zod
  - Add transaction preview section (estimated rewards, fees, gas)
  - Implement two-step flow: Approve → Stake
  - Add loading states for approval and staking
  - Show success/error feedback with transaction hash
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 7.1, 7.2, 7.3, 8.1, 8.2, 25.1, 25.2, 28.1_

- [x] 4.2 Create WithdrawModal component
  - Write `src/components/molecules/WithdrawModal.tsx`
  - Display position details and staked amount
  - Add amount input with max button
  - Implement lock period validation and warning
  - Add preview section showing fees and lost rewards
  - Implement confirmation step
  - Add loading states and success/error feedback
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 29.2, 30.3_

- [x] 4.3 Create ClaimModal component
  - Write `src/components/molecules/ClaimModal.tsx`
  - Display rewards amount in tokens and USD
  - Show gas cost estimation
  - Calculate and display net amount after fees
  - Add confirmation button with loading state
  - Show success feedback with updated balance
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 28.1, 28.2_

- [x] 4.4 Create TransactionPreview component
  - Write `src/components/molecules/TransactionPreview.tsx`
  - Display action type, amount, and fees breakdown
  - Show gas cost estimation
  - Calculate and display net amount
  - Add warnings for high fees or risks
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 28.1, 28.2_

- [x] 5. Create utility components
  - Build reusable components for common UI patterns
  - Implement calculator, filters, and empty states
  - _Requirements: 10.1, 16.1, 17.1, 18.1_

- [ ]* 5.1 Create RewardsCalculator component
  - Write `src/components/molecules/RewardsCalculator.tsx`
  - Add inputs for amount, pool selection, and time period
  - Implement real-time calculation of estimated rewards
  - Display results in tokens and USD
  - Show comparison between current and predicted APY
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 5.2 Create PoolFilters component
  - Write `src/components/molecules/PoolFilters.tsx`
  - Add search input for pool name/symbol
  - Add APY range slider
  - Add TVL range slider
  - Add lock period select dropdown
  - Add "Show AI Predictions Only" checkbox
  - Implement clear filters button
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 18.1, 18.2, 18.3_

- [x] 5.3 Create loading skeleton components
  - Create skeleton loaders for pools using shadcn/ui Skeleton
  - Create skeleton loaders for positions
  - Create skeleton loaders for header stats
  - Create skeleton loader for transaction table
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 5.4 Create empty state components
  - Create empty state for no positions with CTA button
  - Create empty state for no pools available
  - Create empty state for no transactions
  - Create empty state for wallet not connected
  - Include illustrative icons and helpful messages
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 5.5 Create error handling components
  - Write `src/components/molecules/ErrorAlert.tsx`
  - Display error messages with appropriate styling
  - Show recovery actions (retry, dismiss, specific actions)
  - Integrate with error handler utility
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 6. Enhance existing organism components
  - Update UserPositions and AvailablePools with real data
  - Add new organism components for header and history
  - Integrate modals and loading states
  - _Requirements: 13.1, 14.1, 15.1, 20.1_

- [x] 6.1 Create StakingHeader component
  - Write `src/components/organisms/StakingHeader.tsx`
  - Display 4 stat cards: Total Staked, Pending Rewards, Avg APY, Active Positions
  - Implement skeleton loaders during data fetch
  - Add animated number transitions using react-countup
  - Add refresh button
  - Make responsive with grid layout
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 6.2 Enhance UserPositions component
  - Update `src/components/organisms/UserPositions.tsx`
  - Replace mock data with useStakingPositions hook
  - Add empty state when no positions
  - Add skeleton loaders during fetch
  - Integrate StakeModal, WithdrawModal, ClaimModal
  - Pass modal open/close handlers to PositionCard
  - _Requirements: 10.1, 13.1, 13.5_

- [x] 6.3 Enhance PositionCard component
  - Update `src/components/molecules/PositionCard.tsx`
  - Add lock period indicator with countdown
  - Add APY trend indicator (up/down arrow)
  - Update Claim and Withdraw buttons to open modals
  - Disable buttons based on position state (locked, no rewards)
  - Add tooltips for disabled states
  - _Requirements: 6.5, 29.1, 29.2, 29.3_

- [x] 6.4 Enhance AvailablePools component
  - Update `src/components/organisms/AvailablePools.tsx`
  - Replace mock data with useStakingPools hook
  - Add PoolFilters component at the top
  - Add search and sort controls
  - Add skeleton loaders during fetch
  - Implement expandable pool details with accordion
  - Add pagination or infinite scroll for large lists
  - _Requirements: 12.1, 17.1, 18.1, 19.1_

- [x] 6.5 Enhance PoolRow component
  - Update `src/components/molecules/PoolRow.tsx`
  - Make row clickable to expand details
  - Add AI predicted APY badge when available
  - Show lock period and fees in collapsed view
  - Implement accordion for expanded details
  - Show historical APY chart when expanded
  - Show total stakers and additional pool info
  - Update Stake button to open StakeModal
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 22.2, 22.3, 29.1, 30.1_

- [x] 6.6 Create StakingHistory component
  - Write `src/components/organisms/StakingHistory.tsx`
  - Use shadcn/ui Table component
  - Display columns: Type, Pool, Amount, Date, Status, Hash
  - Add filter tabs for transaction type
  - Implement pagination
  - Add empty state for no transactions
  - Add skeleton loader during fetch
  - Make transaction hashes clickable links to explorer
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 6.7 Create YieldChart component
  - Write `src/components/organisms/YieldChart.tsx`
  - Use Recharts LineChart for visualization
  - Add time period selector (7d, 30d, 90d, 1y)
  - Support multiple positions with different colored lines
  - Add custom tooltip with detailed info
  - Add legend for position identification
  - Implement loading state
  - Make responsive for mobile
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [-] 7. Update Stake page with all components
  - Integrate all new components into main page
  - Implement proper layout and spacing
  - Add responsive design
  - _Requirements: 26.1, 26.2, 26.3_

- [x] 7.1 Update Stake.tsx page
  - Update `src/pages/Stake.tsx`
  - Add StakingHeader at the top
  - Keep UserPositions section
  - Keep AvailablePools section
  - Add StakingHistory section
  - Add YieldChart section
  - Implement responsive layout (single column on mobile, multi-column on desktop)
  - Add proper spacing and section dividers
  - _Requirements: 26.1, 26.2, 26.3, 26.4_

- [x] 7.2 Implement wallet connection integration
  - Ensure ConnectWalletButton is prominently displayed when not connected
  - Show empty states with connect wallet CTA
  - Handle wallet connection state changes
  - Implement network validation and switch prompt
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 24.1, 24.2, 24.3, 24.4, 24.5_

- [x] 8. Implement responsive design
  - Ensure all components work on mobile, tablet, and desktop
  - Use appropriate breakpoints
  - Adapt layouts for different screen sizes
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [x] 8.1 Make modals responsive
  - Use Sheet component for mobile (bottom drawer)
  - Use Dialog component for desktop (centered modal)
  - Ensure touch targets are at least 44x44px on mobile
  - Test keyboard navigation on all screen sizes
  - _Requirements: 26.1, 26.2, 26.3, 26.4_

- [x] 8.2 Make tables responsive
  - Convert table to card view on mobile
  - Keep table view on tablet and desktop
  - Ensure horizontal scrolling works if needed
  - Test touch interactions
  - _Requirements: 26.1, 26.3_

- [x] 8.3 Make charts responsive
  - Use ResponsiveContainer from Recharts
  - Adjust chart height for mobile
  - Simplify tooltips on small screens
  - Test touch interactions with chart
  - _Requirements: 26.1, 26.4_

- [-] 9. Implement accessibility features
  - Add ARIA labels and descriptions
  - Ensure keyboard navigation
  - Test with screen readers
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [x] 9.1 Add keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Implement focus trap in modals
  - Add Escape key to close modals
  - Test Tab navigation order
  - _Requirements: 27.1_

- [x] 9.2 Add ARIA labels
  - Add aria-label to all buttons
  - Add aria-describedby for complex interactions
  - Add aria-live regions for dynamic updates
  - Add role attributes where needed
  - _Requirements: 27.2, 27.3, 27.4_

- [x] 9.3 Ensure visual accessibility
  - Verify contrast ratios meet WCAG 2.1 AA (4.5:1 minimum)
  - Add visible focus indicators
  - Ensure information is not conveyed by color alone
  - Use rem units for scalable text
  - _Requirements: 27.5_

- [x] 9.4 Implement reduced motion support
  - Detect prefers-reduced-motion setting
  - Disable animations when reduced motion is preferred
  - Ensure functionality works without animations
  - _Requirements: 27.5_

- [-] 10. Add environment configuration
  - Set up environment variables
  - Configure contract addresses
  - Add network configuration
  - _Requirements: 23.1, 24.1_

- [x] 10.1 Create environment configuration
  - Create `.env.example` file with all required variables
  - Document Somnia Testnet RPC URL and Chain ID
  - Add placeholder contract addresses
  - Add optional AI service configuration
  - Update README with setup instructions
  - _Requirements: 23.1, 24.1, 24.5_

- [x] 10.2 Update build configuration
  - Update `vite.config.ts` to include environment variables
  - Configure code splitting for vendor libraries
  - Enable sourcemaps for debugging
  - Optimize build output
  - _Requirements: Build optimization_

- [ ] 11. Documentation and polish
  - Update README with staking features
  - Add inline code comments
  - Create usage examples
  - _Requirements: Documentation_

- [ ]* 11.1 Update README
  - Add "Staking Features" section to README
  - Document how to use staking functionality
  - Add screenshots or GIFs of key features
  - Document environment setup for Somnia Testnet
  - Add troubleshooting section
  - _Requirements: Documentation_

- [ ]* 11.2 Add code comments
  - Add JSDoc comments to all public functions
  - Document complex logic with inline comments
  - Add TODO comments for future enhancements
  - Document contract ABIs and addresses
  - _Requirements: Code quality_

- [ ]* 11.3 Create usage examples
  - Add example of how to add new staking pool
  - Document how to integrate with different networks
  - Provide example of custom AI prediction integration
  - _Requirements: Documentation_
