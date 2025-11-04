import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StakeModal } from './StakeModal'
import { StakingPool } from '@/types/staking'

// Mock the hooks and services
vi.mock('@/hooks/useWalletBalance', () => ({
  useWalletBalance: vi.fn(() => ({
    balance: '1000000000000000000000', // 1000 tokens
    balanceFormatted: '1000.0',
    isLoading: false
  }))
}))

vi.mock('@/hooks/useStakingMutations', () => ({
  useStakeMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false
  })),
  useApproveMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false
  }))
}))

vi.mock('@/services/stakingService', () => ({
  stakingService: {
    checkAllowance: vi.fn(() => Promise.resolve('0'))
  }
}))

const mockPool: StakingPool = {
  id: '1',
  address: '0x123',
  name: 'USDC Staking',
  symbol: 'USDC',
  tokenAddress: '0x456',
  apy: 12.5,
  tvl: 1000000,
  totalStakers: 100,
  minStake: '10',
  maxStake: undefined,
  lockPeriod: 0,
  entryFee: 0,
  exitFee: 0,
  performanceFee: 0,
  rewardToken: '0x456',
  isActive: true,
  createdAt: new Date(),
  logoUrl: '/placeholder.svg'
}

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('StakeModal', () => {
  const mockProps = {
    pool: mockPool,
    userAddress: '0x789',
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when open', () => {
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    expect(screen.getByText('Stake USDC')).toBeInTheDocument()
    expect(screen.getByText(/Stake your tokens to earn 12.50% APY/)).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Balance: 1000.0 USDC')).toBeInTheDocument()
  })

  it('shows pool information correctly', () => {
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    expect(screen.getByText('USDC Staking')).toBeInTheDocument()
    expect(screen.getByText('APY: 12.50%')).toBeInTheDocument()
    expect(screen.getByAltText('USDC Staking')).toBeInTheDocument()
  })

  it('handles amount input correctly', async () => {
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const amountInput = screen.getByLabelText('Amount')
    fireEvent.change(amountInput, { target: { value: '100' } })
    
    await waitFor(() => {
      expect(amountInput).toHaveValue(100)
    })
    
    // Should show estimated rewards
    expect(screen.getByText('Estimated Monthly Rewards')).toBeInTheDocument()
    expect(screen.getByText('Estimated Yearly Rewards')).toBeInTheDocument()
  })

  it('handles max button correctly', async () => {
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const maxButton = screen.getByText('Max')
    fireEvent.click(maxButton)
    
    await waitFor(() => {
      const amountInput = screen.getByLabelText('Amount')
      expect(amountInput).toHaveValue(1000)
    })
  })

  it('shows validation errors for invalid amounts', async () => {
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const amountInput = screen.getByLabelText('Amount')
    
    // Test amount below minimum
    fireEvent.change(amountInput, { target: { value: '5' } })
    fireEvent.blur(amountInput)
    
    await waitFor(() => {
      expect(screen.getByText(/minimum stake amount/i)).toBeInTheDocument()
    })
  })

  it('shows approval button when approval is needed', async () => {
    // Mock that approval is needed
    const { stakingService } = await import('@/services/stakingService')
    vi.mocked(stakingService.checkAllowance).mockResolvedValue('0')
    
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const amountInput = screen.getByLabelText('Amount')
    fireEvent.change(amountInput, { target: { value: '100' } })
    
    await waitFor(() => {
      expect(screen.getByText('Approve')).toBeInTheDocument()
    })
  })

  it('shows stake button when approval is sufficient', async () => {
    // Mock that approval is sufficient
    const { stakingService } = await import('@/services/stakingService')
    vi.mocked(stakingService.checkAllowance).mockResolvedValue('1000000000000000000000')
    
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const amountInput = screen.getByLabelText('Amount')
    fireEvent.change(amountInput, { target: { value: '100' } })
    
    await waitFor(() => {
      expect(screen.getByText('Stake')).toBeInTheDocument()
    })
  })

  it('calls onClose when cancel button is clicked', () => {
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('shows lock period information when applicable', () => {
    const poolWithLock = {
      ...mockPool,
      lockPeriod: 30 * 24 * 60 * 60 // 30 days
    }
    
    renderWithQueryClient(<StakeModal {...mockProps} pool={poolWithLock} />)
    
    const amountInput = screen.getByLabelText('Amount')
    fireEvent.change(amountInput, { target: { value: '100' } })
    
    expect(screen.getByText('Lock Period')).toBeInTheDocument()
    expect(screen.getByText('30 days')).toBeInTheDocument()
  })

  it('shows entry fee information when applicable', () => {
    const poolWithFee = {
      ...mockPool,
      entryFee: 100 // 1%
    }
    
    renderWithQueryClient(<StakeModal {...mockProps} pool={poolWithFee} />)
    
    const amountInput = screen.getByLabelText('Amount')
    fireEvent.change(amountInput, { target: { value: '100' } })
    
    expect(screen.getByText('Entry Fee')).toBeInTheDocument()
    expect(screen.getByText('1.00%')).toBeInTheDocument()
  })

  it('disables inputs when loading', () => {
    const { useStakeMutation } = require('@/hooks/useStakingMutations')
    vi.mocked(useStakeMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true
    })
    
    renderWithQueryClient(<StakeModal {...mockProps} />)
    
    const amountInput = screen.getByLabelText('Amount')
    const maxButton = screen.getByText('Max')
    
    expect(amountInput).toBeDisabled()
    expect(maxButton).toBeDisabled()
  })

  it('does not render when closed', () => {
    renderWithQueryClient(<StakeModal {...mockProps} isOpen={false} />)
    
    expect(screen.queryByText('Stake USDC')).not.toBeInTheDocument()
  })
})