/**
 * Transaction Service
 * Handles transaction confirmation, status tracking, and user notifications
 */

import { ethers } from 'ethers'
import { blockchainService } from './blockchainService'

export interface TransactionStatus {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  gasUsed?: string
  effectiveGasPrice?: string
  blockNumber?: number
  timestamp?: number
  error?: string
}

export interface TransactionMetadata {
  type: 'stake' | 'withdraw' | 'claim' | 'approve'
  poolAddress?: string
  amount?: string
  tokenSymbol?: string
  description: string
}

class TransactionService {
  private transactions = new Map<string, TransactionStatus>()
  private metadata = new Map<string, TransactionMetadata>()
  private listeners = new Map<string, ((status: TransactionStatus) => void)[]>()

  /**
   * Submit a transaction and start tracking it
   */
  async submitTransaction(
    txPromise: Promise<ethers.providers.TransactionResponse>,
    metadata: TransactionMetadata
  ): Promise<string> {
    try {
      const tx = await txPromise
      const hash = tx.hash

      // Store initial status
      this.transactions.set(hash, {
        hash,
        status: 'pending',
        confirmations: 0
      })

      // Store metadata
      this.metadata.set(hash, metadata)

      // Start tracking
      this.trackTransaction(hash, tx)

      return hash
    } catch (error: any) {
      console.error('Transaction submission failed:', error)
      throw error
    }
  }

  /**
   * Track a transaction until confirmation
   */
  private async trackTransaction(
    hash: string,
    tx: ethers.providers.TransactionResponse
  ) {
    try {
      // Wait for confirmation
      const receipt = await tx.wait()

      const status: TransactionStatus = {
        hash,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        confirmations: 1,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        blockNumber: receipt.blockNumber,
        timestamp: Date.now()
      }

      if (receipt.status === 0) {
        status.error = 'Transaction failed'
      }

      this.transactions.set(hash, status)
      this.notifyListeners(hash, status)

      // Continue tracking for additional confirmations
      if (receipt.status === 1) {
        this.trackConfirmations(hash, receipt.blockNumber)
      }
    } catch (error: any) {
      const status: TransactionStatus = {
        hash,
        status: 'failed',
        confirmations: 0,
        error: error.message || 'Transaction failed'
      }

      this.transactions.set(hash, status)
      this.notifyListeners(hash, status)
    }
  }

  /**
   * Track additional confirmations
   */
  private async trackConfirmations(hash: string, blockNumber: number) {
    const provider = blockchainService.getProvider()
    if (!provider) return

    try {
      // Check confirmations every 15 seconds for up to 5 minutes
      const maxChecks = 20
      let checks = 0

      const checkConfirmations = async () => {
        if (checks >= maxChecks) return

        const currentBlock = await provider.getBlockNumber()
        const confirmations = Math.max(0, currentBlock - blockNumber + 1)

        const currentStatus = this.transactions.get(hash)
        if (currentStatus && currentStatus.status === 'confirmed') {
          const updatedStatus = {
            ...currentStatus,
            confirmations
          }

          this.transactions.set(hash, updatedStatus)
          this.notifyListeners(hash, updatedStatus)

          // Stop tracking after 12 confirmations
          if (confirmations < 12) {
            checks++
            setTimeout(checkConfirmations, 15000)
          }
        }
      }

      setTimeout(checkConfirmations, 15000)
    } catch (error) {
      console.error('Error tracking confirmations:', error)
    }
  }

  /**
   * Get transaction status
   */
  getTransactionStatus(hash: string): TransactionStatus | undefined {
    return this.transactions.get(hash)
  }

  /**
   * Get transaction metadata
   */
  getTransactionMetadata(hash: string): TransactionMetadata | undefined {
    return this.metadata.get(hash)
  }

  /**
   * Get all transactions for a specific type
   */
  getTransactionsByType(type: TransactionMetadata['type']): Array<{
    hash: string
    status: TransactionStatus
    metadata: TransactionMetadata
  }> {
    const results: Array<{
      hash: string
      status: TransactionStatus
      metadata: TransactionMetadata
    }> = []

    for (const [hash, metadata] of this.metadata.entries()) {
      if (metadata.type === type) {
        const status = this.transactions.get(hash)
        if (status) {
          results.push({ hash, status, metadata })
        }
      }
    }

    return results.sort((a, b) => (b.status.timestamp || 0) - (a.status.timestamp || 0))
  }

  /**
   * Get recent transactions
   */
  getRecentTransactions(limit: number = 10): Array<{
    hash: string
    status: TransactionStatus
    metadata: TransactionMetadata
  }> {
    const results: Array<{
      hash: string
      status: TransactionStatus
      metadata: TransactionMetadata
    }> = []

    for (const [hash, status] of this.transactions.entries()) {
      const metadata = this.metadata.get(hash)
      if (metadata) {
        results.push({ hash, status, metadata })
      }
    }

    return results
      .sort((a, b) => (b.status.timestamp || 0) - (a.status.timestamp || 0))
      .slice(0, limit)
  }

  /**
   * Subscribe to transaction status updates
   */
  onTransactionUpdate(
    hash: string,
    callback: (status: TransactionStatus) => void
  ): () => void {
    if (!this.listeners.has(hash)) {
      this.listeners.set(hash, [])
    }

    this.listeners.get(hash)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(hash)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  /**
   * Notify all listeners for a transaction
   */
  private notifyListeners(hash: string, status: TransactionStatus) {
    const callbacks = this.listeners.get(hash)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(status)
        } catch (error) {
          console.error('Error in transaction listener:', error)
        }
      })
    }
  }

  /**
   * Clear old transactions (keep last 100)
   */
  cleanup() {
    const transactions = Array.from(this.transactions.entries())
      .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0))

    if (transactions.length > 100) {
      const toRemove = transactions.slice(100)
      
      for (const [hash] of toRemove) {
        this.transactions.delete(hash)
        this.metadata.delete(hash)
        this.listeners.delete(hash)
      }
    }
  }

  /**
   * Get transaction explorer URL
   */
  getExplorerUrl(hash: string): string {
    const explorerBase = process.env.VITE_SOMNIA_EXPLORER || 'https://testnet.explorer.somnia.network'
    return `${explorerBase}/tx/${hash}`
  }

  /**
   * Estimate transaction time
   */
  estimateConfirmationTime(confirmations: number): string {
    if (confirmations === 0) return 'Pending...'
    if (confirmations === 1) return '~30 seconds'
    if (confirmations < 6) return '~2 minutes'
    if (confirmations < 12) return '~5 minutes'
    return 'Confirmed'
  }

  /**
   * Format gas cost
   */
  formatGasCost(gasUsed?: string, gasPrice?: string): string {
    if (!gasUsed || !gasPrice) return 'Unknown'
    
    try {
      const cost = BigInt(gasUsed) * BigInt(gasPrice)
      const costInEth = ethers.formatEther(cost)
      return `${parseFloat(costInEth).toFixed(6)} STT`
    } catch {
      return 'Unknown'
    }
  }
}

// Export singleton instance
export const transactionService = new TransactionService()

// Cleanup old transactions every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    transactionService.cleanup()
  }, 60 * 60 * 1000)
}