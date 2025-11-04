import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStaking } from '@/hooks/useStaking'
import { stakingService } from '@/services/stakingService'
import { blockchainService } from '@/services/blockchainService'

// Mock services
vi.mock('@/services/stakingService')
vi.mock('@/services/blockchainService')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Staking Workflow Integration Tests', () => {
  const mockUserAddress = '0x123456789'
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful blockchain service
    vi.mocked(blockchainService.getProvider).mockReturnValue({} as any)
    vi.mocked(blockchainService.getSigner).mockReturnValue({} as any)
    
    // Mock staking service responses
    vi.mocked(stakingService.getAllPools).mockResolvedValue([
      {
        id: '1',
        address: '0xpool1',
        name: 'USDC Staking',
        symbol: 'USDC',
        tokenAddress: '0xusdc',
        apy: 12.5,
        tvl: 1000000,
        totalStakers: 100,
        minStake: '10',
        lockPeriod: 0,
        entryFee: 0,
        exitFee: 0,
        performanceFee: 0,
        rewardToken: '0xusdc',
        isActive: true,
        createdAt: new Date(),
        logoUrl: '/placeholder.svg'
      }
    ])
    
    vi.mocked(stakingService.getUserPositions).mockResolvedValue([])
    vi.mocked(stakingService.checkAllowance).mockResolvedValue('1000000000000000000000')
  })

  describe('Complete Staking Flow', () => {
    it('should handle complete stake workflow', async () => {
      // Mock successful stake transaction
      vi.mocked(stakingService.stake).mockResolvedValue({
        hash: '0xtxhash',
        wait: vi.fn().mockResolvedValue({ status: 1 })
      } as any)

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      // Wait for initial data to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Verify pools are loaded
      expect(result.current.allPools).toHaveLength(1)
      expect(result.current.allPools[0].symbol).toBe('USDC')

      // Execute stake
      await result.current.stake('0xpool1', '100')

      // Verify stake was called with correct parameters
      expect(stakingService.stake).toHaveBeenCalledWith('0xpool1', '100')
    })

    it('should handle stake with approval workflow', async () => {
      // Mock that approval is needed
      vi.mocked(stakingService.checkAllowance).mockResolvedValue('0')
      vi.mocked(stakingService.approveToken).mockResolvedValue({
        hash: '0xapprovehash',
        wait: vi.fn().mockResolvedValue({ status: 1 })
      } as any)
      vi.mocked(stakingService.stake).mockResolvedValue({
        hash: '0xstakehash',
        wait: vi.fn().mockResolvedValue({ status: 1 })
      } as any)

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Execute stake (should trigger approval first)
      await result.current.stake('0xpool1', '100')

      // Verify both approval and stake were called
      expect(stakingService.approveToken).toHaveBeenCalled()
      expect(stakingService.stake).toHaveBeenCalledWith('0xpool1', '100')
    })

    it('should handle withdraw workflow', async () => {
      // Mock user has positions
      vi.mocked(stakingService.getUserPositions).mockResolvedValue([
        {
          id: 'pos1',
          poolId: '0xpool1',
          pool: result.current.allPools[0],
          userAddress: mockUserAddress,
          stakedAmount: '100',
          stakedAmountUSD: 100,
          rewardsEarned: '5',
          rewardsEarnedUSD: 5,
          apy: 12.5,
          stakedAt: new Date(),
          unlocksAt: new Date(),
          isLocked: false,
          canWithdraw: true,
          canClaim: true
        }
      ])

      vi.mocked(stakingService.withdraw).mockResolvedValue({
        hash: '0xwithdrawhash',
        wait: vi.fn().mockResolvedValue({ status: 1 })
      } as any)

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.positions).toHaveLength(1)
      })

      // Execute withdraw
      await result.current.withdraw('0xpool1', '50')

      expect(stakingService.withdraw).toHaveBeenCalledWith('0xpool1', '50')
    })

    it('should handle claim rewards workflow', async () => {
      vi.mocked(stakingService.claimRewards).mockResolvedValue({
        hash: '0xclaimhash',
        wait: vi.fn().mockResolvedValue({ status: 1 })
      } as any)

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Execute claim
      await result.current.claim('0xpool1')

      expect(stakingService.claimRewards).toHaveBeenCalledWith('0xpool1')
    })
  })

  describe('Error Handling', () => {
    it('should handle stake errors gracefully', async () => {
      vi.mocked(stakingService.stake).mockRejectedValue(new Error('Insufficient balance'))

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Execute stake and expect it to throw
      await expect(result.current.stake('0xpool1', '100')).rejects.toThrow('Insufficient balance')
    })

    it('should handle network errors', async () => {
      vi.mocked(stakingService.getAllPools).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })

      expect(result.current.error?.message).toBe('Network error')
    })

    it('should handle wallet not connected', async () => {
      const { result } = renderHook(() => useStaking(undefined), {
        wrapper: createWrapper()
      })

      await expect(result.current.stake('0xpool1', '100')).rejects.toThrow('Wallet not connected')
    })
  })

  describe('Loading States', () => {
    it('should show loading states correctly', async () => {
      // Mock delayed responses
      vi.mocked(stakingService.getAllPools).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      )

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      // Initially should be loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isPoolsLoading).toBe(true)

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should show mutation loading states', async () => {
      vi.mocked(stakingService.stake).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({} as any), 100))
      )

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Start stake operation
      const stakePromise = result.current.stake('0xpool1', '100')

      // Should show staking state
      expect(result.current.isStaking).toBe(true)

      await stakePromise

      // Should no longer be staking
      await waitFor(() => {
        expect(result.current.isStaking).toBe(false)
      })
    })
  })

  describe('Data Refetching', () => {
    it('should refetch data after successful operations', async () => {
      vi.mocked(stakingService.stake).mockResolvedValue({
        hash: '0xtxhash',
        wait: vi.fn().mockResolvedValue({ status: 1 })
      } as any)

      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const initialCallCount = vi.mocked(stakingService.getAllPools).mock.calls.length

      // Execute stake
      await result.current.stake('0xpool1', '100')

      // Should trigger refetch
      await waitFor(() => {
        expect(vi.mocked(stakingService.getAllPools).mock.calls.length).toBeGreaterThan(initialCallCount)
      })
    })

    it('should allow manual refetch', async () => {
      const { result } = renderHook(() => useStaking(mockUserAddress), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const initialCallCount = vi.mocked(stakingService.getAllPools).mock.calls.length

      // Manual refetch
      result.current.refetch()

      await waitFor(() => {
        expect(vi.mocked(stakingService.getAllPools).mock.calls.length).toBeGreaterThan(initialCallCount)
      })
    })
  })
})