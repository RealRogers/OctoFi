/**
 * Stake Page
 * Main page for staking functionality
 */

import { useEffect, useState, useRef } from 'react'
import AppLayout from "@/components/AppLayout"
import { StakingHeader } from "@/components/organisms/StakingHeader"
import UserPositions from "@/components/organisms/UserPositions"
import AvailablePools from "@/components/organisms/AvailablePools"
import { StakingHistory } from "@/components/organisms/StakingHistory"
import { WalletNotConnectedEmpty } from "@/components/molecules/StakingEmptyStates"
import { NetworkWarning } from "@/components/molecules/ErrorAlert"
import { useStakingPositions } from "@/hooks/useStakingPositions"
import { blockchainService } from "@/services/blockchainService"
import { SOMNIA_TESTNET } from "@/lib/stakingConstants"
import { Separator } from "@/components/ui/separator"

const Stake = () => {
  const [userAddress, setUserAddress] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const poolsRef = useRef<HTMLDivElement>(null)

  // Get user's staking stats
  const { stats, isLoading: isLoadingStats } = useStakingPositions(userAddress)
  
  console.log('Stake Page - Render:', { userAddress, isInitialized, isLoadingStats, stats })

  // Check wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if window.ethereum exists
        if (typeof window !== 'undefined' && window.ethereum) {
          const address = await blockchainService.getConnectedAddress()
          setUserAddress(address || undefined)

          if (address) {
            const currentChainId = await blockchainService.getCurrentChainId()
            setChainId(currentChainId)
            setIsWrongNetwork(currentChainId !== SOMNIA_TESTNET.chainId)
          }
        } else {
          console.log('No wallet provider found')
          setUserAddress(undefined)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
        // Set userAddress to undefined to show connect wallet state
        setUserAddress(undefined)
      } finally {
        setIsInitialized(true)
      }
    }

    checkConnection()

    // Listen for account changes
    const unsubscribeAccount = blockchainService.onAccountChanged((address) => {
      setUserAddress(address || undefined)
    })

    // Listen for chain changes
    const unsubscribeChain = blockchainService.onChainChanged((newChainId) => {
      setChainId(newChainId)
      setIsWrongNetwork(newChainId !== SOMNIA_TESTNET.chainId)
    })

    return () => {
      unsubscribeAccount()
      unsubscribeChain()
    }
  }, [])

  // Handle connect wallet
  const handleConnectWallet = async () => {
    try {
      const address = await blockchainService.connectWallet()
      setUserAddress(address)

      const currentChainId = await blockchainService.getCurrentChainId()
      setChainId(currentChainId)
      setIsWrongNetwork(currentChainId !== SOMNIA_TESTNET.chainId)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  // Handle switch network
  const handleSwitchNetwork = async () => {
    try {
      await blockchainService.switchNetwork(SOMNIA_TESTNET.chainId)
    } catch (error) {
      console.error('Error switching network:', error)
    }
  }

  // Scroll to pools section
  const scrollToPools = () => {
    poolsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
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

        {/* Network Warning */}
        {userAddress && isWrongNetwork && (
          <div className="mb-6">
            <NetworkWarning onSwitch={handleSwitchNetwork} />
          </div>
        )}

        {/* Wallet Not Connected */}
        {!userAddress ? (
          <div className="mb-12">
            <WalletNotConnectedEmpty onConnect={handleConnectWallet} />
          </div>
        ) : (
          <>
            {/* Staking Stats Header */}
            <div className="mb-8">
              <StakingHeader
                totalStakedUSD={stats.totalStakedUSD}
                totalRewardsUSD={stats.totalRewardsUSD}
                averageAPY={stats.averageAPY}
                activePositions={stats.activePositions}
                isLoading={isLoadingStats}
              />
            </div>

            <Separator className="mb-8" />

            {/* User Positions */}
            <UserPositions 
              userAddress={userAddress}
              onExploreClick={scrollToPools}
            />

            <Separator className="mb-8" />
          </>
        )}

        {/* Available Pools */}
        <div ref={poolsRef}>
          <AvailablePools userAddress={userAddress} />
        </div>

        {/* Transaction History */}
        {userAddress && (
          <>
            <Separator className="my-8" />
            <StakingHistory userAddress={userAddress} />
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default Stake
