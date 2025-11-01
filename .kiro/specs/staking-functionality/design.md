# Design Document

## Overview

Este documento describe el diseño técnico completo para implementar la funcionalidad de staking en OctoFi. El sistema permitirá a los usuarios stakear tokens en pools de liquidez en Somnia Testnet, gestionar sus posiciones, reclamar recompensas y visualizar información detallada con predicciones potenciadas por AI.

### Key Design Principles

1. **Modular Architecture**: Componentes reutilizables siguiendo Atomic Design
2. **Type Safety**: TypeScript estricto con validaciones Zod
3. **Real-time Updates**: TanStack Query para sincronización de datos
4. **Blockchain Integration**: ethers.js para interacción con Somnia Testnet
5. **AI Enhancement**: Predicciones de APY usando Vertex AI (placeholders)
6. **Responsive First**: Mobile-first design con breakpoints consistentes
7. **Accessibility**: WCAG 2.1 AA compliance
8. **Error Resilience**: Manejo robusto de errores con fallbacks

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Stake.tsx    │  │   Modals     │  │  Components  │      │
│  │   (Page)     │  │ (Molecules)  │  │  (Organisms) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Hooks      │  │    Store     │  │  Validators  │      │
│  │ useStaking   │  │   (Zustand)  │  │    (Zod)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Services   │  │ TanStack     │  │   ethers.js  │      │
│  │  (Staking)   │  │   Query      │  │   Provider   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Somnia     │  │ DIA Oracle   │  │  Vertex AI   │      │
│  │   Testnet    │  │  (Prices)    │  │ (Predictions)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```


### Component Architecture

```
src/
├── pages/
│   └── Stake.tsx (Enhanced)
│       ├── StakingHeader (new)
│       ├── UserPositions (enhanced)
│       ├── AvailablePools (enhanced)
│       ├── StakingHistory (new)
│       └── YieldChart (new)
│
├── components/
│   ├── molecules/
│   │   ├── StakeModal.tsx (new)
│   │   ├── WithdrawModal.tsx (new)
│   │   ├── ClaimModal.tsx (new)
│   │   ├── PositionCard.tsx (enhanced)
│   │   ├── PoolRow.tsx (enhanced)
│   │   ├── RewardsCalculator.tsx (new)
│   │   ├── PoolFilters.tsx (new)
│   │   └── TransactionPreview.tsx (new)
│   │
│   └── organisms/
│       ├── UserPositions.tsx (enhanced)
│       ├── AvailablePools.tsx (enhanced)
│       ├── StakingHeader.tsx (new)
│       ├── StakingHistory.tsx (new)
│       └── YieldChart.tsx (new)
│
├── hooks/
│   ├── useStaking.ts (new)
│   ├── useStakingPools.ts (new)
│   ├── useStakingPositions.ts (new)
│   ├── useStakingTransactions.ts (new)
│   └── useWalletBalance.ts (new)
│
├── services/
│   ├── stakingService.ts (new)
│   ├── poolService.ts (new)
│   ├── rewardsService.ts (new)
│   ├── aiPredictionService.ts (new)
│   └── blockchainService.ts (new)
│
├── lib/
│   ├── stakingValidators.ts (new)
│   ├── stakingUtils.ts (new)
│   └── stakingConstants.ts (new)
│
└── types/
    └── staking.ts (new)
```

## Components and Interfaces

### 1. Type Definitions (types/staking.ts)

```typescript
// Core Staking Types
export interface StakingPool {
  id: string
  address: string
  name: string
  symbol: string
  tokenAddress: string
  apy: number
  apyPredicted?: number // AI prediction
  tvl: number
  totalStakers: number
  minStake: string
  maxStake?: string
  lockPeriod: number // in seconds
  entryFee: number // percentage
  exitFee: number // percentage
  performanceFee: number // percentage
  rewardToken: string
  isActive: boolean
  createdAt: Date
  logoUrl: string
}

export interface StakingPosition {
  id: string
  poolId: string
  pool: StakingPool
  userAddress: string
  stakedAmount: string
  stakedAmountUSD: number
  rewardsEarned: string
  rewardsEarnedUSD: number
  apy: number
  stakedAt: Date
  unlocksAt: Date
  isLocked: boolean
  canWithdraw: boolean
  canClaim: boolean
}

export interface StakingTransaction {
  id: string
  hash: string
  type: 'stake' | 'withdraw' | 'claim'
  poolId: string
  poolName: string
  amount: string
  amountUSD: number
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: Date
  gasUsed?: string
  error?: string
}

export interface StakingStats {
  totalStakedUSD: number
  totalRewardsUSD: number
  averageAPY: number
  activePositions: number
  totalTransactions: number
}

export interface TokenBalance {
  address: string
  symbol: string
  balance: string
  balanceFormatted: string
  balanceUSD: number
}
```


### 2. Modal Components

#### StakeModal.tsx

**Purpose**: Modal para stakear tokens en un pool

**Props**:
```typescript
interface StakeModalProps {
  pool: StakingPool
  isOpen: boolean
  onClose: () => void
  onSuccess: (tx: StakingTransaction) => void
}
```

**State Management**:
- Amount input (controlled)
- Token approval status
- Transaction status (idle, approving, staking, success, error)
- Balance validation
- Gas estimation

**UI Flow**:
1. Display pool information (name, APY, fees)
2. Show user's token balance
3. Amount input with max button
4. Real-time validation feedback
5. Preview section (estimated rewards, fees, gas)
6. Two-step process: Approve → Stake
7. Loading states for each step
8. Success/error feedback with transaction hash

**Validation Rules** (Zod):
```typescript
const stakeSchema = z.object({
  amount: z.string()
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0")
    .refine((val) => parseFloat(val) >= minStake, `Minimum stake is ${minStake}`)
    .refine((val) => parseFloat(val) <= balance, "Insufficient balance")
    .refine((val) => !maxStake || parseFloat(val) <= maxStake, `Maximum stake is ${maxStake}`)
})
```

#### WithdrawModal.tsx

**Purpose**: Modal para retirar tokens de una posición

**Props**:
```typescript
interface WithdrawModalProps {
  position: StakingPosition
  isOpen: boolean
  onClose: () => void
  onSuccess: (tx: StakingTransaction) => void
}
```

**State Management**:
- Amount input (controlled)
- Transaction status
- Lock period validation
- Rewards impact calculation

**UI Flow**:
1. Display position details
2. Show staked amount and lock status
3. Amount input with max button
4. Warning if lock period not expired
5. Preview section (amount to receive, fees, lost rewards)
6. Confirmation step
7. Transaction execution
8. Success/error feedback

**Validation Rules**:
```typescript
const withdrawSchema = z.object({
  amount: z.string()
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0")
    .refine((val) => parseFloat(val) <= stakedAmount, "Exceeds staked amount")
})
```

#### ClaimModal.tsx

**Purpose**: Modal para reclamar recompensas

**Props**:
```typescript
interface ClaimModalProps {
  position: StakingPosition
  isOpen: boolean
  onClose: () => void
  onSuccess: (tx: StakingTransaction) => void
}
```

**State Management**:
- Transaction status
- Gas estimation
- Rewards calculation

**UI Flow**:
1. Display rewards amount (tokens + USD)
2. Show gas cost estimation
3. Net amount after fees
4. Confirmation button
5. Transaction execution
6. Success feedback with updated balance

### 3. Enhanced Organisms

#### StakingHeader.tsx (New)

**Purpose**: Header con estadísticas generales del usuario

**Data Requirements**:
- Total staked (USD)
- Total rewards pending (USD)
- Average APY (weighted)
- Active positions count

**UI Components**:
- 4 stat cards in responsive grid
- Skeleton loaders during fetch
- Animated number transitions
- Refresh button

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Total Staked    │  Pending Rewards │  Avg APY  │ Positions │
│   $12,450.00     │    $125.50       │  8.5%     │    3      │
└─────────────────────────────────────────────────────────┘
```

#### UserPositions.tsx (Enhanced)

**Enhancements**:
- Replace mock data with real data from useStakingPositions hook
- Add empty state when no positions
- Add skeleton loaders
- Integrate StakeModal, WithdrawModal, ClaimModal
- Add lock period indicators
- Add APY trend indicators

**Data Flow**:
```typescript
const { positions, isLoading, error, refetch } = useStakingPositions()
```

#### AvailablePools.tsx (Enhanced)

**Enhancements**:
- Replace mock data with real data from useStakingPools hook
- Add search functionality
- Add filter controls (APY range, TVL range)
- Add sorting (APY, TVL, name)
- Add expandable pool details (accordion)
- Add AI predicted APY badges
- Add pagination or infinite scroll

**Data Flow**:
```typescript
const { 
  pools, 
  isLoading, 
  error, 
  filters, 
  setFilters,
  sortBy,
  setSortBy 
} = useStakingPools()
```

**Enhanced PoolRow**:
- Click to expand details
- Show historical APY chart when expanded
- Show lock period, fees, total stakers
- Show AI prediction badge if available


#### StakingHistory.tsx (New)

**Purpose**: Tabla con historial de transacciones

**Data Requirements**:
- User's staking transactions
- Pagination support
- Filter by type (stake, withdraw, claim)

**UI Components**:
- shadcn/ui Table component
- Filter tabs
- Empty state
- Skeleton loader
- Transaction hash links to explorer

**Columns**:
- Type (badge with icon)
- Pool name
- Amount (tokens + USD)
- Date/Time
- Status (badge)
- Transaction hash (link)

#### YieldChart.tsx (New)

**Purpose**: Gráfico de rendimiento histórico

**Data Requirements**:
- Historical rewards data
- Time period selector (7d, 30d, 90d, 1y)
- Multiple positions support

**UI Components**:
- Recharts LineChart
- Time period selector
- Legend for multiple positions
- Tooltip with detailed info
- Loading state

**Chart Configuration**:
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    {positions.map((position, index) => (
      <Line 
        key={position.id}
        type="monotone" 
        dataKey={position.poolName}
        stroke={colors[index]}
        strokeWidth={2}
      />
    ))}
  </LineChart>
</ResponsiveContainer>
```

### 4. Utility Components

#### RewardsCalculator.tsx

**Purpose**: Calculadora de recompensas estimadas

**Inputs**:
- Amount to stake
- Pool selection
- Time period (days)

**Outputs**:
- Estimated rewards (tokens)
- Estimated rewards (USD)
- APY used (current vs predicted)
- Comparison table

**Formula**:
```typescript
const calculateRewards = (
  amount: number,
  apy: number,
  days: number
): number => {
  return amount * (apy / 100) * (days / 365)
}
```

#### PoolFilters.tsx

**Purpose**: Controles de filtrado y búsqueda

**Filters**:
- Search by name/symbol (Input)
- APY range (Slider)
- TVL range (Slider)
- Lock period (Select)
- Has AI prediction (Checkbox)

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search...                                    [Clear] │
├─────────────────────────────────────────────────────────┤
│  APY Range: [====●========] 0% - 20%                    │
│  TVL Range: [======●======] $0 - $50M                   │
│  Lock Period: [All ▼]                                   │
│  ☑ Show AI Predictions Only                            │
└─────────────────────────────────────────────────────────┘
```

#### TransactionPreview.tsx

**Purpose**: Preview de transacción antes de confirmar

**Data Displayed**:
- Action type (Stake/Withdraw/Claim)
- Amount
- Fees breakdown
- Gas cost estimation
- Net amount
- Warnings/risks

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Transaction Preview                                     │
├─────────────────────────────────────────────────────────┤
│  Action:        Stake                                    │
│  Amount:        100 USDC                                 │
│  Entry Fee:     0.5 USDC (0.5%)                         │
│  Gas Cost:      ~0.001 ETH ($2.50)                      │
│  ─────────────────────────────────────                  │
│  Net Staked:    99.5 USDC                               │
│                                                          │
│  Estimated APY: 8.5%                                     │
│  Est. Rewards:  8.46 USDC/year                          │
│  Lock Period:   30 days                                  │
└─────────────────────────────────────────────────────────┘
```

## Data Models

### Blockchain Integration

#### Smart Contract Interfaces

```typescript
// Staking Pool Contract ABI (simplified)
interface IStakingPool {
  // View functions
  function balanceOf(address account) external view returns (uint256)
  function earned(address account) external view returns (uint256)
  function totalSupply() external view returns (uint256)
  function rewardRate() external view returns (uint256)
  function lockDuration() external view returns (uint256)
  function unlockTime(address account) external view returns (uint256)
  
  // State-changing functions
  function stake(uint256 amount) external
  function withdraw(uint256 amount) external
  function getReward() external
  function exit() external // withdraw all + claim
}

// ERC20 Token Interface
interface IERC20 {
  function balanceOf(address account) external view returns (uint256)
  function allowance(address owner, address spender) external view returns (uint256)
  function approve(address spender, uint256 amount) external returns (bool)
  function transfer(address to, uint256 amount) external returns (bool)
}
```

#### Contract Addresses (Somnia Testnet)

```typescript
export const STAKING_CONTRACTS = {
  // Mock contracts for development
  USDC_POOL: '0x...',
  USDT_POOL: '0x...',
  ARB_POOL: '0x...',
  
  // Token addresses
  USDC: '0x...',
  USDT: '0x...',
  ARB: '0x...',
}

export const SOMNIA_CONFIG = {
  chainId: 997,
  chainName: 'Somnia Testnet',
  rpcUrl: 'https://testnet.rpc.somnia.network',
  blockExplorer: 'https://testnet.explorer.somnia.network',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18
  }
}
```


### Services Layer

#### stakingService.ts

**Purpose**: Core service para interacciones con contratos de staking

**Key Functions**:

```typescript
class StakingService {
  private provider: ethers.providers.Web3Provider
  private signer: ethers.Signer
  
  // Pool queries
  async getPool(poolAddress: string): Promise<StakingPool>
  async getAllPools(): Promise<StakingPool[]>
  async getPoolAPY(poolAddress: string): Promise<number>
  async getPoolTVL(poolAddress: string): Promise<number>
  
  // User position queries
  async getUserPosition(poolAddress: string, userAddress: string): Promise<StakingPosition>
  async getUserPositions(userAddress: string): Promise<StakingPosition[]>
  async getUserRewards(poolAddress: string, userAddress: string): Promise<string>
  
  // Transactions
  async approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<TransactionResponse>
  async stake(poolAddress: string, amount: string): Promise<TransactionResponse>
  async withdraw(poolAddress: string, amount: string): Promise<TransactionResponse>
  async claimRewards(poolAddress: string): Promise<TransactionResponse>
  
  // Utilities
  async checkAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<string>
  async estimateGas(transaction: TransactionRequest): Promise<BigNumber>
  async waitForTransaction(txHash: string): Promise<TransactionReceipt>
}
```

**Error Handling**:
```typescript
class StakingError extends Error {
  code: StakingErrorCode
  details?: any
  
  constructor(message: string, code: StakingErrorCode, details?: any) {
    super(message)
    this.name = 'StakingError'
    this.code = code
    this.details = details
  }
}

enum StakingErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_ALLOWANCE = 'INSUFFICIENT_ALLOWANCE',
  POOL_NOT_FOUND = 'POOL_NOT_FOUND',
  POSITION_LOCKED = 'POSITION_LOCKED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  USER_REJECTED = 'USER_REJECTED',
}
```

#### poolService.ts

**Purpose**: Service para datos de pools (puede usar DIA Oracle)

**Key Functions**:

```typescript
class PoolService {
  // Fetch pool data from blockchain + oracle
  async fetchPoolData(poolAddress: string): Promise<StakingPool>
  
  // Get historical APY data
  async getHistoricalAPY(poolAddress: string, days: number): Promise<APYDataPoint[]>
  
  // Get pool statistics
  async getPoolStats(poolAddress: string): Promise<PoolStats>
  
  // Cache management
  private cache: Map<string, CachedData>
  private getCached<T>(key: string, maxAge: number): T | null
  private setCache<T>(key: string, data: T): void
}

interface APYDataPoint {
  date: Date
  apy: number
}

interface PoolStats {
  totalStakers: number
  averageStake: string
  totalRewardsDistributed: string
  uptimePercentage: number
}
```

#### rewardsService.ts

**Purpose**: Service para cálculos de recompensas

**Key Functions**:

```typescript
class RewardsService {
  // Calculate current rewards
  calculateCurrentRewards(position: StakingPosition): string
  
  // Calculate projected rewards
  calculateProjectedRewards(
    amount: string,
    apy: number,
    days: number
  ): string
  
  // Calculate APY from reward rate
  calculateAPY(rewardRate: string, totalSupply: string, rewardTokenPrice: number): number
  
  // Get rewards history
  async getRewardsHistory(userAddress: string, poolAddress: string): Promise<RewardEvent[]>
}

interface RewardEvent {
  timestamp: Date
  amount: string
  amountUSD: number
  transactionHash: string
}
```

#### aiPredictionService.ts

**Purpose**: Service para predicciones de APY con AI (Vertex AI placeholder)

**Key Functions**:

```typescript
class AIPredictionService {
  private vertexAI: VertexAI // Placeholder
  
  // Get APY prediction for pool
  async predictAPY(poolAddress: string): Promise<APYPrediction>
  
  // Get market sentiment
  async getMarketSentiment(tokenSymbol: string): Promise<SentimentAnalysis>
  
  // Get risk assessment
  async assessRisk(poolAddress: string): Promise<RiskAssessment>
  
  // Fallback to simple prediction if AI unavailable
  private fallbackPrediction(historicalData: APYDataPoint[]): number
}

interface APYPrediction {
  predicted: number
  confidence: number // 0-100
  timeframe: string // e.g., "30 days"
  factors: string[]
  isAIGenerated: boolean
}

interface SentimentAnalysis {
  score: number // -1 to 1
  label: 'bearish' | 'neutral' | 'bullish'
  sources: string[]
}

interface RiskAssessment {
  score: number // 0-100
  level: 'low' | 'medium' | 'high'
  factors: {
    volatility: number
    liquidity: number
    smartContract: number
  }
}
```

**Vertex AI Integration (Placeholder)**:
```typescript
// This is a placeholder implementation
// In production, integrate with actual Vertex AI API
async predictAPY(poolAddress: string): Promise<APYPrediction> {
  try {
    // Fetch historical data
    const historicalData = await poolService.getHistoricalAPY(poolAddress, 90)
    
    // In production: Call Vertex AI API
    // const prediction = await this.vertexAI.predict(historicalData)
    
    // For now: Use simple moving average + trend
    const prediction = this.fallbackPrediction(historicalData)
    
    return {
      predicted: prediction,
      confidence: 75,
      timeframe: '30 days',
      factors: ['Historical trend', 'Market conditions', 'TVL growth'],
      isAIGenerated: false // Set to true when using real AI
    }
  } catch (error) {
    // Return current APY as fallback
    const pool = await poolService.fetchPoolData(poolAddress)
    return {
      predicted: pool.apy,
      confidence: 50,
      timeframe: '30 days',
      factors: ['Current APY (fallback)'],
      isAIGenerated: false
    }
  }
}
```

#### blockchainService.ts

**Purpose**: Service genérico para interacciones blockchain

**Key Functions**:

```typescript
class BlockchainService {
  private provider: ethers.providers.Web3Provider
  
  // Wallet connection
  async connectWallet(): Promise<string>
  async disconnectWallet(): Promise<void>
  async getConnectedAddress(): Promise<string | null>
  
  // Network management
  async getCurrentChainId(): Promise<number>
  async switchNetwork(chainId: number): Promise<void>
  async addNetwork(networkConfig: NetworkConfig): Promise<void>
  
  // Token operations
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string>
  async getTokenInfo(tokenAddress: string): Promise<TokenInfo>
  
  // Transaction utilities
  async estimateGas(transaction: TransactionRequest): Promise<BigNumber>
  async getGasPrice(): Promise<BigNumber>
  async waitForTransaction(txHash: string, confirmations?: number): Promise<TransactionReceipt>
  
  // Event listeners
  onAccountChanged(callback: (address: string) => void): () => void
  onChainChanged(callback: (chainId: number) => void): () => void
}

interface NetworkConfig {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
}
```


### Hooks Layer

#### useStaking.ts (Main Hook)

**Purpose**: Hook principal que orquesta toda la funcionalidad de staking

```typescript
export const useStaking = () => {
  const { address, chainId } = useWallet()
  const queryClient = useQueryClient()
  
  // Queries
  const pools = useStakingPools()
  const positions = useStakingPositions(address)
  const stats = useStakingStats(address)
  
  // Mutations
  const stakeMutation = useStakeMutation()
  const withdrawMutation = useWithdrawMutation()
  const claimMutation = useClaimMutation()
  const approveMutation = useApproveMutation()
  
  // Actions
  const stake = async (poolAddress: string, amount: string) => {
    // Check allowance
    const allowance = await stakingService.checkAllowance(...)
    
    // Approve if needed
    if (needsApproval) {
      await approveMutation.mutateAsync(...)
    }
    
    // Execute stake
    return await stakeMutation.mutateAsync({ poolAddress, amount })
  }
  
  const withdraw = async (poolAddress: string, amount: string) => {
    return await withdrawMutation.mutateAsync({ poolAddress, amount })
  }
  
  const claim = async (poolAddress: string) => {
    return await claimMutation.mutateAsync({ poolAddress })
  }
  
  return {
    // Data
    pools: pools.data,
    positions: positions.data,
    stats: stats.data,
    
    // Loading states
    isLoading: pools.isLoading || positions.isLoading,
    
    // Actions
    stake,
    withdraw,
    claim,
    
    // Mutation states
    isStaking: stakeMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    isClaiming: claimMutation.isPending,
    
    // Errors
    error: pools.error || positions.error,
    
    // Refetch
    refetch: () => {
      pools.refetch()
      positions.refetch()
      stats.refetch()
    }
  }
}
```

#### useStakingPools.ts

**Purpose**: Hook para gestionar datos de pools

```typescript
export const useStakingPools = (options?: UseStakingPoolsOptions) => {
  const [filters, setFilters] = useState<PoolFilters>({
    search: '',
    minAPY: 0,
    maxAPY: 100,
    minTVL: 0,
    lockPeriod: 'all',
    showAIPredictions: false
  })
  
  const [sortBy, setSortBy] = useState<PoolSortBy>('apy')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Fetch pools
  const { data: pools, ...query } = useQuery({
    queryKey: ['staking', 'pools'],
    queryFn: () => stakingService.getAllPools(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })
  
  // Fetch AI predictions
  const { data: predictions } = useQuery({
    queryKey: ['staking', 'predictions'],
    queryFn: async () => {
      if (!pools) return {}
      const results = await Promise.allSettled(
        pools.map(pool => aiPredictionService.predictAPY(pool.address))
      )
      return results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled') {
          acc[pools[index].address] = result.value
        }
        return acc
      }, {} as Record<string, APYPrediction>)
    },
    enabled: !!pools,
    staleTime: 300000, // 5 minutes
  })
  
  // Filter and sort pools
  const filteredPools = useMemo(() => {
    if (!pools) return []
    
    let result = pools.filter(pool => {
      // Apply filters
      if (filters.search && !pool.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (pool.apy < filters.minAPY || pool.apy > filters.maxAPY) {
        return false
      }
      if (pool.tvl < filters.minTVL) {
        return false
      }
      if (filters.showAIPredictions && !predictions?.[pool.address]) {
        return false
      }
      return true
    })
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'apy':
          comparison = a.apy - b.apy
          break
        case 'tvl':
          comparison = a.tvl - b.tvl
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return result
  }, [pools, filters, sortBy, sortOrder, predictions])
  
  return {
    pools: filteredPools,
    allPools: pools,
    predictions,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    ...query
  }
}
```

#### useStakingPositions.ts

**Purpose**: Hook para gestionar posiciones del usuario

```typescript
export const useStakingPositions = (userAddress?: string) => {
  return useQuery({
    queryKey: ['staking', 'positions', userAddress],
    queryFn: async () => {
      if (!userAddress) return []
      return await stakingService.getUserPositions(userAddress)
    },
    enabled: !!userAddress,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // 30 seconds - update rewards
  })
}
```

#### useStakingTransactions.ts

**Purpose**: Hook para historial de transacciones

```typescript
export const useStakingTransactions = (userAddress?: string) => {
  return useQuery({
    queryKey: ['staking', 'transactions', userAddress],
    queryFn: async () => {
      if (!userAddress) return []
      // Fetch from blockchain events or backend
      return await fetchUserTransactions(userAddress)
    },
    enabled: !!userAddress,
    staleTime: 60000, // 1 minute
  })
}
```

#### useWalletBalance.ts

**Purpose**: Hook para balance de tokens

```typescript
export const useWalletBalance = (tokenAddress?: string, userAddress?: string) => {
  return useQuery({
    queryKey: ['wallet', 'balance', tokenAddress, userAddress],
    queryFn: async () => {
      if (!tokenAddress || !userAddress) return null
      
      const balance = await blockchainService.getTokenBalance(tokenAddress, userAddress)
      const tokenInfo = await blockchainService.getTokenInfo(tokenAddress)
      
      return {
        address: tokenAddress,
        symbol: tokenInfo.symbol,
        balance,
        balanceFormatted: ethers.utils.formatUnits(balance, tokenInfo.decimals),
        balanceUSD: 0 // TODO: Get price from oracle
      } as TokenBalance
    },
    enabled: !!tokenAddress && !!userAddress,
    staleTime: 5000, // 5 seconds
    refetchInterval: 15000, // 15 seconds
  })
}
```

#### Mutation Hooks

```typescript
// useStakeMutation.ts
export const useStakeMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ poolAddress, amount }: { poolAddress: string; amount: string }) => {
      const tx = await stakingService.stake(poolAddress, amount)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['staking', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['staking', 'pools'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
    }
  })
}

// useWithdrawMutation.ts
export const useWithdrawMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ poolAddress, amount }: { poolAddress: string; amount: string }) => {
      const tx = await stakingService.withdraw(poolAddress, amount)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
    }
  })
}

// useClaimMutation.ts
export const useClaimMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ poolAddress }: { poolAddress: string }) => {
      const tx = await stakingService.claimRewards(poolAddress)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
    }
  })
}

// useApproveMutation.ts
export const useApproveMutation = () => {
  return useMutation({
    mutationFn: async ({ 
      tokenAddress, 
      spenderAddress, 
      amount 
    }: { 
      tokenAddress: string
      spenderAddress: string
      amount: string 
    }) => {
      const tx = await stakingService.approveToken(tokenAddress, spenderAddress, amount)
      const receipt = await stakingService.waitForTransaction(tx.hash)
      return receipt
    }
  })
}
```


### Validation Layer

#### stakingValidators.ts

**Purpose**: Esquemas de validación Zod para todas las operaciones

```typescript
import { z } from 'zod'

// Stake validation
export const stakeSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Amount must be a valid number')
    .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0')
})

export const createStakeValidator = (
  balance: string,
  minStake: string,
  maxStake?: string
) => {
  return stakeSchema.extend({
    amount: z.string()
      .refine(
        (val) => parseFloat(val) <= parseFloat(balance),
        `Insufficient balance. Available: ${balance}`
      )
      .refine(
        (val) => parseFloat(val) >= parseFloat(minStake),
        `Minimum stake amount is ${minStake}`
      )
      .refine(
        (val) => !maxStake || parseFloat(val) <= parseFloat(maxStake),
        `Maximum stake amount is ${maxStake}`
      )
  })
}

// Withdraw validation
export const withdrawSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Amount must be a valid number')
    .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0')
})

export const createWithdrawValidator = (
  stakedAmount: string,
  isLocked: boolean
) => {
  let schema = withdrawSchema.extend({
    amount: z.string()
      .refine(
        (val) => parseFloat(val) <= parseFloat(stakedAmount),
        `Maximum withdraw amount is ${stakedAmount}`
      )
  })
  
  if (isLocked) {
    schema = schema.extend({
      amount: z.string().refine(
        () => false,
        'Position is still locked. Cannot withdraw yet.'
      )
    })
  }
  
  return schema
}

// Network validation
export const networkSchema = z.object({
  chainId: z.number().refine(
    (id) => id === 997,
    'Please switch to Somnia Testnet (Chain ID: 997)'
  )
})

// Address validation
export const addressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

// Transaction validation
export const transactionSchema = z.object({
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  status: z.enum(['pending', 'confirmed', 'failed'])
})
```

### Utility Functions

#### stakingUtils.ts

**Purpose**: Funciones de utilidad para cálculos y formateo

```typescript
import { ethers } from 'ethers'

// Format token amounts
export const formatTokenAmount = (
  amount: string | BigNumber,
  decimals: number,
  displayDecimals: number = 4
): string => {
  const formatted = ethers.utils.formatUnits(amount, decimals)
  return parseFloat(formatted).toFixed(displayDecimals)
}

// Parse token amounts
export const parseTokenAmount = (
  amount: string,
  decimals: number
): BigNumber => {
  return ethers.utils.parseUnits(amount, decimals)
}

// Calculate APY
export const calculateAPY = (
  rewardRate: BigNumber,
  totalSupply: BigNumber,
  rewardTokenPrice: number,
  stakedTokenPrice: number
): number => {
  if (totalSupply.isZero()) return 0
  
  const rewardPerYear = rewardRate.mul(365 * 24 * 60 * 60)
  const rewardValuePerYear = parseFloat(ethers.utils.formatEther(rewardPerYear)) * rewardTokenPrice
  const totalStakedValue = parseFloat(ethers.utils.formatEther(totalSupply)) * stakedTokenPrice
  
  return (rewardValuePerYear / totalStakedValue) * 100
}

// Calculate rewards
export const calculateRewards = (
  stakedAmount: string,
  apy: number,
  days: number
): string => {
  const amount = parseFloat(stakedAmount)
  const rewards = amount * (apy / 100) * (days / 365)
  return rewards.toFixed(6)
}

// Calculate time remaining
export const calculateTimeRemaining = (unlockTime: Date): string => {
  const now = new Date()
  const diff = unlockTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'Unlocked'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

// Format USD value
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Format percentage
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`
}

// Shorten address
export const shortenAddress = (address: string, chars: number = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

// Get transaction explorer URL
export const getExplorerUrl = (hash: string, chainId: number): string => {
  const explorers: Record<number, string> = {
    997: 'https://testnet.explorer.somnia.network'
  }
  return `${explorers[chainId]}/tx/${hash}`
}

// Calculate weighted average APY
export const calculateWeightedAPY = (positions: StakingPosition[]): number => {
  if (positions.length === 0) return 0
  
  const totalStaked = positions.reduce((sum, pos) => sum + pos.stakedAmountUSD, 0)
  if (totalStaked === 0) return 0
  
  const weightedSum = positions.reduce((sum, pos) => {
    return sum + (pos.apy * pos.stakedAmountUSD)
  }, 0)
  
  return weightedSum / totalStaked
}

// Check if position is locked
export const isPositionLocked = (position: StakingPosition): boolean => {
  return new Date() < position.unlocksAt
}

// Calculate fees
export const calculateFees = (
  amount: string,
  feePercentage: number
): string => {
  const amountNum = parseFloat(amount)
  const fee = amountNum * (feePercentage / 100)
  return fee.toFixed(6)
}

// Calculate net amount after fees
export const calculateNetAmount = (
  amount: string,
  feePercentage: number
): string => {
  const amountNum = parseFloat(amount)
  const fee = amountNum * (feePercentage / 100)
  return (amountNum - fee).toFixed(6)
}
```

#### stakingConstants.ts

**Purpose**: Constantes de configuración

```typescript
// Network configuration
export const SOMNIA_TESTNET = {
  chainId: 997,
  chainName: 'Somnia Testnet',
  rpcUrl: 'https://testnet.rpc.somnia.network',
  blockExplorer: 'https://testnet.explorer.somnia.network',
  nativeCurrency: {
    name: 'Somnia Test Token',
    symbol: 'STT',
    decimals: 18
  }
}

// Contract addresses (mock - replace with actual)
export const STAKING_POOLS = {
  USDC: {
    address: '0x1234567890123456789012345678901234567890',
    token: '0x0987654321098765432109876543210987654321',
    name: 'USDC Staking Pool',
    symbol: 'USDC'
  },
  USDT: {
    address: '0x2345678901234567890123456789012345678901',
    token: '0x1987654321098765432109876543210987654321',
    name: 'USDT Staking Pool',
    symbol: 'USDT'
  },
  ARB: {
    address: '0x3456789012345678901234567890123456789012',
    token: '0x2987654321098765432109876543210987654321',
    name: 'ARB Staking Pool',
    symbol: 'ARB'
  }
}

// Query configuration
export const QUERY_CONFIG = {
  STALE_TIME: {
    POOLS: 30000, // 30 seconds
    POSITIONS: 10000, // 10 seconds
    BALANCE: 5000, // 5 seconds
    TRANSACTIONS: 60000, // 1 minute
    PREDICTIONS: 300000 // 5 minutes
  },
  REFETCH_INTERVAL: {
    POOLS: 60000, // 1 minute
    POSITIONS: 30000, // 30 seconds
    BALANCE: 15000, // 15 seconds
    REWARDS: 10000 // 10 seconds
  }
}

// UI configuration
export const UI_CONFIG = {
  SKELETON_COUNT: 3,
  TRANSACTIONS_PER_PAGE: 10,
  CHART_PERIODS: [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 }
  ],
  DEFAULT_SLIPPAGE: 0.5, // 0.5%
  MAX_SLIPPAGE: 5, // 5%
}

// Validation limits
export const VALIDATION_LIMITS = {
  MIN_STAKE_USD: 10,
  MAX_STAKE_USD: 1000000,
  MIN_WITHDRAW_USD: 1,
  GAS_LIMIT_BUFFER: 1.2 // 20% buffer
}

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  WRONG_NETWORK: 'Please switch to Somnia Testnet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TRANSACTION_REJECTED: 'Transaction rejected by user',
  TRANSACTION_FAILED: 'Transaction failed',
  POSITION_LOCKED: 'Position is still locked',
  POOL_NOT_FOUND: 'Pool not found',
  NETWORK_ERROR: 'Network error. Please try again',
  UNKNOWN_ERROR: 'An unknown error occurred'
}

// Success messages
export const SUCCESS_MESSAGES = {
  STAKE_SUCCESS: 'Successfully staked tokens',
  WITHDRAW_SUCCESS: 'Successfully withdrawn tokens',
  CLAIM_SUCCESS: 'Successfully claimed rewards',
  APPROVE_SUCCESS: 'Token approval successful'
}
```


## Error Handling

### Error Handling Strategy

```typescript
// Error types
export class StakingError extends Error {
  constructor(
    message: string,
    public code: StakingErrorCode,
    public details?: any,
    public recoverable: boolean = true
  ) {
    super(message)
    this.name = 'StakingError'
  }
}

export enum StakingErrorCode {
  // Wallet errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WRONG_NETWORK = 'WRONG_NETWORK',
  
  // Balance errors
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_ALLOWANCE = 'INSUFFICIENT_ALLOWANCE',
  
  // Pool errors
  POOL_NOT_FOUND = 'POOL_NOT_FOUND',
  POOL_INACTIVE = 'POOL_INACTIVE',
  POOL_FULL = 'POOL_FULL',
  
  // Position errors
  POSITION_NOT_FOUND = 'POSITION_NOT_FOUND',
  POSITION_LOCKED = 'POSITION_LOCKED',
  NO_REWARDS = 'NO_REWARDS',
  
  // Transaction errors
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  
  // Validation errors
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  AMOUNT_TOO_LOW = 'AMOUNT_TOO_LOW',
  AMOUNT_TOO_HIGH = 'AMOUNT_TOO_HIGH',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Error handler
export const handleStakingError = (error: any): StakingError => {
  // ethers.js errors
  if (error.code === 'ACTION_REJECTED') {
    return new StakingError(
      ERROR_MESSAGES.TRANSACTION_REJECTED,
      StakingErrorCode.TRANSACTION_REJECTED,
      error,
      false
    )
  }
  
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return new StakingError(
      ERROR_MESSAGES.INSUFFICIENT_BALANCE,
      StakingErrorCode.INSUFFICIENT_BALANCE,
      error,
      false
    )
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return new StakingError(
      ERROR_MESSAGES.NETWORK_ERROR,
      StakingErrorCode.NETWORK_ERROR,
      error,
      true
    )
  }
  
  // Contract errors
  if (error.reason) {
    return new StakingError(
      error.reason,
      StakingErrorCode.TRANSACTION_FAILED,
      error,
      false
    )
  }
  
  // Already a StakingError
  if (error instanceof StakingError) {
    return error
  }
  
  // Unknown error
  return new StakingError(
    ERROR_MESSAGES.UNKNOWN_ERROR,
    StakingErrorCode.UNKNOWN_ERROR,
    error,
    true
  )
}

// Error recovery actions
export const getErrorRecoveryAction = (error: StakingError): RecoveryAction => {
  switch (error.code) {
    case StakingErrorCode.WALLET_NOT_CONNECTED:
      return {
        type: 'action',
        label: 'Connect Wallet',
        action: 'connect_wallet'
      }
    
    case StakingErrorCode.WRONG_NETWORK:
      return {
        type: 'action',
        label: 'Switch Network',
        action: 'switch_network'
      }
    
    case StakingErrorCode.INSUFFICIENT_ALLOWANCE:
      return {
        type: 'action',
        label: 'Approve Token',
        action: 'approve_token'
      }
    
    case StakingErrorCode.NETWORK_ERROR:
    case StakingErrorCode.RPC_ERROR:
      return {
        type: 'retry',
        label: 'Try Again',
        delay: 3000
      }
    
    default:
      return {
        type: 'dismiss',
        label: 'Dismiss'
      }
  }
}

interface RecoveryAction {
  type: 'action' | 'retry' | 'dismiss'
  label: string
  action?: string
  delay?: number
}
```

### Error Display Component

```typescript
// ErrorAlert.tsx
interface ErrorAlertProps {
  error: StakingError
  onRetry?: () => void
  onDismiss?: () => void
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onRetry, 
  onDismiss 
}) => {
  const recovery = getErrorRecoveryAction(error)
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message}
        {recovery.type === 'retry' && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="mt-2"
          >
            {recovery.label}
          </Button>
        )}
        {recovery.type === 'dismiss' && onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="mt-2"
          >
            {recovery.label}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
```

## Testing Strategy

### Unit Tests

**Test Coverage Areas**:

1. **Utility Functions** (stakingUtils.ts)
   - Token amount formatting
   - APY calculations
   - Rewards calculations
   - Time remaining calculations
   - Fee calculations

2. **Validators** (stakingValidators.ts)
   - Stake amount validation
   - Withdraw amount validation
   - Network validation
   - Address validation

3. **Services** (stakingService.ts, poolService.ts)
   - Mock contract interactions
   - Error handling
   - Data transformations

**Example Test**:
```typescript
// stakingUtils.test.ts
import { describe, it, expect } from 'vitest'
import { calculateRewards, formatTokenAmount } from './stakingUtils'

describe('stakingUtils', () => {
  describe('calculateRewards', () => {
    it('should calculate rewards correctly', () => {
      const rewards = calculateRewards('1000', 10, 365)
      expect(rewards).toBe('100.000000')
    })
    
    it('should calculate rewards for partial year', () => {
      const rewards = calculateRewards('1000', 10, 30)
      expect(parseFloat(rewards)).toBeCloseTo(8.219, 2)
    })
  })
  
  describe('formatTokenAmount', () => {
    it('should format token amount correctly', () => {
      const formatted = formatTokenAmount('1000000000000000000', 18, 2)
      expect(formatted).toBe('1.00')
    })
  })
})
```

### Integration Tests

**Test Coverage Areas**:

1. **Modal Flows**
   - Open modal → Input amount → Validate → Submit → Success
   - Open modal → Input invalid amount → Show error
   - Open modal → Reject transaction → Show error

2. **Hook Integration**
   - useStaking hook with mock data
   - Query invalidation after mutations
   - Error handling in hooks

**Example Test**:
```typescript
// StakeModal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StakeModal } from './StakeModal'

describe('StakeModal', () => {
  it('should display pool information', () => {
    const pool = {
      name: 'USDC Pool',
      apy: 10,
      // ... other props
    }
    
    render(<StakeModal pool={pool} isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByText('USDC Pool')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })
  
  it('should validate insufficient balance', async () => {
    // Mock balance
    vi.mock('./useWalletBalance', () => ({
      useWalletBalance: () => ({ data: { balance: '100' } })
    }))
    
    render(<StakeModal pool={mockPool} isOpen={true} onClose={() => {}} />)
    
    const input = screen.getByLabelText('Amount')
    fireEvent.change(input, { target: { value: '200' } })
    
    await waitFor(() => {
      expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument()
    })
  })
})
```

### E2E Tests (Optional)

**Test Scenarios**:
1. Complete stake flow with MetaMask
2. Complete withdraw flow
3. Complete claim flow
4. Filter and search pools
5. View transaction history

## Performance Optimization

### Optimization Strategies

1. **Query Optimization**
   - Appropriate stale times
   - Selective refetching
   - Query key structure for granular invalidation

2. **Component Optimization**
   - React.memo for expensive components
   - useMemo for expensive calculations
   - useCallback for stable function references

3. **Data Fetching**
   - Parallel queries where possible
   - Prefetching on hover
   - Optimistic updates for mutations

4. **Rendering Optimization**
   - Virtual scrolling for long lists
   - Lazy loading for modals
   - Skeleton loaders to prevent layout shift

**Example Optimizations**:

```typescript
// Memoized pool row
export const PoolRow = React.memo<PoolRowProps>(({ pool }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.pool.id === nextProps.pool.id &&
         prevProps.pool.apy === nextProps.pool.apy &&
         prevProps.pool.tvl === nextProps.pool.tvl
})

// Prefetch on hover
const handlePoolHover = (poolAddress: string) => {
  queryClient.prefetchQuery({
    queryKey: ['staking', 'pool', poolAddress],
    queryFn: () => poolService.fetchPoolData(poolAddress)
  })
}

// Optimistic update
const stakeMutation = useMutation({
  mutationFn: stakeTokens,
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['staking', 'positions'] })
    
    // Snapshot previous value
    const previousPositions = queryClient.getQueryData(['staking', 'positions'])
    
    // Optimistically update
    queryClient.setQueryData(['staking', 'positions'], (old) => {
      return [...old, createOptimisticPosition(variables)]
    })
    
    return { previousPositions }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['staking', 'positions'], context.previousPositions)
  }
})
```


## Responsive Design

### Breakpoints

Following Tailwind CSS defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Layout Adaptations

#### Mobile (< 768px)
- Single column layout
- Full-width modals
- Stacked stat cards
- Simplified table → card view
- Bottom sheet for filters
- Larger touch targets (min 44x44px)

#### Tablet (768px - 1024px)
- Two column grid for positions
- Table view for pools
- Side drawer for filters
- Standard modals

#### Desktop (> 1024px)
- Multi-column layouts
- Full table views
- Inline filters
- Hover interactions
- Larger charts

### Responsive Components

```typescript
// Example: Responsive PoolRow
export const PoolRow: React.FC<PoolRowProps> = ({ pool }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  if (isMobile) {
    return <PoolCard pool={pool} /> // Card view
  }
  
  return <PoolTableRow pool={pool} /> // Table row
}

// Example: Responsive Modal
export const StakeModal: React.FC<StakeModalProps> = (props) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  if (isMobile) {
    return (
      <Sheet open={props.isOpen} onOpenChange={props.onClose}>
        <SheetContent side="bottom" className="h-[90vh]">
          <StakeModalContent {...props} />
        </SheetContent>
      </Sheet>
    )
  }
  
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-md">
        <StakeModalContent {...props} />
      </DialogContent>
    </Dialog>
  )
}
```

## Accessibility

### WCAG 2.1 AA Compliance

1. **Keyboard Navigation**
   - All interactive elements accessible via Tab
   - Modal focus trap
   - Escape to close modals
   - Arrow keys for table navigation

2. **Screen Reader Support**
   - Semantic HTML
   - ARIA labels for all buttons
   - ARIA live regions for dynamic updates
   - ARIA descriptions for complex interactions

3. **Visual Accessibility**
   - Minimum contrast ratio 4.5:1
   - Focus indicators on all interactive elements
   - No information conveyed by color alone
   - Scalable text (rem units)

4. **Motion**
   - Respect prefers-reduced-motion
   - Optional animations
   - No auto-playing animations

### Accessibility Implementation

```typescript
// Example: Accessible button
<Button
  onClick={handleStake}
  aria-label={`Stake tokens in ${pool.name}`}
  aria-describedby="stake-description"
>
  Stake
</Button>
<span id="stake-description" className="sr-only">
  Opens a modal to stake tokens in {pool.name} with {pool.apy}% APY
</span>

// Example: Live region for updates
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {isStaking && 'Transaction in progress'}
  {isSuccess && 'Transaction successful'}
  {isError && `Error: ${error.message}`}
</div>

// Example: Reduced motion
const shouldReduceMotion = useReducedMotion()

<motion.div
  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
>
  {content}
</motion.div>
```

## Security Considerations

### Smart Contract Security

1. **Input Validation**
   - Validate all amounts on frontend
   - Check allowances before transactions
   - Verify contract addresses

2. **Transaction Safety**
   - Display transaction preview
   - Show gas estimates
   - Warn about high slippage
   - Confirm destructive actions

3. **Network Security**
   - Verify chain ID
   - Use secure RPC endpoints
   - Handle network switches safely

### Frontend Security

1. **Data Sanitization**
   - Sanitize user inputs
   - Validate addresses
   - Prevent XSS attacks

2. **Private Key Safety**
   - Never request private keys
   - Use wallet providers only
   - Clear sensitive data from memory

3. **API Security**
   - Rate limiting for AI predictions
   - API key management
   - CORS configuration

## Deployment Considerations

### Environment Variables

```bash
# .env.example
VITE_SOMNIA_RPC_URL=https://testnet.rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=997
VITE_SOMNIA_EXPLORER=https://testnet.explorer.somnia.network

# Contract addresses
VITE_USDC_POOL_ADDRESS=0x...
VITE_USDT_POOL_ADDRESS=0x...
VITE_ARB_POOL_ADDRESS=0x...

# Token addresses
VITE_USDC_ADDRESS=0x...
VITE_USDT_ADDRESS=0x...
VITE_ARB_ADDRESS=0x...

# Optional: AI service
VITE_VERTEX_AI_PROJECT_ID=your-project-id
VITE_VERTEX_AI_LOCATION=us-central1
VITE_VERTEX_AI_API_KEY=your-api-key

# Optional: DIA Oracle
VITE_DIA_ORACLE_URL=https://api.diadata.org
```

### Build Configuration

```typescript
// vite.config.ts additions
export default defineConfig({
  // ... existing config
  define: {
    'process.env.VITE_SOMNIA_RPC_URL': JSON.stringify(process.env.VITE_SOMNIA_RPC_URL),
    'process.env.VITE_SOMNIA_CHAIN_ID': JSON.stringify(process.env.VITE_SOMNIA_CHAIN_ID),
  },
  build: {
    sourcemap: true, // For debugging
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ethers': ['ethers'],
          'vendor-react': ['react', 'react-dom'],
          'vendor-query': ['@tanstack/react-query'],
        }
      }
    }
  }
})
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Contract addresses verified
- [ ] RPC endpoints tested
- [ ] Build optimized and tested
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (optional)
- [ ] Performance monitoring enabled
- [ ] Accessibility audit passed
- [ ] Security audit completed
- [ ] Documentation updated

## Future Enhancements

### Phase 2 Features

1. **Auto-Compound**
   - Automatic reward reinvestment
   - Configurable compound frequency
   - Gas optimization

2. **Multi-Token Pools**
   - LP token staking
   - Multiple reward tokens
   - Complex reward calculations

3. **Governance Integration**
   - Voting power from staked tokens
   - Proposal creation
   - Delegation

4. **Advanced Analytics**
   - Portfolio performance tracking
   - Comparative analysis
   - Risk metrics

5. **Social Features**
   - Leaderboards
   - Share positions
   - Copy trading

### AI Enhancements

1. **Advanced Predictions**
   - Multi-factor analysis
   - Market sentiment integration
   - Risk-adjusted recommendations

2. **Personalized Strategies**
   - User risk profile
   - Custom recommendations
   - Portfolio optimization

3. **Automated Rebalancing**
   - AI-driven rebalancing
   - Tax-loss harvesting
   - Yield optimization

## Diagrams

### User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Arrives at Stake Page               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Wallet Connected? │
                  └──────────────────┘
                     │            │
                    No           Yes
                     │            │
                     ▼            ▼
            ┌──────────────┐  ┌──────────────────┐
            │ Show Connect │  │ Load User Data   │
            │ Wallet CTA   │  │ - Positions      │
            └──────────────┘  │ - Balances       │
                              │ - Transactions   │
                              └──────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │ Display Dashboard        │
                        │ - Header Stats           │
                        │ - User Positions         │
                        │ - Available Pools        │
                        │ - History & Charts       │
                        └──────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Stake Action │  │Withdraw Action│  │ Claim Action │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Open Modal   │  │ Open Modal   │  │ Open Modal   │
            │ - Input      │  │ - Input      │  │ - Confirm    │
            │ - Validate   │  │ - Validate   │  │ - Preview    │
            │ - Preview    │  │ - Preview    │  └──────────────┘
            └──────────────┘  └──────────────┘          │
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Approve?     │  │ Execute TX   │  │ Execute TX   │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Execute TX   │  │ Wait for     │  │ Wait for     │
            └──────────────┘  │ Confirmation │  │ Confirmation │
                    │         └──────────────┘  └──────────────┘
                    ▼                 │                 │
            ┌──────────────┐          │                 │
            │ Wait for     │          │                 │
            │ Confirmation │          │                 │
            └──────────────┘          │                 │
                    │                 │                 │
                    └─────────────────┴─────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │ Show Success Message     │
                        │ Refresh Data             │
                        │ Update UI                │
                        └──────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Components                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Modals  │  │  Tables  │  │  Charts  │  │  Cards   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Custom Hooks                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ useStaking   │  │ usePools     │  │ usePositions │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    TanStack Query                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Queries    │  │  Mutations   │  │    Cache     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Services                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Staking     │  │    Pool      │  │   Rewards    │     │
│  │  Service     │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   ethers.js  │    │ DIA Oracle   │    │  Vertex AI   │
│   Provider   │    │     API      │    │     API      │
└──────────────┘    └──────────────┘    └──────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Somnia     │    │   Price      │    │     AI       │
│   Testnet    │    │    Data      │    │ Predictions  │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Summary

Este diseño proporciona una arquitectura completa y escalable para la funcionalidad de staking en OctoFi. Los componentes están organizados siguiendo Atomic Design, con una clara separación de responsabilidades entre presentación, lógica de negocio y acceso a datos.

Las características clave incluyen:
- Integración completa con Somnia Testnet blockchain
- Modales interactivos para todas las operaciones
- Validaciones robustas con Zod
- Estados de UI apropiados (loading, empty, error)
- Predicciones de APY potenciadas por AI
- Diseño responsive y accesible
- Manejo de errores resiliente
- Optimizaciones de rendimiento

La implementación está lista para ser desarrollada siguiendo el plan de tareas que se creará a continuación.
