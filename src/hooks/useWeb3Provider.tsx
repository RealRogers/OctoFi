/**
 * Web3 Provider Hook
 * Comprehensive wallet connection and contract management
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { blockchainService } from '@/services/blockchainService'
import { SOMNIA_TESTNET, TOKEN_ADDRESSES, STAKING_POOLS } from '@/lib/stakingConstants'

// Types
interface Web3State {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  account: string | null
  chainId: number | null
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  
  // Network state
  isCorrectNetwork: boolean
  networkError: string | null
  
  // Token balances
  tokenBalances: Record<string, string>
  isLoadingBalances: boolean
  
  // Contract instances
  contracts: {
    usdc: ethers.Contract | null
    usdt: ethers.Contract | null
    arb: ethers.Contract | null
    usdcPool: ethers.Contract | null
  }
  
  // Error state
  error: string | null
}

interface Web3Actions {
  // Connection actions
  connect: () => Promise<void>
  disconnect: () => void
  switchToSomnia: () => Promise<void>
  
  // Data refresh
  refreshBalances: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Utilities
  clearError: () => void
}

type Web3ContextType = Web3State & Web3Actions

// Context
const Web3Context = createContext<Web3ContextType | null>(null)

// Hook
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

// Provider Component
interface Web3ProviderProps {
  children: ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // State
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    isConnecting: false,
    account: null,
    chainId: null,
    provider: null,
    signer: null,
    isCorrectNetwork: false,
    networkError: null,
    tokenBalances: {},
    isLoadingBalances: false,
    contracts: {
      usdc: null,
      usdt: null,
      arb: null,
      usdcPool: null
    },
    error: null
  })

  // Contract ABIs
  const ERC20_ABI = [
    'function balanceOf(address account) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)'
  ]

  const STAKING_POOL_ABI = [
    'function balanceOf(address account) view returns (uint256)',
    'function earned(address account) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
    'function rewardRate() view returns (uint256)',
    'function stake(uint256 amount)',
    'function withdraw(uint256 amount)',
    'function getReward()',
    'function exit()'
  ]

  // Initialize contracts
  const initializeContracts = useCallback((provider: ethers.BrowserProvider, signer: ethers.Signer) => {
    try {
      const contracts = {
        usdc: new ethers.Contract(TOKEN_ADDRESSES.USDC, ERC20_ABI, signer),
        usdt: new ethers.Contract(TOKEN_ADDRESSES.USDT, ERC20_ABI, signer),
        arb: new ethers.Contract(TOKEN_ADDRESSES.ARB, ERC20_ABI, signer),
        usdcPool: new ethers.Contract(STAKING_POOLS.USDC.address, STAKING_POOL_ABI, signer)
      }
      
      setState(prev => ({ ...prev, contracts }))
      return contracts
    } catch (error) {
      console.error('Error initializing contracts:', error)
      setState(prev => ({ ...prev, error: 'Failed to initialize contracts' }))
      return null
    }
  }, [])

  // Load token balances
  const loadTokenBalances = useCallback(async (account: string, contracts: any) => {
    if (!account || !contracts) return

    setState(prev => ({ ...prev, isLoadingBalances: true }))

    try {
      const [usdcBalance, usdtBalance, arbBalance] = await Promise.all([
        contracts.usdc.balanceOf(account),
        contracts.usdt.balanceOf(account),
        contracts.arb.balanceOf(account)
      ])

      const balances = {
        USDC: ethers.formatUnits(usdcBalance, 6),
        USDT: ethers.formatUnits(usdtBalance, 6),
        ARB: ethers.formatUnits(arbBalance, 18)
      }

      setState(prev => ({
        ...prev,
        tokenBalances: balances,
        isLoadingBalances: false
      }))
    } catch (error) {
      console.error('Error loading balances:', error)
      setState(prev => ({
        ...prev,
        isLoadingBalances: false,
        error: 'Failed to load token balances'
      }))
    }
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Check if MetaMask is available
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask.')
      }

      // Initialize provider
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', [])
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const account = accounts[0]
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)

      // Check if on correct network
      const isCorrectNetwork = chainId === SOMNIA_TESTNET.chainId
      const networkError = isCorrectNetwork ? null : `Please switch to Somnia Testnet (Chain ID: ${SOMNIA_TESTNET.chainId})`

      // Initialize contracts
      const contracts = initializeContracts(provider, signer)

      // Update state
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        account,
        chainId,
        provider,
        signer,
        isCorrectNetwork,
        networkError,
        error: null
      }))

      // Load balances if on correct network
      if (isCorrectNetwork && contracts) {
        await loadTokenBalances(account, contracts)
      }

      console.log('✅ Wallet connected:', account)
      console.log('✅ Network:', chainId === SOMNIA_TESTNET.chainId ? 'Somnia Testnet' : `Chain ${chainId}`)

    } catch (error: any) {
      console.error('❌ Connection failed:', error)
      
      let errorMessage = 'Failed to connect wallet'
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user'
      } else if (error.message.includes('MetaMask')) {
        errorMessage = error.message
      }

      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage
      }))
    }
  }, [initializeContracts, loadTokenBalances])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      account: null,
      chainId: null,
      provider: null,
      signer: null,
      isCorrectNetwork: false,
      networkError: null,
      tokenBalances: {},
      isLoadingBalances: false,
      contracts: {
        usdc: null,
        usdt: null,
        arb: null,
        usdcPool: null
      },
      error: null
    })
    console.log('🔌 Wallet disconnected')
  }, [])

  // Switch to Somnia network
  const switchToSomnia = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      const chainIdHex = `0x${SOMNIA_TESTNET.chainId.toString(16)}`

      try {
        // Try to switch to Somnia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }]
        })
      } catch (switchError: any) {
        // Network not added, try to add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: SOMNIA_TESTNET.chainName,
              nativeCurrency: SOMNIA_TESTNET.nativeCurrency,
              rpcUrls: SOMNIA_TESTNET.rpcUrls,
              blockExplorerUrls: SOMNIA_TESTNET.blockExplorerUrls
            }]
          })
        } else {
          throw switchError
        }
      }

      // Refresh connection after network switch
      setTimeout(() => {
        if (state.isConnected) {
          connect()
        }
      }, 1000)

    } catch (error: any) {
      console.error('❌ Network switch failed:', error)
      setState(prev => ({
        ...prev,
        error: error.code === 4001 ? 'Network switch rejected by user' : 'Failed to switch network'
      }))
    }
  }, [connect, state.isConnected])

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    if (state.account && state.contracts.usdc) {
      await loadTokenBalances(state.account, state.contracts)
    }
  }, [state.account, state.contracts, loadTokenBalances])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    if (state.isConnected) {
      await connect()
    }
  }, [state.isConnected, connect])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Setup event listeners
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('🔄 Accounts changed:', accounts)
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== state.account) {
        connect()
      }
    }

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16)
      console.log('🔄 Chain changed:', chainId)
      
      setState(prev => ({
        ...prev,
        chainId,
        isCorrectNetwork: chainId === SOMNIA_TESTNET.chainId,
        networkError: chainId === SOMNIA_TESTNET.chainId ? null : `Please switch to Somnia Testnet (Chain ID: ${SOMNIA_TESTNET.chainId})`
      }))

      // Refresh connection
      if (state.isConnected) {
        setTimeout(() => connect(), 1000)
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [state.account, state.isConnected, connect, disconnect])

  // Auto-connect on page load
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts && accounts.length > 0) {
          console.log('🔄 Auto-connecting to existing session...')
          await connect()
        }
      } catch (error) {
        console.log('No existing connection found')
      }
    }

    autoConnect()
  }, []) // Only run once on mount

  // Context value
  const contextValue: Web3ContextType = {
    ...state,
    connect,
    disconnect,
    switchToSomnia,
    refreshBalances,
    refreshAll,
    clearError
  }

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}

// Export types
export type { Web3State, Web3Actions, Web3ContextType }