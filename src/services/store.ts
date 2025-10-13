/**
 * Enhanced State Management for AI-Enhanced Swap Interface
 * Uses Zustand for efficient state management with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'
import { 
  Token, 
  MarketPrediction, 
  TradingStrategy, 
  PerformanceMetrics,
  SwapFormState,
  AIUpdate,
  TokenPrice,
  RiskScore
} from './types'
import { logger } from './errorHandler'

// Enhanced Swap Form State
interface EnhancedSwapState extends SwapFormState {
  // AI-related state
  currentPrediction: MarketPrediction | null
  riskAssessment: RiskScore | null
  aiUpdates: AIUpdate[]
  
  // Real-time data
  fromTokenPrice: TokenPrice | null
  toTokenPrice: TokenPrice | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setSlippage: (slippage: number) => void
  setGasPrice: (gasPrice: 'slow' | 'standard' | 'fast') => void
  setCrossChain: (crossChain: boolean) => void
  setPrediction: (prediction: MarketPrediction | null) => void
  setRiskAssessment: (risk: RiskScore | null) => void
  addAIUpdate: (update: AIUpdate) => void
  clearAIUpdates: () => void
  setFromTokenPrice: (price: TokenPrice | null) => void
  setToTokenPrice: (price: TokenPrice | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  swapTokens: () => void
  reset: () => void
}

// Trading Agent State
interface TradingAgentState {
  isActive: boolean
  strategy: TradingStrategy | null
  performance: PerformanceMetrics | null
  
  // Actions
  setActive: (active: boolean) => void
  setStrategy: (strategy: TradingStrategy | null) => void
  setPerformance: (performance: PerformanceMetrics | null) => void
  reset: () => void
}

// User Preferences State
interface UserPreferencesState {
  // UI preferences
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  
  // Trading preferences
  defaultSlippage: number
  defaultGasPrice: 'slow' | 'standard' | 'fast'
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  
  // Notification preferences
  enableAINotifications: boolean
  enablePriceAlerts: boolean
  enableAgentNotifications: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: string) => void
  setCurrency: (currency: string) => void
  setDefaultSlippage: (slippage: number) => void
  setDefaultGasPrice: (gasPrice: 'slow' | 'standard' | 'fast') => void
  setRiskTolerance: (tolerance: 'conservative' | 'moderate' | 'aggressive') => void
  setEnableAINotifications: (enable: boolean) => void
  setEnablePriceAlerts: (enable: boolean) => void
  setEnableAgentNotifications: (enable: boolean) => void
  reset: () => void
}

// Application State (non-persisted)
interface AppState {
  // Connection state
  isWalletConnected: boolean
  connectedAccount: string | null
  currentChainId: number | null
  
  // Service availability
  isAIServiceAvailable: boolean
  isDataServiceAvailable: boolean
  
  // Real-time updates
  lastPriceUpdate: Date | null
  lastAIUpdate: Date | null
  
  // Actions
  setWalletConnected: (connected: boolean) => void
  setConnectedAccount: (account: string | null) => void
  setCurrentChainId: (chainId: number | null) => void
  setAIServiceAvailable: (available: boolean) => void
  setDataServiceAvailable: (available: boolean) => void
  setLastPriceUpdate: (date: Date) => void
  setLastAIUpdate: (date: Date) => void
  reset: () => void
}

// Default values
const defaultSwapState: Omit<EnhancedSwapState, keyof any> = {
  fromToken: null,
  toToken: null,
  fromAmount: '',
  toAmount: '0.0',
  slippage: 0.5,
  gasPrice: 'standard',
  crossChain: false,
  aiRecommendations: [],
  currentPrediction: null,
  riskAssessment: null,
  aiUpdates: [],
  fromTokenPrice: null,
  toTokenPrice: null,
  isLoading: false,
  error: null
}

const defaultTradingAgentState: Omit<TradingAgentState, keyof any> = {
  isActive: false,
  strategy: null,
  performance: null
}

const defaultUserPreferences: Omit<UserPreferencesState, keyof any> = {
  theme: 'dark',
  language: 'en',
  currency: 'USD',
  defaultSlippage: 0.5,
  defaultGasPrice: 'standard',
  riskTolerance: 'moderate',
  enableAINotifications: true,
  enablePriceAlerts: true,
  enableAgentNotifications: true
}

const defaultAppState: Omit<AppState, keyof any> = {
  isWalletConnected: false,
  connectedAccount: null,
  currentChainId: null,
  isAIServiceAvailable: true,
  isDataServiceAvailable: true,
  lastPriceUpdate: null,
  lastAIUpdate: null
}

// Create stores
export const useSwapStore = create<EnhancedSwapState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...defaultSwapState,
        
        setFromToken: (token) => {
          set({ fromToken: token, error: null })
          logger.debug('From token updated', { token: token?.symbol })
        },
        
        setToToken: (token) => {
          set({ toToken: token, error: null })
          logger.debug('To token updated', { token: token?.symbol })
        },
        
        setFromAmount: (amount) => {
          set({ fromAmount: amount, error: null })
        },
        
        setToAmount: (amount) => {
          set({ toAmount: amount })
        },
        
        setSlippage: (slippage) => {
          if (slippage >= 0.1 && slippage <= 5.0) {
            set({ slippage })
          }
        },
        
        setGasPrice: (gasPrice) => {
          set({ gasPrice })
        },
        
        setCrossChain: (crossChain) => {
          set({ crossChain })
        },
        
        setPrediction: (prediction) => {
          set({ currentPrediction: prediction })
          if (prediction) {
            logger.debug('AI prediction updated', { 
              direction: prediction.direction, 
              confidence: prediction.confidence 
            })
          }
        },
        
        setRiskAssessment: (risk) => {
          set({ riskAssessment: risk })
          if (risk && risk.overall > 70) {
            logger.warn('High risk assessment detected', { riskScore: risk.overall })
          }
        },
        
        addAIUpdate: (update) => {
          const { aiUpdates } = get()
          const newUpdates = [update, ...aiUpdates].slice(0, 50) // Keep last 50 updates
          set({ aiUpdates: newUpdates })
        },
        
        clearAIUpdates: () => {
          set({ aiUpdates: [] })
        },
        
        setFromTokenPrice: (price) => {
          set({ fromTokenPrice: price })
        },
        
        setToTokenPrice: (price) => {
          set({ toTokenPrice: price })
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading })
        },
        
        setError: (error) => {
          set({ error })
          if (error) {
            logger.error('Swap error set', new Error(error))
          }
        },
        
        swapTokens: () => {
          const { fromToken, toToken, fromAmount, toAmount } = get()
          set({
            fromToken: toToken,
            toToken: fromToken,
            fromAmount: toAmount,
            toAmount: fromAmount,
            currentPrediction: null,
            riskAssessment: null
          })
          logger.debug('Tokens swapped')
        },
        
        reset: () => {
          set(defaultSwapState)
          logger.debug('Swap state reset')
        }
      }),
      {
        name: 'swap-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Only persist user preferences, not real-time data
          slippage: state.slippage,
          gasPrice: state.gasPrice,
          crossChain: state.crossChain
        })
      }
    )
  )
)

export const useTradingAgentStore = create<TradingAgentState>()(
  persist(
    (set) => ({
      ...defaultTradingAgentState,
      
      setActive: (active) => {
        set({ isActive: active })
        logger.info(`Trading agent ${active ? 'activated' : 'deactivated'}`)
      },
      
      setStrategy: (strategy) => {
        set({ strategy })
        if (strategy) {
          logger.info('Trading strategy updated', { 
            riskTolerance: strategy.riskTolerance,
            maxSlippage: strategy.maxSlippage 
          })
        }
      },
      
      setPerformance: (performance) => {
        set({ performance })
      },
      
      reset: () => {
        set(defaultTradingAgentState)
        logger.debug('Trading agent state reset')
      }
    }),
    {
      name: 'trading-agent-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      ...defaultUserPreferences,
      
      setTheme: (theme) => {
        set({ theme })
        logger.debug('Theme updated', { theme })
      },
      
      setLanguage: (language) => {
        set({ language })
      },
      
      setCurrency: (currency) => {
        set({ currency })
      },
      
      setDefaultSlippage: (slippage) => {
        if (slippage >= 0.1 && slippage <= 5.0) {
          set({ defaultSlippage: slippage })
        }
      },
      
      setDefaultGasPrice: (gasPrice) => {
        set({ defaultGasPrice: gasPrice })
      },
      
      setRiskTolerance: (tolerance) => {
        set({ riskTolerance: tolerance })
      },
      
      setEnableAINotifications: (enable) => {
        set({ enableAINotifications: enable })
      },
      
      setEnablePriceAlerts: (enable) => {
        set({ enablePriceAlerts: enable })
      },
      
      setEnableAgentNotifications: (enable) => {
        set({ enableAgentNotifications: enable })
      },
      
      reset: () => {
        set(defaultUserPreferences)
        logger.debug('User preferences reset')
      }
    }),
    {
      name: 'user-preferences-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    ...defaultAppState,
    
    setWalletConnected: (connected) => {
      set({ isWalletConnected: connected })
      logger.info(`Wallet ${connected ? 'connected' : 'disconnected'}`)
    },
    
    setConnectedAccount: (account) => {
      set({ connectedAccount: account })
      if (account) {
        logger.info('Account connected', { account: `${account.slice(0, 6)}...${account.slice(-4)}` })
      }
    },
    
    setCurrentChainId: (chainId) => {
      set({ currentChainId: chainId })
      if (chainId) {
        logger.info('Chain changed', { chainId })
      }
    },
    
    setAIServiceAvailable: (available) => {
      set({ isAIServiceAvailable: available })
      logger.info(`AI service ${available ? 'available' : 'unavailable'}`)
    },
    
    setDataServiceAvailable: (available) => {
      set({ isDataServiceAvailable: available })
      logger.info(`Data service ${available ? 'available' : 'unavailable'}`)
    },
    
    setLastPriceUpdate: (date) => {
      set({ lastPriceUpdate: date })
    },
    
    setLastAIUpdate: (date) => {
      set({ lastAIUpdate: date })
    },
    
    reset: () => {
      set(defaultAppState)
      logger.debug('App state reset')
    }
  }))
)

// Utility hooks for common operations
export const useSwapTokens = () => {
  const { fromToken, toToken } = useSwapStore()
  return { fromToken, toToken }
}

export const useSwapAmounts = () => {
  const { fromAmount, toAmount, setFromAmount, setToAmount } = useSwapStore()
  return { fromAmount, toAmount, setFromAmount, setToAmount }
}

export const useAIInsights = () => {
  const { currentPrediction, riskAssessment, aiUpdates } = useSwapStore()
  return { currentPrediction, riskAssessment, aiUpdates }
}

export const useTradingAgent = () => {
  const { isActive, strategy, performance } = useTradingAgentStore()
  return { isActive, strategy, performance }
}

export const useWalletConnection = () => {
  const { isWalletConnected, connectedAccount, currentChainId } = useAppStore()
  return { isWalletConnected, connectedAccount, currentChainId }
}

// Selectors for performance optimization
export const selectSwapState = (state: EnhancedSwapState) => ({
  fromToken: state.fromToken,
  toToken: state.toToken,
  fromAmount: state.fromAmount,
  toAmount: state.toAmount,
  slippage: state.slippage
})

export const selectAIState = (state: EnhancedSwapState) => ({
  prediction: state.currentPrediction,
  risk: state.riskAssessment,
  updates: state.aiUpdates
})

// Store reset utility
export const resetAllStores = () => {
  useSwapStore.getState().reset()
  useTradingAgentStore.getState().reset()
  useUserPreferencesStore.getState().reset()
  useAppStore.getState().reset()
  logger.info('All stores reset')
}

// Export store types for external use
export type {
  EnhancedSwapState,
  TradingAgentState,
  UserPreferencesState,
  AppState
}