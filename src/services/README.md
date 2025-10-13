# AI-Enhanced Swap Interface Services

This directory contains the service layer for the AI-Enhanced Swap Interface, providing a clean separation between business logic and UI components.

## Architecture Overview

The service layer follows a modular architecture with clear interfaces and dependency injection patterns:

```
src/services/
├── types.ts              # Core type definitions
├── interfaces.ts         # Service interfaces and contracts
├── config.ts            # Configuration management
├── errorHandler.ts      # Centralized error handling
├── utils.ts             # Common utility functions
├── index.ts             # Main export file
└── README.md           # This documentation
```

## Core Services (To be implemented)

### 1. AI Insights Service
- **Purpose**: Provides market predictions and sentiment analysis
- **Interface**: `AIInsightsService`
- **Features**: 
  - Market predictions with confidence scores
  - Risk assessment for swap parameters
  - Real-time AI updates via WebSocket

### 2. Data Service
- **Purpose**: Fetches real-time market data and on-chain information
- **Interface**: `DataService`
- **Features**:
  - Live token prices from DIA Oracle
  - Liquidity data and gas estimates
  - WebSocket price subscriptions

### 3. Wallet Service
- **Purpose**: Handles wallet connections and transaction execution
- **Interface**: `WalletService`
- **Features**:
  - Multi-wallet support (MetaMask, WalletConnect)
  - Chain switching and validation
  - Transaction execution and monitoring

### 4. Trading Agent Service
- **Purpose**: Enables autonomous trading based on AI predictions
- **Interface**: `TradingAgent`
- **Features**:
  - Strategy-based automated trading
  - Risk management and performance tracking
  - Real-time action logging

## Key Features

### Error Handling
- Centralized error handling with recovery strategies
- Automatic retry logic with exponential backoff
- Graceful degradation for service failures

### Configuration Management
- Environment-based configuration
- Feature flags for gradual rollouts
- Validation for required settings

### Type Safety
- Comprehensive TypeScript interfaces
- Strict type checking for all service interactions
- Runtime type validation where needed

### Performance Optimization
- Debounced API calls to prevent rate limiting
- Caching strategies for frequently accessed data
- WebSocket connections for real-time updates

## Usage Examples

### Basic Service Usage
```typescript
import { AIInsightsService, DataService } from '@/services'

// Get market prediction
const prediction = await aiService.getPrediction({ fromToken, toToken })

// Subscribe to price updates
const subscription = dataService.subscribeToPrice(token, (price) => {
  console.log('New price:', price)
})
```

### Error Handling
```typescript
import { errorHandler } from '@/services'

try {
  const result = await riskyOperation()
} catch (error) {
  const recovery = errorHandler.handleNetworkError(error)
  // Handle recovery action
}
```

### Configuration
```typescript
import { config, isFeatureEnabled } from '@/services'

if (isFeatureEnabled('aiInsights')) {
  // Initialize AI service
}
```

## Development Guidelines

### Adding New Services
1. Define interfaces in `interfaces.ts`
2. Add types to `types.ts` if needed
3. Implement service with proper error handling
4. Add configuration options to `config.ts`
5. Export from `index.ts`

### Testing Strategy
- Mock service interfaces for unit tests
- Use dependency injection for testability
- Test error scenarios and recovery actions
- Validate configuration and type safety

### Performance Considerations
- Use debouncing for user input handlers
- Implement caching for expensive operations
- Monitor API rate limits and usage
- Optimize WebSocket connection management

## Environment Variables

Required environment variables for full functionality:

```bash
# AI Service
VITE_OPENAI_API_KEY=your_openai_key
VITE_VERTEX_AI_PROJECT_ID=your_vertex_project

# Data Sources
VITE_DIA_ORACLE_URL=https://api.diadata.org/v1
VITE_COINGECKO_API_KEY=your_coingecko_key

# Blockchain
VITE_SOMNIA_RPC_URL=https://testnet.somnia.network
VITE_ETHEREUM_RPC_URL=https://eth.llamarpc.com

# Feature Flags
VITE_FEATURE_AI_INSIGHTS=true
VITE_FEATURE_TRADING_AGENT=true
VITE_FEATURE_CROSS_CHAIN=true
```

## Next Steps

The following services will be implemented in subsequent tasks:

1. **Task 1.1**: AI Insights Service implementation
2. **Task 1.2**: Real-time Data Service implementation  
3. **Task 1.3**: Enhanced State Management
4. **Task 4.1**: Trading Agent Service implementation

Each service will follow the interfaces defined here and integrate with the error handling and configuration systems.