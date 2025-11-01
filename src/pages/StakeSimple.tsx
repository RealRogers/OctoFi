/**
 * Stake Simple Page
 * Simplified version for debugging
 */

import { useState, useEffect } from 'react'
import AppLayout from "@/components/AppLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const StakeSimple = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('StakeSimple mounted')
    // Simulate initialization
    setTimeout(() => {
      setIsLoading(false)
      console.log('StakeSimple initialized')
    }, 500)
  }, [])

  if (isLoading) {
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

        {/* Wallet Not Connected */}
        <Card className="p-8 text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <span className="text-2xl">👛</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Connect your wallet to view your staking positions and start earning rewards.
          </p>
          <Button>Connect Wallet</Button>
        </Card>

        {/* Available Pools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Pools</h2>
          
          <div className="space-y-4">
            {/* Pool 1 */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">USDC Staking</h3>
                    <p className="text-sm text-muted-foreground">Flexible staking</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-500">12.5%</div>
                  <p className="text-sm text-muted-foreground">APY</p>
                </div>
                <Button>Stake</Button>
              </div>
            </Card>

            {/* Pool 2 */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">USDT Staking</h3>
                    <p className="text-sm text-muted-foreground">30 days lock</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-500">15.8%</div>
                  <p className="text-sm text-muted-foreground">APY</p>
                </div>
                <Button>Stake</Button>
              </div>
            </Card>

            {/* Pool 3 */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-2xl">🔷</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">ARB Staking</h3>
                    <p className="text-sm text-muted-foreground">90 days lock</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-500">22.3%</div>
                  <p className="text-sm text-muted-foreground">APY</p>
                </div>
                <Button>Stake</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default StakeSimple
