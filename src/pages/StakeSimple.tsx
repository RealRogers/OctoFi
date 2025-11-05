/**
 * Stake Simple Page
 * Simplified version with real Web3 integration and functional staking
 */

import { useState, useEffect } from 'react'
import AppLayout from "@/components/AppLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWeb3 } from '@/hooks/useWeb3Provider'
import { ConnectWalletButton } from '@/components/shared/ConnectWalletButton'
import { stakingService } from '@/services/stakingService'
import { StakingPool, StakingPosition } from '@/types/staking'
import { StakeModal } from '@/components/molecules/StakeModal'
import { WithdrawModal } from '@/components/molecules/WithdrawModal'

const StakeSimple = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<StakingPool[]>([])
  const [positions, setPositions] = useState<StakingPosition[]>([])
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<StakingPosition | null>(null)
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const { isConnected, account, isCorrectNetwork, tokenBalances } = useWeb3()

  useEffect(() => {
    console.log('StakeSimple mounted')
    loadPools()
  }, [])

  useEffect(() => {
    if (isConnected && account && isCorrectNetwork) {
      loadUserPositions()
    } else {
      setPositions([])
    }
  }, [isConnected, account, isCorrectNetwork])

  const loadPools = async () => {
    try {
      setIsLoading(true)
      const allPools = await stakingService.getAllPools()
      setPools(allPools)
      console.log('StakeSimple initialized with pools:', allPools)
    } catch (error) {
      console.error('Error loading pools:', error)
      // Fallback to mock data for display
      setPools([
        {
          id: '1',
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          name: 'USDC Staking',
          symbol: 'USDC',
          tokenAddress: '0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB',
          apy: 12.5,
          tvl: 1250000,
          totalStakers: 342,
          minStake: '10',
          lockPeriod: 0,
          entryFee: 0,
          exitFee: 0,
          performanceFee: 0,
          rewardToken: '0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB',
          isActive: true,
          createdAt: new Date(),
          logoUrl: '/placeholder.svg'
        },
        {
          id: '2',
          address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          name: 'USDT Staking',
          symbol: 'USDT',
          tokenAddress: '0xa233487B7FB5941Dd81A28A4A547519760BFE89e',
          apy: 15.8,
          tvl: 890000,
          totalStakers: 256,
          minStake: '10',
          lockPeriod: 2592000,
          entryFee: 0,
          exitFee: 0,
          performanceFee: 0,
          rewardToken: '0xa233487B7FB5941Dd81A28A4A547519760BFE89e',
          isActive: true,
          createdAt: new Date(),
          logoUrl: '/placeholder.svg'
        },
        {
          id: '3',
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          name: 'ARB Staking',
          symbol: 'ARB',
          tokenAddress: '0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030',
          apy: 22.3,
          tvl: 450000,
          totalStakers: 189,
          minStake: '5',
          lockPeriod: 7776000,
          entryFee: 0,
          exitFee: 0,
          performanceFee: 0,
          rewardToken: '0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030',
          isActive: true,
          createdAt: new Date(),
          logoUrl: '/placeholder.svg'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserPositions = async () => {
    if (!account) return
    
    try {
      const userPositions = await stakingService.getUserPositions(account)
      setPositions(userPositions)
      console.log('Loaded user positions:', userPositions)
    } catch (error) {
      console.error('Error loading user positions:', error)
      setPositions([])
    }
  }

  const handleStake = (pool: StakingPool) => {
    setSelectedPool(pool)
    setShowStakeModal(true)
  }

  const handleWithdraw = (position: StakingPosition) => {
    setSelectedPosition(position)
    setShowWithdrawModal(true)
  }

  const handleStakeSuccess = () => {
    setShowStakeModal(false)
    setSelectedPool(null)
    // Refresh positions after successful stake
    setTimeout(() => {
      loadUserPositions()
    }, 2000)
  }

  const handleWithdrawSuccess = () => {
    setShowWithdrawModal(false)
    setSelectedPosition(null)
    // Refresh positions after successful withdrawal
    setTimeout(() => {
      loadUserPositions()
    }, 2000)
  }

  const formatTokenAmount = (amount: string, decimals: number = 6) => {
    const num = parseFloat(amount)
    if (num === 0) return '0'
    if (num < 0.01) return '< 0.01'
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    })
  }

  const formatLockPeriod = (seconds: number) => {
    if (seconds === 0) return 'Flexible staking'
    const days = Math.floor(seconds / (24 * 60 * 60))
    return `${days} days lock`
  }

  const getPoolIcon = (symbol: string) => {
    switch (symbol) {
      case 'USDC': return '💵'
      case 'USDT': return '💵'
      case 'ARB': return '🔷'
      default: return '💰'
    }
  }

  const getPoolColor = (symbol: string) => {
    switch (symbol) {
      case 'USDC': return 'bg-blue-500/20'
      case 'USDT': return 'bg-green-500/20'
      case 'ARB': return 'bg-purple-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading pools...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Stake</h1>
          <p className="text-muted-foreground">
            Stake your tokens to earn rewards and participate in DeFi
          </p>
        </div>

        {/* Wallet Connection Status */}
        {!isConnected ? (
          <Card className="p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <span className="text-2xl">👛</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Connect your wallet to view your staking positions and start earning rewards.
            </p>
            <ConnectWalletButton />
          </Card>
        ) : !isCorrectNetwork ? (
          <Card className="p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Wrong Network</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Please switch to Somnia Testnet to use the staking features.
            </p>
            <ConnectWalletButton />
          </Card>
        ) : (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-600">✅ Wallet Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Connected to {account?.slice(0, 6)}...{account?.slice(-4)} on Somnia Testnet
                </p>
              </div>
              <ConnectWalletButton variant="outline" />
            </div>
          </Card>
        )}

        {/* User Positions */}
        {isConnected && isCorrectNetwork && positions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Staking Positions</h2>
            
            <div className="space-y-4">
              {positions.map((position) => (
                <Card key={position.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${getPoolColor(position.pool.symbol)} flex items-center justify-center`}>
                        <span className="text-2xl">{getPoolIcon(position.pool.symbol)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{position.pool.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Staked: {formatTokenAmount(position.stakedAmount)} {position.pool.symbol}
                        </p>
                        <p className="text-sm text-green-600">
                          Rewards: {formatTokenAmount(position.rewardsEarned)} {position.pool.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-500">{position.apy}%</div>
                      <p className="text-sm text-muted-foreground">APY</p>
                      {position.isLocked && (
                        <p className="text-xs text-yellow-600">
                          Locked until {position.unlocksAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdraw(position)}
                        disabled={!position.canWithdraw}
                      >
                        Withdraw
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStake(position.pool)}
                      >
                        Add More
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Pools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Pools</h2>
          
          <div className="space-y-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${getPoolColor(pool.symbol)} flex items-center justify-center`}>
                      <span className="text-2xl">{getPoolIcon(pool.symbol)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{pool.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatLockPeriod(pool.lockPeriod)}</p>
                      {isConnected && tokenBalances[pool.symbol] && (
                        <p className="text-sm text-blue-600">
                          Balance: {formatTokenAmount(tokenBalances[pool.symbol])} {pool.symbol}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500">{pool.apy}%</div>
                    <p className="text-sm text-muted-foreground">APY</p>
                  </div>
                  <Button
                    disabled={!isConnected || !isCorrectNetwork}
                    onClick={() => handleStake(pool)}
                  >
                    {isConnected && isCorrectNetwork ? 'Stake' : 'Connect Wallet'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Staking Modal */}
        {showStakeModal && selectedPool && (
          <StakeModal
            pool={selectedPool}
            isOpen={showStakeModal}
            onClose={() => {
              setShowStakeModal(false)
              setSelectedPool(null)
            }}
            onSuccess={handleStakeSuccess}
          />
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && selectedPosition && (
          <WithdrawModal
            position={selectedPosition}
            isOpen={showWithdrawModal}
            onClose={() => {
              setShowWithdrawModal(false)
              setSelectedPosition(null)
            }}
            onSuccess={handleWithdrawSuccess}
          />
        )}
      </div>
    </AppLayout>
  )
}

export default StakeSimple
