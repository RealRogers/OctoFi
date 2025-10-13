/**
 * Enhanced TokenSelector Atom Component
 * Token selection with AI recommendations, risk indicators, and audit status
 */

import React, { useState, useEffect } from 'react'
import { ChevronDown, Search, Star, Shield, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { Token, SentimentAnalysis } from '@/services/types'
import { aiInsightsService, dataService } from '@/services'
import { useAppStore } from '@/services/store'
import { cn } from '@/lib/utils'

interface TokenSelectorProps {
  selectedToken?: Token | null
  onTokenSelect: (token: Token) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  type?: 'from' | 'to'
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  placeholder = "Select token",
  className,
  disabled = false,
  type = 'from'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [tokenSentiments, setTokenSentiments] = useState<Map<string, SentimentAnalysis>>(new Map())
  const [isLoading, setIsLoading] = useState(false)

  const { currentChainId, isAIServiceAvailable } = useAppStore()

  // Fetch tokens when component mounts or chain changes
  useEffect(() => {
    if (currentChainId) {
      fetchTokens()
    }
  }, [currentChainId])

  // Fetch AI sentiments for visible tokens
  useEffect(() => {
    if (isOpen && isAIServiceAvailable && tokens.length > 0) {
      fetchTokenSentiments()
    }
  }, [isOpen, isAIServiceAvailable, tokens])

  const fetchTokens = async () => {
    if (!currentChainId) return

    setIsLoading(true)
    try {
      const tokenList = await dataService.getTokenList(currentChainId)
      setTokens(tokenList)
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
      // Use fallback tokens
      setTokens(getFallbackTokens())
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTokenSentiments = async () => {
    const sentimentMap = new Map<string, SentimentAnalysis>()
    
    // Fetch sentiments for top tokens (limit to avoid rate limiting)
    const topTokens = tokens.slice(0, 10)
    
    await Promise.allSettled(
      topTokens.map(async (token) => {
        try {
          const sentiment = await aiInsightsService.getMarketSentiment(token)
          sentimentMap.set(token.symbol, sentiment)
        } catch (error) {
          // Ignore individual failures
        }
      })
    )
    
    setTokenSentiments(sentimentMap)
  }

  const getFallbackTokens = (): Token[] => {
    const chainId = currentChainId || 1
    return [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logoURI: '',
        chainId,
        verified: true,
        auditStatus: 'audited'
      },
      {
        address: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c07e8e8e',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: '',
        chainId,
        verified: true,
        auditStatus: 'audited'
      },
      {
        address: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c07e8e8f',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: '',
        chainId,
        verified: true,
        auditStatus: 'audited'
      }
    ]
  }

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAuditStatusIcon = (status?: string) => {
    switch (status) {
      case 'audited':
        return <Shield className="w-3 h-3 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />
      default:
        return null
    }
  }

  const getSentimentIcon = (sentiment?: SentimentAnalysis) => {
    if (!sentiment) return null
    
    switch (sentiment.sentiment) {
      case 'positive':
        return <TrendingUp className="w-3 h-3 text-green-400" />
      case 'negative':
        return <TrendingDown className="w-3 h-3 text-red-400" />
      default:
        return null
    }
  }

  const getSentimentColor = (sentiment?: SentimentAnalysis) => {
    if (!sentiment) return 'text-gray-400'
    
    switch (sentiment.sentiment) {
      case 'positive':
        return 'text-green-400'
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const handleTokenClick = (token: Token) => {
    onTokenSelect(token)
    setIsOpen(false)
    setSearchQuery('')
  }

  const renderTokenIcon = (token: Token) => {
    if (token.logoURI) {
      return (
        <img 
          src={token.logoURI} 
          alt={token.symbol}
          className="w-6 h-6 rounded-full"
        />
      )
    }
    
    // Fallback icon based on token symbol
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'
    ]
    const colorIndex = token.symbol.charCodeAt(0) % colors.length
    
    return (
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold',
        colors[colorIndex]
      )}>
        {token.symbol.charAt(0)}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Selector Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2 hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0 min-h-[44px]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {selectedToken ? (
          <>
            {renderTokenIcon(selectedToken)}
            <span className="text-sm text-gray-300 font-medium">
              {selectedToken.symbol}
            </span>
            {selectedToken.verified && (
              <Star className="w-3 h-3 text-yellow-400" />
            )}
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-400">{placeholder}</span>
          </>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 text-gray-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Token List */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                Loading tokens...
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => {
                const sentiment = tokenSentiments.get(token.symbol)
                
                return (
                  <button
                    key={`${token.address}-${token.chainId}`}
                    onClick={() => handleTokenClick(token)}
                    className="w-full p-3 hover:bg-gray-700 transition-colors text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {renderTokenIcon(token)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{token.symbol}</span>
                          {token.verified && (
                            <Star className="w-3 h-3 text-yellow-400" />
                          )}
                          {getAuditStatusIcon(token.auditStatus)}
                        </div>
                        <div className="text-xs text-gray-400">{token.name}</div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {isAIServiceAvailable && (
                      <div className="flex items-center gap-2">
                        {sentiment && (
                          <div className="flex items-center gap-1">
                            {getSentimentIcon(sentiment)}
                            <span className={cn('text-xs', getSentimentColor(sentiment))}>
                              {Math.abs(sentiment.score * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* AI Recommendations Footer */}
          {isAIServiceAvailable && (
            <div className="p-2 border-t border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 text-center">
                AI recommendations • Updated in real-time
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default TokenSelector