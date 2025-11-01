/**
 * Staking Validators
 * Zod schemas for validating staking operations
 */

import { z } from 'zod'
import { SOMNIA_TESTNET } from './stakingConstants'

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Base schema for amount validation
 */
export const baseAmountSchema = z.string()
  .min(1, 'Amount is required')
  .refine((val) => !isNaN(parseFloat(val)), 'Amount must be a valid number')
  .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0')

/**
 * Base schema for address validation
 */
export const addressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

/**
 * Base schema for transaction hash validation
 */
export const transactionHashSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')

// ============================================================================
// Stake Validation
// ============================================================================

/**
 * Basic stake form schema
 */
export const stakeSchema = z.object({
  amount: baseAmountSchema
})

/**
 * Create a dynamic stake validator with balance and pool limits
 * @param balance - User's token balance
 * @param minStake - Minimum stake amount for the pool
 * @param maxStake - Maximum stake amount for the pool (optional)
 * @returns Zod schema with dynamic validation
 */
export const createStakeValidator = (
  balance: string,
  minStake: string,
  maxStake?: string
) => {
  const balanceNum = parseFloat(balance)
  const minStakeNum = parseFloat(minStake)
  const maxStakeNum = maxStake ? parseFloat(maxStake) : Infinity
  
  return z.object({
    amount: baseAmountSchema
      .refine(
        (val) => parseFloat(val) <= balanceNum,
        {
          message: `Insufficient balance. Available: ${balance}`
        }
      )
      .refine(
        (val) => parseFloat(val) >= minStakeNum,
        {
          message: `Minimum stake amount is ${minStake}`
        }
      )
      .refine(
        (val) => !maxStake || parseFloat(val) <= maxStakeNum,
        {
          message: maxStake ? `Maximum stake amount is ${maxStake}` : ''
        }
      )
  })
}

/**
 * Validate stake amount against balance
 * @param amount - Amount to stake
 * @param balance - Available balance
 * @returns Validation result
 */
export const validateStakeAmount = (
  amount: string,
  balance: string
): { valid: boolean; error?: string } => {
  const amountNum = parseFloat(amount)
  const balanceNum = parseFloat(balance)
  
  if (isNaN(amountNum)) {
    return { valid: false, error: 'Invalid amount' }
  }
  
  if (amountNum <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }
  
  if (amountNum > balanceNum) {
    return { valid: false, error: 'Insufficient balance' }
  }
  
  return { valid: true }
}

// ============================================================================
// Withdraw Validation
// ============================================================================

/**
 * Basic withdraw form schema
 */
export const withdrawSchema = z.object({
  amount: baseAmountSchema
})

/**
 * Create a dynamic withdraw validator with staked amount and lock status
 * @param stakedAmount - Amount currently staked
 * @param isLocked - Whether the position is locked
 * @param unlockTime - Time when position unlocks (optional)
 * @returns Zod schema with dynamic validation
 */
export const createWithdrawValidator = (
  stakedAmount: string,
  isLocked: boolean,
  unlockTime?: Date
) => {
  const stakedNum = parseFloat(stakedAmount)
  
  let schema = z.object({
    amount: baseAmountSchema
      .refine(
        (val) => parseFloat(val) <= stakedNum,
        {
          message: `Maximum withdraw amount is ${stakedAmount}`
        }
      )
  })
  
  // Add lock validation if position is locked
  if (isLocked) {
    const timeRemaining = unlockTime 
      ? Math.ceil((unlockTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0
    
    schema = z.object({
      amount: baseAmountSchema.refine(
        () => false,
        {
          message: `Position is locked. ${timeRemaining > 0 ? `Unlocks in ${timeRemaining} days` : 'Cannot withdraw yet'}`
        }
      )
    })
  }
  
  return schema
}

/**
 * Validate withdraw amount against staked amount
 * @param amount - Amount to withdraw
 * @param stakedAmount - Amount currently staked
 * @param isLocked - Whether position is locked
 * @returns Validation result
 */
export const validateWithdrawAmount = (
  amount: string,
  stakedAmount: string,
  isLocked: boolean
): { valid: boolean; error?: string } => {
  if (isLocked) {
    return { valid: false, error: 'Position is still locked' }
  }
  
  const amountNum = parseFloat(amount)
  const stakedNum = parseFloat(stakedAmount)
  
  if (isNaN(amountNum)) {
    return { valid: false, error: 'Invalid amount' }
  }
  
  if (amountNum <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }
  
  if (amountNum > stakedNum) {
    return { valid: false, error: 'Exceeds staked amount' }
  }
  
  return { valid: true }
}

// ============================================================================
// Network Validation
// ============================================================================

/**
 * Network validation schema
 */
export const networkSchema = z.object({
  chainId: z.number().refine(
    (id) => id === SOMNIA_TESTNET.chainId,
    {
      message: `Please switch to ${SOMNIA_TESTNET.chainName} (Chain ID: ${SOMNIA_TESTNET.chainId})`
    }
  )
})

/**
 * Validate network chain ID
 * @param chainId - Current chain ID
 * @returns Validation result
 */
export const validateNetwork = (chainId: number): { valid: boolean; error?: string } => {
  if (chainId !== SOMNIA_TESTNET.chainId) {
    return {
      valid: false,
      error: `Please switch to ${SOMNIA_TESTNET.chainName} (Chain ID: ${SOMNIA_TESTNET.chainId})`
    }
  }
  
  return { valid: true }
}

// ============================================================================
// Transaction Validation
// ============================================================================

/**
 * Transaction schema
 */
export const transactionSchema = z.object({
  hash: transactionHashSchema,
  status: z.enum(['pending', 'confirmed', 'failed'])
})

/**
 * Validate transaction hash format
 * @param hash - Transaction hash
 * @returns Validation result
 */
export const validateTransactionHash = (hash: string): { valid: boolean; error?: string } => {
  const regex = /^0x[a-fA-F0-9]{64}$/
  
  if (!regex.test(hash)) {
    return { valid: false, error: 'Invalid transaction hash format' }
  }
  
  return { valid: true }
}

// ============================================================================
// Pool Filter Validation
// ============================================================================

/**
 * Pool filters schema
 */
export const poolFiltersSchema = z.object({
  search: z.string(),
  minAPY: z.number().min(0).max(100),
  maxAPY: z.number().min(0).max(100),
  minTVL: z.number().min(0),
  lockPeriod: z.enum(['all', 'none', '7d', '30d', '90d']),
  showAIPredictions: z.boolean()
}).refine(
  (data) => data.minAPY <= data.maxAPY,
  {
    message: 'Minimum APY must be less than or equal to maximum APY',
    path: ['minAPY']
  }
)

// ============================================================================
// Calculator Validation
// ============================================================================

/**
 * Rewards calculator schema
 */
export const calculatorSchema = z.object({
  poolId: z.string().min(1, 'Please select a pool'),
  amount: baseAmountSchema,
  days: z.number()
    .min(1, 'Days must be at least 1')
    .max(365, 'Days cannot exceed 365')
})

/**
 * Validate calculator inputs
 * @param amount - Amount to calculate
 * @param days - Number of days
 * @returns Validation result
 */
export const validateCalculatorInputs = (
  amount: string,
  days: number
): { valid: boolean; error?: string } => {
  const amountNum = parseFloat(amount)
  
  if (isNaN(amountNum) || amountNum <= 0) {
    return { valid: false, error: 'Invalid amount' }
  }
  
  if (days < 1 || days > 365) {
    return { valid: false, error: 'Days must be between 1 and 365' }
  }
  
  return { valid: true }
}

// ============================================================================
// Wallet Validation
// ============================================================================

/**
 * Validate wallet connection
 * @param address - Wallet address
 * @returns Validation result
 */
export const validateWalletConnection = (
  address: string | null | undefined
): { valid: boolean; error?: string } => {
  if (!address) {
    return { valid: false, error: 'Wallet not connected' }
  }
  
  const regex = /^0x[a-fA-F0-9]{40}$/
  if (!regex.test(address)) {
    return { valid: false, error: 'Invalid wallet address' }
  }
  
  return { valid: true }
}

// ============================================================================
// Allowance Validation
// ============================================================================

/**
 * Validate token allowance
 * @param allowance - Current allowance
 * @param amount - Amount to stake
 * @returns Validation result
 */
export const validateAllowance = (
  allowance: string,
  amount: string
): { valid: boolean; needsApproval: boolean } => {
  const allowanceNum = parseFloat(allowance)
  const amountNum = parseFloat(amount)
  
  if (isNaN(allowanceNum) || isNaN(amountNum)) {
    return { valid: false, needsApproval: false }
  }
  
  const needsApproval = allowanceNum < amountNum
  
  return { valid: true, needsApproval }
}

// ============================================================================
// Gas Validation
// ============================================================================

/**
 * Validate gas estimation
 * @param gasEstimate - Estimated gas
 * @param gasLimit - Gas limit
 * @returns Validation result
 */
export const validateGasEstimate = (
  gasEstimate: string,
  gasLimit: string
): { valid: boolean; error?: string } => {
  const estimateNum = parseFloat(gasEstimate)
  const limitNum = parseFloat(gasLimit)
  
  if (isNaN(estimateNum) || isNaN(limitNum)) {
    return { valid: false, error: 'Invalid gas values' }
  }
  
  if (estimateNum > limitNum) {
    return { valid: false, error: 'Gas estimate exceeds limit' }
  }
  
  return { valid: true }
}

// ============================================================================
// Comprehensive Validation
// ============================================================================

/**
 * Validate all stake prerequisites
 * @param params - Validation parameters
 * @returns Comprehensive validation result
 */
export const validateStakePrerequisites = (params: {
  walletAddress: string | null | undefined
  chainId: number
  amount: string
  balance: string
  minStake: string
  maxStake?: string
  allowance: string
}): {
  valid: boolean
  errors: string[]
  needsApproval: boolean
} => {
  const errors: string[] = []
  
  // Validate wallet
  const walletValidation = validateWalletConnection(params.walletAddress)
  if (!walletValidation.valid) {
    errors.push(walletValidation.error!)
  }
  
  // Validate network
  const networkValidation = validateNetwork(params.chainId)
  if (!networkValidation.valid) {
    errors.push(networkValidation.error!)
  }
  
  // Validate amount
  const amountValidation = validateStakeAmount(params.amount, params.balance)
  if (!amountValidation.valid) {
    errors.push(amountValidation.error!)
  }
  
  // Check min/max stake
  const amountNum = parseFloat(params.amount)
  const minStakeNum = parseFloat(params.minStake)
  
  if (!isNaN(amountNum) && !isNaN(minStakeNum) && amountNum < minStakeNum) {
    errors.push(`Minimum stake amount is ${params.minStake}`)
  }
  
  if (params.maxStake) {
    const maxStakeNum = parseFloat(params.maxStake)
    if (!isNaN(amountNum) && !isNaN(maxStakeNum) && amountNum > maxStakeNum) {
      errors.push(`Maximum stake amount is ${params.maxStake}`)
    }
  }
  
  // Check allowance
  const allowanceValidation = validateAllowance(params.allowance, params.amount)
  
  return {
    valid: errors.length === 0,
    errors,
    needsApproval: allowanceValidation.needsApproval
  }
}

/**
 * Validate all withdraw prerequisites
 * @param params - Validation parameters
 * @returns Comprehensive validation result
 */
export const validateWithdrawPrerequisites = (params: {
  walletAddress: string | null | undefined
  chainId: number
  amount: string
  stakedAmount: string
  isLocked: boolean
}): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  // Validate wallet
  const walletValidation = validateWalletConnection(params.walletAddress)
  if (!walletValidation.valid) {
    errors.push(walletValidation.error!)
  }
  
  // Validate network
  const networkValidation = validateNetwork(params.chainId)
  if (!networkValidation.valid) {
    errors.push(networkValidation.error!)
  }
  
  // Validate amount
  const amountValidation = validateWithdrawAmount(
    params.amount,
    params.stakedAmount,
    params.isLocked
  )
  if (!amountValidation.valid) {
    errors.push(amountValidation.error!)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
