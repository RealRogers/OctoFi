/**
 * Rewards Service
 * Service for reward calculations and history
 */

import { StakingPosition, RewardEvent } from '@/types/staking'
import { calculateRewards } from '@/lib/stakingUtils'
import { REWARDS_CONFIG } from '@/lib/stakingConstants'

/**
 * Rewards Service Class
 */
class RewardsService {
  
  /**
   * Calculate current rewards for a position
   * @param position - Staking position
   * @returns Current rewards as string
   */
  calculateCurrentRewards(position: StakingPosition): string {
    return position.rewardsEarned
  }

  /**
   * Calculate projected rewards
   * @param amount - Amount staked
   * @param apy - Annual percentage yield
   * @param days - Number of days
   * @returns Projected rewards as string
   */
  calculateProjectedRewards(amount: string, apy: number, days: number): string {
    return calculateRewards(amount, apy, days)
  }

  /**
   * Calculate APY from reward rate
   * @param rewardRate - Reward rate per second (as string)
   * @param totalSupply - Total staked supply (as string)
   * @param rewardTokenPrice - Price of reward token in USD
   * @returns APY as percentage
   */
  calculateAPY(
    rewardRate: string,
    totalSupply: string,
    rewardTokenPrice: number
  ): number {
    try {
      const rewardRateNum = parseFloat(rewardRate)
      const totalSupplyNum = parseFloat(totalSupply)
      
      if (totalSupplyNum === 0) return 0
      
      const rewardPerYear = rewardRateNum * REWARDS_CONFIG.SECONDS_PER_YEAR
      const rewardValuePerYear = rewardPerYear * rewardTokenPrice
      const totalStakedValue = totalSupplyNum * rewardTokenPrice // Assuming 1:1 for simplicity
      
      return (rewardValuePerYear / totalStakedValue) * 100
    } catch (error) {
      console.error('Error calculating APY:', error)
      return 0
    }
  }

  /**
   * Get rewards history for a user
   * @param userAddress - User's wallet address
   * @param poolAddress - Pool contract address
   * @returns Array of reward events
   */
  async getRewardsHistory(
    userAddress: string,
    poolAddress: string
  ): Promise<RewardEvent[]> {
    // In production, this would fetch from blockchain events or backend
    // For now, return empty array
    return []
  }

  /**
   * Calculate rewards breakdown by time period
   * @param position - Staking position
   * @returns Rewards breakdown
   */
  calculateRewardsBreakdown(position: StakingPosition): {
    daily: string
    weekly: string
    monthly: string
    yearly: string
  } {
    const amount = position.stakedAmount
    const apy = position.apy

    return {
      daily: calculateRewards(amount, apy, 1),
      weekly: calculateRewards(amount, apy, 7),
      monthly: calculateRewards(amount, apy, 30),
      yearly: calculateRewards(amount, apy, 365)
    }
  }

  /**
   * Calculate total rewards earned across all positions
   * @param positions - Array of staking positions
   * @returns Total rewards in USD
   */
  calculateTotalRewards(positions: StakingPosition[]): number {
    return positions.reduce((total, pos) => total + pos.rewardsEarnedUSD, 0)
  }

  /**
   * Calculate estimated time to reach target rewards
   * @param currentAmount - Current staked amount
   * @param targetRewards - Target rewards amount
   * @param apy - Annual percentage yield
   * @returns Days to reach target
   */
  calculateTimeToTarget(
    currentAmount: string,
    targetRewards: string,
    apy: number
  ): number {
    try {
      const amount = parseFloat(currentAmount)
      const target = parseFloat(targetRewards)
      
      if (amount === 0 || apy === 0) return Infinity
      
      const dailyRate = apy / 100 / REWARDS_CONFIG.DAYS_PER_YEAR
      const days = target / (amount * dailyRate)
      
      return Math.ceil(days)
    } catch (error) {
      console.error('Error calculating time to target:', error)
      return Infinity
    }
  }
}

// Export singleton instance
export const rewardsService = new RewardsService()
