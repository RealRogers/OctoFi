# Design Document

## Overview

The Stake page is a comprehensive interface that allows users to manage their staking activities within the OctoFi DeFi platform. The page is divided into two main sections: "Tus Posiciones" (Your Positions) which displays the user's active staking positions, and "Pools Disponibles" (Available Pools) which shows staking opportunities. The design follows the atomic design pattern with reusable molecule and organism components, maintaining consistency with the existing application design system.

The implementation will use hardcoded data to establish the visual interface first, with interactive functionality and data fetching to be implemented in subsequent iterations. This approach allows for rapid visual development and design validation before adding complexity.

## Architecture

### Component Hierarchy

```
StakePage (Page)
├── AppLayout (Existing Layout Component)
│   └── Page Content
│       ├── Page Title (H1: "Stake")
│       ├── UserPositions (Organism)
│       │   ├── Section Title (H2: "Tus Posiciones")
│       │   └── Grid Container
│       │       ├── PositionCard (Molecule) - Ethereum
│       │       └── PositionCard (Molecule) - Optimism
│       └── AvailablePools (Organism)
│           ├── Section Title (H2: "Pools Disponibles")
│           └── Table Container
│               ├── Table Header Row
│               └── Table Body
│                   ├── PoolRow (Molecule) - USD Coin
│                   ├── PoolRow (Molecule) - Tether
│                   └── PoolRow (Molecule) - Arbitrum
```

### File Structure

```
src/
├── pages/
│   └── Stake.tsx (Updated from placeholder)
├── components/
│   ├── organisms/
│   │   ├── UserPositions.tsx (New)
│   │   └── AvailablePools.tsx (New)
│   └── molecules/
│       ├── PositionCard.tsx (New)
│       └── PoolRow.tsx (New)
```

## Components and Interfaces

### 1. PositionCard (Molecule)

**Purpose:** Display an individual staking position with token information, APY, staked amount, rewards, and action buttons.

**TypeScript Interface:**
```typescript
interface PositionCardProps {
  imageUrl: string;
  tokenName: string;
  apy: string;
  stakedAmount: string;
  rewardsEarned: string;
}
```

**Layout Structure:**
- Container: Card with `bg-blue-900/20` background, `rounded-2xl`, `p-6`, `flex flex-col h-full`
- Top Section:
  - Token image: `w-16 h-16 rounded-xl mb-4`
  - Token name: `text-xl font-bold text-white mb-1`
  - APY badge: Small badge with `text-sm text-gray-400` showing "APY: {apy}"
- Middle Section:
  - Staked amount label: `text-sm text-gray-400 mb-1` - "Monto en Staking"
  - Staked amount value: `text-lg font-semibold text-white mb-3`
  - Rewards label: `text-sm text-gray-400 mb-1` - "Recompensas Ganadas"
  - Rewards value: `text-lg font-semibold text-white`
- Bottom Section (Footer):
  - Container: `mt-auto flex items-center gap-2 justify-end`
  - "Reclamar" button: Secondary style with `bg-gray-800 hover:bg-gray-700`
  - "Retirar" button: Primary style with gradient `bg-gradient-to-r from-purple-600 to-blue-600`

**Styling Details:**
- Use existing Button component from `@/components/ui/button`
- Ensure minimum touch target of 44x44px for buttons
- Add hover states with smooth transitions
- Use consistent spacing with the design system

### 2. PoolRow (Molecule)

**Purpose:** Display a single row in the available pools table with asset information and stake action.

**TypeScript Interface:**
```typescript
interface PoolRowProps {
  iconUrl: string;
  assetName: string;
  apy: string;
  totalStaked: string;
}
```

**Layout Structure:**
- Container: `grid grid-cols-4 gap-4 items-center py-4 px-6 border-t border-gray-800 first:border-t-0`
- Column 1 (Asset): `flex items-center gap-3`
  - Icon: `w-10 h-10 rounded-full`
  - Asset name: `text-white font-medium`
- Column 2 (APY): `text-green-400 font-semibold`
- Column 3 (TVL): `text-white`
- Column 4 (Action): `flex justify-end`
  - "Stake" button: Primary style with gradient

**Responsive Considerations:**
- On mobile, consider stacking or adjusting grid to 2 rows
- Ensure proper alignment with table header

### 3. UserPositions (Organism)

**Purpose:** Container for the user's staking positions section.

**TypeScript Interface:**
```typescript
interface UserPositionsProps {
  // No props needed for hardcoded version
  // Future: positions: PositionData[]
}
```

**Layout Structure:**
- Section container: `mb-12`
- Section title: `text-2xl font-bold text-white mb-6` - "Tus Posiciones"
- Grid container: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Renders two `PositionCard` components with hardcoded data

**Hardcoded Data:**
```typescript
const positions = [
  {
    imageUrl: "/placeholder.svg", // Ethereum logo placeholder
    tokenName: "Ethereum",
    apy: "4.5%",
    stakedAmount: "2.5 ETH",
    rewardsEarned: "0.01 ETH"
  },
  {
    imageUrl: "/placeholder.svg", // Optimism logo placeholder
    tokenName: "Optimism",
    apy: "8.2%",
    stakedAmount: "1,250 OP",
    rewardsEarned: "15.3 OP"
  }
];
```

### 4. AvailablePools (Organism)

**Purpose:** Container for the available staking pools table.

**TypeScript Interface:**
```typescript
interface AvailablePoolsProps {
  // No props needed for hardcoded version
  // Future: pools: PoolData[]
}
```

**Layout Structure:**
- Section container: `mb-12`
- Section title: `text-2xl font-bold text-white mb-6` - "Pools Disponibles"
- Table container: `bg-gray-900 rounded-xl overflow-hidden`
- Table header: `grid grid-cols-4 gap-4 px-6 py-4 bg-gray-950`
  - Column headers: `text-sm text-gray-400 font-medium`
  - Headers: "Activo", "APY", "Total Staked (TVL)", "" (empty for action column)
- Table body: Renders three `PoolRow` components

**Hardcoded Data:**
```typescript
const pools = [
  {
    iconUrl: "/placeholder.svg", // USDC logo placeholder
    assetName: "USD Coin",
    apy: "5.1%",
    totalStaked: "$12.5M"
  },
  {
    iconUrl: "/placeholder.svg", // USDT logo placeholder
    assetName: "Tether",
    apy: "4.9%",
    totalStaked: "$25.2M"
  },
  {
    iconUrl: "/placeholder.svg", // ARB logo placeholder
    assetName: "Arbitrum",
    apy: "11.3%",
    totalStaked: "$8.1M"
  }
];
```

### 5. StakePage (Page Component)

**Purpose:** Main page component that composes all organisms and provides the overall layout.

**TypeScript Interface:**
```typescript
// No props needed - page component
```

**Layout Structure:**
- Wrapped in `AppLayout` component
- Main container: `max-w-6xl mx-auto`
- Page title: `text-4xl font-bold text-white mb-8` - "Stake"
- Renders `UserPositions` organism
- Renders `AvailablePools` organism with spacing

## Data Models

### Position Data Model (Future Implementation)

```typescript
interface Position {
  id: string;
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  imageUrl: string;
  apy: number;
  stakedAmount: string;
  stakedAmountUSD: number;
  rewardsEarned: string;
  rewardsEarnedUSD: number;
  stakingStartDate: Date;
}
```

### Pool Data Model (Future Implementation)

```typescript
interface Pool {
  id: string;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  iconUrl: string;
  apy: number;
  totalStaked: string;
  totalStakedUSD: number;
  minStakeAmount: string;
  lockPeriod?: number; // in days, optional
  isActive: boolean;
}
```

## Error Handling

For this initial implementation with hardcoded data, error handling is minimal. Future iterations will include:

1. **Image Loading Errors:**
   - Fallback to placeholder icon if token image fails to load
   - Use `onError` handler on img elements

2. **Button Click Errors:**
   - Console logging for now
   - Future: Toast notifications for user feedback
   - Error boundaries for component-level failures

3. **Data Validation:**
   - TypeScript interfaces ensure type safety
   - Future: Runtime validation with Zod or similar

## Testing Strategy

### Component Testing

1. **PositionCard Tests:**
   - Renders with all props correctly
   - Displays token image, name, APY, amounts
   - Buttons are clickable and have proper accessibility attributes
   - Responsive layout works on different screen sizes

2. **PoolRow Tests:**
   - Renders with all props correctly
   - Grid alignment matches header
   - APY displays in green color
   - Stake button is accessible

3. **UserPositions Tests:**
   - Renders section title
   - Displays correct number of position cards
   - Grid layout is responsive

4. **AvailablePools Tests:**
   - Renders section title and table structure
   - Displays correct number of pool rows
   - Table header aligns with rows

5. **StakePage Tests:**
   - Renders within AppLayout
   - Displays page title
   - Renders both UserPositions and AvailablePools
   - Proper spacing between sections

### Visual Regression Testing

- Compare rendered output with design mockup
- Verify spacing, colors, typography
- Test responsive breakpoints
- Validate hover states and transitions

### Accessibility Testing

- Keyboard navigation works for all interactive elements
- Focus states are visible
- Touch targets meet minimum size requirements (44x44px)
- Semantic HTML structure
- ARIA labels where appropriate

## Styling Guidelines

### Color Palette

Based on existing design system and mockup:
- Background: `bg-background` (dark)
- Card backgrounds: `bg-blue-900/20` for positions, `bg-gray-900` for pools table
- Text primary: `text-white`
- Text secondary: `text-gray-400`
- APY positive: `text-green-400`
- Borders: `border-gray-800`
- Button primary: `bg-gradient-to-r from-purple-600 to-blue-600`
- Button secondary: `bg-gray-800`

### Typography

- Page title (H1): `text-4xl font-bold`
- Section titles (H2): `text-2xl font-bold`
- Card titles: `text-xl font-bold`
- Body text: `text-base`
- Labels: `text-sm text-gray-400`
- Values: `text-lg font-semibold`

### Spacing

- Page padding: Handled by AppLayout
- Section spacing: `mb-12`
- Card padding: `p-6`
- Grid gap: `gap-6` for cards, `gap-4` for table
- Button gap: `gap-2`

### Border Radius

- Cards: `rounded-2xl` for position cards
- Table container: `rounded-xl`
- Buttons: `rounded-lg` or `rounded-full` based on design
- Token images: `rounded-xl` or `rounded-full`

## Responsive Design

### Breakpoints

- Mobile: < 768px
  - Single column grid for position cards
  - Consider simplified table layout or card-based view for pools
- Tablet: 768px - 1024px
  - Two column grid for position cards
  - Full table layout for pools
- Desktop: > 1024px
  - Two column grid for position cards
  - Full table layout with generous spacing

### Mobile Considerations

- Stack position cards vertically
- Ensure touch targets are minimum 44x44px
- Consider horizontal scroll for pools table if needed
- Adjust font sizes for readability
- Maintain proper spacing and padding

## Integration Points

### With Existing Components

1. **AppLayout:** Wraps the entire page for consistent navigation
2. **Button Component:** Use existing `@/components/ui/button` for all buttons
3. **Card Component:** Consider using `@/components/ui/card` as base for PositionCard

### Future Integration Points

1. **Wallet Connection:** Buttons will need wallet context
2. **Blockchain Data:** Fetch real staking positions and pool data
3. **Transaction Handling:** Implement stake, unstake, and claim functionality
4. **Toast Notifications:** User feedback for actions
5. **Loading States:** Skeleton loaders while fetching data
6. **Modal Dialogs:** For stake amount input and confirmations

## Implementation Notes

1. **Start with Molecules:** Build PositionCard and PoolRow first, test in isolation
2. **Build Organisms:** Compose molecules into UserPositions and AvailablePools
3. **Assemble Page:** Create StakePage and integrate organisms
4. **Update Routing:** Ensure Stake.tsx is properly updated
5. **Visual Validation:** Compare with design mockup at each step
6. **Accessibility Check:** Test keyboard navigation and screen reader compatibility
7. **Responsive Testing:** Verify layout on mobile, tablet, and desktop

## Design Decisions and Rationales

1. **Atomic Design Pattern:** Ensures reusability and maintainability. Molecules can be used independently, organisms compose the page structure.

2. **Hardcoded Data First:** Allows rapid visual development and design validation before adding complexity of state management and data fetching.

3. **Grid Layout for Cards:** Provides clean, responsive layout that adapts well to different screen sizes.

4. **Table Layout for Pools:** Aligns with common DeFi patterns and allows easy comparison of pool metrics.

5. **Gradient Buttons:** Maintains visual consistency with existing Swap interface and creates visual hierarchy.

6. **Blue-tinted Position Cards:** Differentiates user positions from available pools, creates visual interest while maintaining dark theme.

7. **Green APY Values:** Universal color convention for positive financial metrics, improves scannability.

8. **TypeScript Throughout:** Ensures type safety and better developer experience with autocomplete and error checking.

