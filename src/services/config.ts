/**
 * Configuration for AI-Enhanced Swap Interface services
 * Centralized configuration management for all services
 */

// Environment variables with defaults
export const config = {
  // AI Service Configuration
  ai: {
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    vertexAiProjectId: import.meta.env.VITE_VERTEX_AI_PROJECT_ID || '',
    vertexAiLocation: import.meta.env.VITE_VERTEX_AI_LOCATION || 'us-central1',
    predictionCacheTime: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000,
    enabled: import.meta.env.VITE_AI_ENABLED !== 'false'
  },

  // Data Service Configuration
  data: {
    diaOracleUrl: import.meta.env.VITE_DIA_ORACLE_URL || 'https://api.diadata.org/v1',
    coingeckoApiKey: import.meta.env.VITE_COINGECKO_API_KEY || '',
    coingeckoUrl: 'https://api.coingecko.com/api/v3',
    priceUpdateInterval: 5000, // 5 seconds
    websocketReconnectDelay: 3000,
    maxWebsocketRetries: 5,
    cacheTimeout: 60000 // 1 minute
  },

  // Blockchain Configuration
  blockchain: {
    somniaTestnet: {
      chainId: 50311,
      name: 'Somnia Testnet',
      rpcUrl: import.meta.env.VITE_SOMNIA_RPC_URL || 'https://testnet.somnia.network',
      blockExplorerUrl: 'https://testnet-explorer.somnia.network',
      nativeCurrency: {
        name: 'STT',
        symbol: 'STT',
        decimals: 18
      }
    },
    ethereum: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
      blockExplorerUrl: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    }
  },

  // Wallet Configuration
  wallet: {
    connectTimeout: 10000, // 10 seconds
    transactionTimeout: 300000, // 5 minutes
    defaultGasLimit: '200000',
    gasLimitMultiplier: 1.2,
    maxGasPrice: '100000000000', // 100 gwei
    slippageDefault: 0.5, // 0.5%
    slippageMax: 5.0, // 5%
    deadlineDefault: 1200 // 20 minutes
  },

  // Trading Agent Configuration
  agent: {
    enabled: import.meta.env.VITE_AGENT_ENABLED !== 'false',
    maxPositionSize: 0.1, // 10% of portfolio
    riskThreshold: 0.7, // 70% confidence required
    stopLossDefault: 0.05, // 5%
    takeProfitDefault: 0.15, // 15%
    rebalanceThreshold: 0.02, // 2%
    cooldownPeriod: 300000, // 5 minutes between trades
    volatilityThreshold: 0.1, // 10% volatility pause threshold
    performanceTrackingPeriod: 86400000 // 24 hours
  },

  // API Rate Limits
  rateLimits: {
    aiService: {
      requestsPerMinute: 60,
      burstLimit: 10
    },
    dataService: {
      requestsPerMinute: 300,
      burstLimit: 50
    },
    priceUpdates: {
      requestsPerSecond: 10
    }
  },

  // Feature Flags
  features: {
    aiInsights: import.meta.env.VITE_FEATURE_AI_INSIGHTS !== 'false',
    crossChain: import.meta.env.VITE_FEATURE_CROSS_CHAIN !== 'false',
    tradingAgent: import.meta.env.VITE_FEATURE_TRADING_AGENT !== 'false',
    priceCharts: import.meta.env.VITE_FEATURE_PRICE_CHARTS !== 'false',
    gasOptimization: import.meta.env.VITE_FEATURE_GAS_OPTIMIZATION !== 'false',
    mobileOptimizations: true,
    offlineMode: import.meta.env.VITE_FEATURE_OFFLINE_MODE !== 'false'
  },

  // Development Configuration
  development: {
    mockAiResponses: import.meta.env.VITE_MOCK_AI_RESPONSES === 'true',
    mockPriceData: import.meta.env.VITE_MOCK_PRICE_DATA === 'true',
    enableDebugLogs: import.meta.env.NODE_ENV === 'development',
    simulateNetworkDelay: import.meta.env.VITE_SIMULATE_NETWORK_DELAY === 'true',
    networkDelayMs: 1000
  }
} as const

// Validation function to check required configuration
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check AI configuration if enabled
  if (config.features.aiInsights && config.ai.enabled) {
    if (!config.ai.openaiApiKey && !config.ai.vertexAiProjectId) {
      errors.push('AI service enabled but no API keys provided (VITE_OPENAI_API_KEY or VITE_VERTEX_AI_PROJECT_ID)')
    }
  }

  // Check blockchain RPC URLs
  if (!config.blockchain.somniaTestnet.rpcUrl) {
    errors.push('Somnia testnet RPC URL not configured (VITE_SOMNIA_RPC_URL)')
  }

  // Validate numeric configurations
  if (config.wallet.slippageDefault > config.wallet.slippageMax) {
    errors.push('Default slippage cannot be greater than maximum slippage')
  }

  if (config.agent.maxPositionSize > 1.0) {
    errors.push('Maximum position size cannot exceed 100%')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Helper function to get chain configuration
export function getChainConfig(chainId: number) {
  switch (chainId) {
    case 50311:
      return config.blockchain.somniaTestnet
    case 1:
      return config.blockchain.ethereum
    default:
      return null
  }
}

// Helper function to check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature]
}

// Export types for TypeScript
export type Config = typeof config
export type ChainConfig = typeof config.blockchain.somniaTestnet