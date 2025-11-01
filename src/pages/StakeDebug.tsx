/**
 * Stake Debug Page
 * Temporary debug page to test staking functionality
 */

import { useEffect, useState } from 'react'
import AppLayout from "@/components/AppLayout"
import { stakingService } from "@/services/stakingService"
import { Card } from "@/components/ui/card"

const StakeDebug = () => {
  const [pools, setPools] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading pools...')
        const poolsData = await stakingService.getAllPools()
        console.log('Pools loaded:', poolsData)
        setPools(poolsData)

        // Try to load positions with a mock address
        const mockAddress = '0x1234567890123456789012345678901234567890'
        console.log('Loading positions for:', mockAddress)
        const positionsData = await stakingService.getUserPositions(mockAddress)
        console.log('Positions loaded:', positionsData)
        setPositions(positionsData)

        setLoading(false)
      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Stake Debug</h1>

        {loading && (
          <Card className="p-8">
            <p>Loading...</p>
          </Card>
        )}

        {error && (
          <Card className="p-8 bg-destructive/10 border-destructive">
            <h2 className="text-xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">Pools ({pools.length})</h2>
              <pre className="bg-muted p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(pools, null, 2)}
              </pre>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Positions ({positions.length})</h2>
              <pre className="bg-muted p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(positions, null, 2)}
              </pre>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default StakeDebug
