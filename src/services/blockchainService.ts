/**
 * Blockchain Service
 * Handles wallet connections, network management, and basic blockchain operations
 */

import { ethers } from 'ethers'
import { NetworkConfig, TokenInfo, TransactionReceipt } from '@/types/staking'
import { SOMNIA_TESTNET } from '@/lib/stakingConstants'

/**
 * Blockchain Service Class
 * Manages wallet connections and blockchain interactions
 */
class BlockchainService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.Signer | null = null
  private accountChangeCallbacks: ((address: string) => void)[] = []
  private chainChangeCallbacks: ((chainId: number) => void)[] = []

  /**
   * Initialize the service with MetaMask or other Web3 provider
   */
  private async initializeProvider(): Promise<ethers.BrowserProvider> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask or Web3 provider not found')
    }

    this.provider = new ethers.BrowserProvider(window.ethereum)
    this.setupEventListeners()
    
    return this.provider
  }

  /**
   * Setup event listeners for account and chain changes
   */
  private setupEventListeners(): void {
    if (!window.ethereum) return

    // Account changed
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      const address = accounts[0] || ''
      this.accountChangeCallbacks.forEach(callback => callback(address))
    })

    // Chain changed
    window.ethereum.on('chainChanged', (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16)
      this.chainChangeCallbacks.forEach(callback => callback(chainId))
      // Reload page on chain change (recommended by MetaMask)
      window.location.reload()
    })
  }

  // ==========================================================================
  // Wallet Connection
  // ==========================================================================

  /**
   * Connect to user's wallet
   * @returns Connected wallet address
   */
  async connectWallet(): Promise<string> {
    try {
      const provider = await this.initializeProvider()
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', [])
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      this.signer = provider.getSigner()
      return accounts[0]
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      
      if (error.code === 4001) {
        throw new Error('User rejected the connection request')
      }
      
      throw new Error('Failed to connect wallet')
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    this.provider = null
    this.signer = null
  }

  /**
   * Get connected account address
   * @returns Account address or null if not connected
   */
  async getConnectedAddress(): Promise<string | null> {
    try {
      // Check if window.ethereum exists first
      if (typeof window === 'undefined' || !window.ethereum) {
        return null
      }

      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) return null

      const accounts = await this.provider.listAccounts()
      return accounts[0]?.address || null
    } catch (error) {
      console.error('Error getting connected address:', error)
      return null
    }
  }

  // ==========================================================================
  // Network Management
  // ==========================================================================

  /**
   * Get current chain ID
   * @returns Chain ID
   */
  async getCurrentChainId(): Promise<number> {
    try {
      // Check if window.ethereum exists first
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('No wallet provider found')
      }

      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      const network = await this.provider.getNetwork()
      return Number(network.chainId)
    } catch (error) {
      console.error('Error getting chain ID:', error)
      throw new Error('Failed to get chain ID')
    }
  }

  /**
   * Switch to a specific network
   * @param chainId - Target chain ID
   */
  async switchNetwork(chainId: number): Promise<void> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      const chainIdHex = `0x${chainId.toString(16)}`

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        })
      } catch (switchError: any) {
        // Network not added, try to add it
        if (switchError.code === 4902) {
          await this.addNetwork(SOMNIA_TESTNET)
        } else {
          throw switchError
        }
      }
    } catch (error: any) {
      console.error('Error switching network:', error)
      
      if (error.code === 4001) {
        throw new Error('User rejected the network switch')
      }
      
      throw new Error('Failed to switch network')
    }
  }

  /**
   * Add a new network to MetaMask
   * @param networkConfig - Network configuration
   */
  async addNetwork(networkConfig: NetworkConfig): Promise<void> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${networkConfig.chainId.toString(16)}`,
          chainName: networkConfig.chainName,
          nativeCurrency: networkConfig.nativeCurrency,
          rpcUrls: networkConfig.rpcUrls,
          blockExplorerUrls: networkConfig.blockExplorerUrls,
        }],
      })
    } catch (error: any) {
      console.error('Error adding network:', error)
      
      if (error.code === 4001) {
        throw new Error('User rejected adding the network')
      }
      
      throw new Error('Failed to add network')
    }
  }

  // ==========================================================================
  // Token Operations
  // ==========================================================================

  /**
   * Get token balance for an address
   * @param tokenAddress - Token contract address
   * @param userAddress - User's wallet address
   * @returns Balance as string (in wei)
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        this.provider
      )

      const balance: bigint = await tokenContract.balanceOf(userAddress)
      return balance.toString()
    } catch (error) {
      console.error('Error getting token balance:', error)
      throw new Error('Failed to get token balance')
    }
  }

  /**
   * Get token information
   * @param tokenAddress - Token contract address
   * @returns Token information
   */
  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)',
          'function totalSupply() view returns (uint256)'
        ],
        this.provider
      )

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply()
      ])

      return {
        address: tokenAddress,
        name,
        symbol,
        decimals,
        totalSupply: totalSupply.toString()
      }
    } catch (error) {
      console.error('Error getting token info:', error)
      throw new Error('Failed to get token information')
    }
  }

  // ==========================================================================
  // Transaction Utilities
  // ==========================================================================

  /**
   * Estimate gas for a transaction
   * @param transaction - Transaction request
   * @returns Estimated gas as BigNumber
   */
  async estimateGas(transaction: ethers.TransactionRequest): Promise<bigint> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      return await this.provider.estimateGas(transaction)
    } catch (error) {
      console.error('Error estimating gas:', error)
      throw new Error('Failed to estimate gas')
    }
  }

  /**
   * Get current gas price
   * @returns Gas price as BigNumber
   */
  async getGasPrice(): Promise<bigint> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      return await this.provider.getGasPrice()
    } catch (error) {
      console.error('Error getting gas price:', error)
      throw new Error('Failed to get gas price')
    }
  }

  /**
   * Wait for transaction confirmation
   * @param txHash - Transaction hash
   * @param confirmations - Number of confirmations to wait for
   * @returns Transaction receipt
   */
  async waitForTransaction(
    txHash: string,
    confirmations: number = 1
  ): Promise<TransactionReceipt> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      const receipt = await this.provider.waitForTransaction(txHash, confirmations)

      if (!receipt) {
        throw new Error('Transaction receipt not found')
      }

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        from: receipt.from,
        to: receipt.to || '',
        gasUsed: receipt.gasUsed,
        status: receipt.status || 0
      }
    } catch (error) {
      console.error('Error waiting for transaction:', error)
      throw new Error('Failed to wait for transaction')
    }
  }

  /**
   * Get transaction by hash
   * @param txHash - Transaction hash
   * @returns Transaction or null
   */
  async getTransaction(txHash: string): Promise<ethers.providers.TransactionResponse | null> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }

      if (!this.provider) {
        throw new Error('Provider not initialized')
      }

      return await this.provider.getTransaction(txHash)
    } catch (error) {
      console.error('Error getting transaction:', error)
      return null
    }
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  /**
   * Subscribe to account changes
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  onAccountChanged(callback: (address: string) => void): () => void {
    this.accountChangeCallbacks.push(callback)
    
    return () => {
      this.accountChangeCallbacks = this.accountChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Subscribe to chain changes
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  onChainChanged(callback: (chainId: number) => void): () => void {
    this.chainChangeCallbacks.push(callback)
    
    return () => {
      this.chainChangeCallbacks = this.chainChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  // ==========================================================================
  // Getters
  // ==========================================================================

  /**
   * Get the current provider
   */
  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  /**
   * Get the current signer
   */
  getSigner(): ethers.Signer | null {
    return this.signer
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.provider !== null && this.signer !== null
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService()

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
