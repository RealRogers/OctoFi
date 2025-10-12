# Design Document

## Overview

The SwapInterface component is a self-contained, visually rich React component that provides users with an interface to swap tokens. This design focuses on creating a pixel-perfect implementation of the provided mockup, emphasizing visual hierarchy, clear information architecture, and intuitive user interactions. The component will be built using React with TypeScript, styled with Tailwind CSS, and will integrate seamlessly with the existing OctoFi application architecture.

The component is designed as a static UI implementation in this phase, with state management for basic interactivity (input handling) but without backend integration, price calculation logic, or wallet connectivity. This approach allows for rapid visual development and user testing before adding complex business logic.

## Architecture

### Component Hierarchy

```
SwapInterface (organism)
├── Title Section
├── Main Card Container
│   ├── From Section (Input Container)
│   │   ├── Label ("Desde (Pagas)")
│   │   ├── Input Row
│   │   │   ├── Amount Input Field
│   │   │   └── Token Selector Button
│   │   ├── USD Value Display
│   │   └── Balance Footer
│   │       ├── Balance Display
│   │       └── MAX Button
│   ├── Swap Direction Button (centered between sections)
│   ├── To Section (Output Container)
│   │   ├── Label ("Hasta (Recibes)")
│   │   ├── Output Row
│   │   │   ├── Amount Display
│   │   │   └── Token Selector Button
│   │   └── USD Value Display
│   ├── Transaction Details Section
│   │   ├── Exchange Rate Row
│   │   ├── Price Impact Row
│   │   └── Network Fee Row
│   └── Swap Action Button
```

### Technology Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- lucide-react for icons
- React Hooks (useState) for state management
- Existing UI components from shadcn/ui (Button, Card if needed)

### File Structure

```
src/
├── components/
│   └── organisms/
│       └── SwapInterface.tsx (new file)
├── pages/
│   └── Swap.tsx (updated to use SwapInterface)
```

## Components and Interfaces

### SwapInterface Component

**Location:** `src/components/organisms/SwapInterface.tsx`

**Props Interface:**
```typescript
interface SwapInterfaceProps {
  className?: string; // Optional additional styling
}
```

**State Interface:**
```typescript
interface SwapState {
  fromAmount: string;
  toAmount: string;
  fromToken: {
    symbol: string;
    icon: string;
  } | null;
  toToken: {
    symbol: string;
    icon: string;
  } | null;
}
```

**Component Structure:**

The component will be a functional component using React hooks:

```typescript
const SwapInterface: React.FC<SwapInterfaceProps> = ({ className }) => {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('0.0');
  
  // Handler functions
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
    // Note: Price calculation logic will be added in future iterations
  };
  
  const handleSwapDirection = () => {
    // Swap direction logic (future implementation)
  };
  
  const handleMaxClick = () => {
    // Set to max balance (future implementation)
  };
  
  return (
    // JSX structure
  );
};
```

## Data Models

### Token Model
```typescript
interface Token {
  symbol: string;        // e.g., "ETH", "USDT"
  name: string;          // e.g., "Ethereum", "Tether"
  icon: string;          // Icon identifier or URL
  decimals: number;      // Token decimals
  address?: string;      // Contract address (optional for native tokens)
}
```

### Transaction Details Model
```typescript
interface TransactionDetails {
  exchangeRate: string;   // e.g., "1 ETH = 3,000 USDT"
  priceImpact: string;    // e.g., "<0.01%"
  networkFee: string;     // e.g., "~$5.42"
}
```

## Visual Design Specifications

### Color Palette

Based on the design mockup and existing theme:

- **Background (Page):** `bg-background` (dark, likely #0a0a0a or similar)
- **Card Background:** `bg-gray-900` or custom dark shade (#1a1a1a)
- **Input Container Background:** `bg-gray-950` or darker (#0f0f0f)
- **Border Color:** `border-gray-800` (#2a2a2a)
- **Text Primary:** `text-white`
- **Text Secondary (Labels):** `text-gray-400` or `text-muted-foreground`
- **Text Tertiary (USD values):** `text-gray-500`
- **Accent (MAX button, positive values):** `text-blue-500` or `text-primary`
- **Success (Price impact):** `text-green-500`
- **Gradient (Swap button):** `from-purple-600 to-blue-600`

### Typography

- **Title (H1):** `text-3xl font-bold text-white`
- **Section Labels:** `text-sm text-gray-400`
- **Amount Input:** `text-4xl font-bold text-white`
- **USD Values:** `text-sm text-gray-500`
- **Balance Text:** `text-sm text-gray-400`
- **Transaction Details Labels:** `text-sm text-gray-400`
- **Transaction Details Values:** `text-sm text-white`
- **Button Text:** `text-base font-semibold text-white`

### Spacing and Layout

- **Card Padding:** `p-6` (24px)
- **Input Container Padding:** `p-4` (16px)
- **Section Spacing:** `space-y-4` (16px between sections)
- **Input Row Gap:** `gap-4` (16px between input and token selector)
- **Transaction Details Row Spacing:** `space-y-2` (8px between rows)
- **Button Padding:** `py-4 px-6` (16px vertical, 24px horizontal)

### Border Radius

- **Card:** `rounded-2xl` (16px)
- **Input Containers:** `rounded-xl` (12px)
- **Buttons (rectangular):** `rounded-xl` (12px)
- **Token Selector:** `rounded-full` (fully rounded)
- **Swap Direction Button:** `rounded-full` (circular)

### Shadows and Effects

- **Card:** Subtle shadow or border glow (optional)
- **Hover States:** Slight brightness increase or scale transform
- **Focus States:** Ring outline for accessibility
- **Gradient Button:** Smooth gradient with hover effect

## Detailed Component Breakdown

### 1. Title Section

```typescript
<div className="text-center mb-6">
  <h1 className="text-3xl font-bold text-white">Swap</h1>
</div>
```

### 2. Main Card Container

```typescript
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md mx-auto">
  {/* All sections go here */}
</div>
```

### 3. From Section (Input Container)

```typescript
<div className="space-y-2">
  {/* Label */}
  <label className="text-sm text-gray-400">Desde (Pagas)</label>
  
  {/* Input Container */}
  <div className="bg-gray-950 rounded-xl p-4">
    {/* Input Row */}
    <div className="flex justify-between items-center mb-2">
      {/* Amount Input */}
      <input
        type="text"
        value={fromAmount}
        onChange={handleFromAmountChange}
        placeholder="0.0"
        className="bg-transparent text-4xl font-bold text-white outline-none w-full"
      />
      
      {/* Token Selector */}
      <button className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
        {/* Token icons and arrow */}
      </button>
    </div>
    
    {/* USD Value */}
    <div className="text-sm text-gray-500">$0.00</div>
  </div>
  
  {/* Balance Footer */}
  <div className="flex justify-end items-center gap-2">
    <span className="text-sm text-gray-400">Balance: 0.0</span>
    <button className="text-sm text-blue-500 font-semibold">MAX</button>
  </div>
</div>
```

### 4. Swap Direction Button

```typescript
<div className="relative flex justify-center -my-2 z-10">
  <button className="bg-gray-900 border border-gray-800 rounded-full p-2 hover:bg-gray-800 transition-colors">
    <ArrowUpDown className="w-5 h-5 text-gray-400" />
  </button>
</div>
```

### 5. To Section (Output Container)

Similar structure to From Section, but with:
- Label: "Hasta (Recibes)"
- Non-editable display instead of input
- Token selector shows "Seleccionar token" with dropdown icon
- No balance footer

### 6. Transaction Details Section

```typescript
<div className="space-y-2 py-4">
  {/* Exchange Rate */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">Tasa</span>
    <span className="text-white">1 ETH = 3,000 USDT</span>
  </div>
  
  {/* Price Impact */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">Impacto en el precio</span>
    <span className="text-green-500">&lt;0.01%</span>
  </div>
  
  {/* Network Fee */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">Tarifa de la red</span>
    <span className="text-white">~$5.42</span>
  </div>
</div>
```

### 7. Swap Action Button

```typescript
<button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity">
  Swap
</button>
```

## Token Selector Design

The "Desde" token selector shows a specific design with two token icons (B and E) with an arrow:

```typescript
<button className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2 hover:bg-gray-700 transition-colors">
  <div className="flex items-center">
    {/* First token icon */}
    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
      B
    </div>
    {/* Second token icon (overlapping) */}
    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold -ml-2">
      E
    </div>
  </div>
  <ChevronDown className="w-4 h-4 text-gray-400" />
</button>
```

The "Hasta" token selector shows a placeholder state:

```typescript
<button className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 hover:bg-gray-700 transition-colors">
  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
    <Coins className="w-4 h-4 text-gray-400" />
  </div>
  <span className="text-sm text-gray-300">Seleccionar token</span>
  <ChevronDown className="w-4 h-4 text-gray-400" />
</button>
```

## Interaction Design

### Input Handling

1. User types in the "Desde" input field
2. Component updates `fromAmount` state
3. In future iterations, this will trigger price calculation
4. For now, "Hasta" amount remains "0.0"

### MAX Button

1. User clicks MAX button
2. In future iterations, this will fetch wallet balance and populate the input
3. For now, it's a visual element with no action

### Swap Direction Button

1. User clicks the swap direction button (arrows icon)
2. In future iterations, this will swap the from/to tokens and amounts
3. For now, it's a visual element with no action

### Token Selection

1. User clicks token selector button
2. In future iterations, this will open a token selection modal
3. For now, it's a visual element with no action

### Swap Button

1. User clicks the Swap button
2. In future iterations, this will initiate the swap transaction
3. For now, it's a visual element with no action

## Error Handling

For this static implementation phase:

- Input validation is minimal (allow numeric input only)
- No error states are displayed
- No loading states are implemented

Future iterations will include:

- Input validation with error messages
- Insufficient balance warnings
- Network error handling
- Transaction status feedback
- Loading states during price fetching

## Testing Strategy

### Unit Testing

Test the component in isolation:

1. **Rendering Tests**
   - Component renders without crashing
   - All sections are present (title, from section, to section, details, button)
   - Initial state is correct (empty inputs, default values)

2. **State Management Tests**
   - `fromAmount` state updates when user types
   - Input field reflects the current state value
   - State persists correctly during re-renders

3. **Props Tests**
   - Component accepts and applies custom className
   - Component renders with default props

### Visual Regression Testing

Compare rendered component against design mockup:

1. Desktop viewport (1920x1080)
2. Tablet viewport (768x1024)
3. Mobile viewport (375x667)

### Accessibility Testing

1. Keyboard navigation works correctly
2. Focus states are visible
3. ARIA labels are present where needed
4. Color contrast meets WCAG AA standards

### Integration Testing

Test integration with Swap page:

1. Component renders correctly within AppLayout
2. Component is centered and responsive
3. No style conflicts with global styles

## Responsive Design

### Desktop (≥768px)

- Card max-width: 480px (max-w-md)
- Full feature set visible
- Comfortable spacing and padding

### Mobile (<768px)

- Card adapts to screen width with horizontal padding
- Font sizes remain readable
- Touch targets are at least 44x44px
- Vertical spacing may be slightly reduced

## Accessibility Considerations

1. **Semantic HTML**
   - Use proper heading hierarchy
   - Use `<button>` elements for interactive elements
   - Use `<label>` elements for form inputs

2. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Tab order is logical
   - Focus indicators are visible

3. **Screen Readers**
   - Add ARIA labels where visual context is needed
   - Announce state changes (future implementation)
   - Provide alternative text for icons

4. **Color Contrast**
   - Text meets WCAG AA standards (4.5:1 for normal text)
   - Interactive elements have sufficient contrast
   - Don't rely solely on color to convey information

## Performance Considerations

1. **Rendering Optimization**
   - Use React.memo if component re-renders unnecessarily
   - Avoid inline function definitions in JSX
   - Use useCallback for event handlers if needed

2. **Bundle Size**
   - Import only needed icons from lucide-react
   - No heavy dependencies for this static implementation

3. **CSS Performance**
   - Leverage Tailwind's utility classes for optimal CSS
   - Avoid complex CSS animations in this phase

## Future Enhancements

This design document focuses on the static UI implementation. Future iterations will add:

1. **Price Calculation Logic**
   - Real-time price fetching from DEX APIs
   - Slippage calculation
   - Dynamic exchange rate updates

2. **Wallet Integration**
   - Connect to user's wallet
   - Fetch real token balances
   - Display actual wallet address

3. **Token Selection Modal**
   - Searchable token list
   - Popular tokens section
   - Custom token import

4. **Transaction Execution**
   - Smart contract interaction
   - Transaction signing
   - Transaction status tracking
   - Success/error notifications

5. **Advanced Features**
   - Slippage tolerance settings
   - Transaction deadline settings
   - Multi-hop routing
   - Price impact warnings

## Integration with Existing Codebase

### Swap Page Update

The existing `Swap.tsx` page will be updated to use the new SwapInterface component:

```typescript
import AppLayout from "@/components/AppLayout";
import SwapInterface from "@/components/organisms/SwapInterface";

const Swap = () => {
  return (
    <AppLayout>
      <SwapInterface />
    </AppLayout>
  );
};

export default Swap;
```

### Styling Consistency

The component will use:
- Existing Tailwind configuration
- Existing color theme variables
- Existing component patterns (Button, Card if needed)
- lucide-react icons (already in use in AppLayout)

### No Breaking Changes

This implementation:
- Adds a new component file
- Updates only the Swap page
- Does not modify existing components
- Does not change routing or navigation
