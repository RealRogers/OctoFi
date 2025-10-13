/**
 * AgentAuditTrail Molecule Component
 * Displays comprehensive audit trail of trading agent actions with export functionality
 */

import React, { useState, useEffect } from 'react'
import { 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  BarChart3, 
  Bot, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  FileText,
  FileSpreadsheet
} from 'lucide-react'
import { AgentAction, TransactionResult } from '@/services/types'
import { useTradingAgent } from '@/hooks/useTradingAgent'
import { formatUSDAmount } from '@/services/utils'
import { exportService } from '@/services/exportService'
import { useToast } from '@/components/ui/use-toast'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { EmptyState, LoadingEmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

interface AgentAuditTrailProps {
  className?: string
  maxItems?: number
  showExport?: boolean
}

type FilterType = 'all' | 'swap' | 'pause' | 'resume' | 'strategy_change'
type TimeFilter = 'all' | '1h' | '24h' | '7d' | '30d'

const AgentAuditTrail: React.FC<AgentAuditTrailProps> = ({
  className,
  maxItems = 50,
  showExport = true
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h')
  const [tradingHistory, setTradingHistory] = useState<TransactionResult[]>([])
  const [isExporting, setIsExporting] = useState(false)
  
  const { recentActions, getHistory, isLoading } = useTradingAgent()
  const { toast } = useToast()

  // Fetch trading history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistory()
        setTradingHistory(history)
      } catch (error) {
        console.error('Failed to fetch trading history:', error)
      }
    }
    
    fetchHistory()
  }, [getHistory])

  // Filter actions based on search and filters
  const filteredActions = recentActions.filter(action => {
    // Type filter
    if (typeFilter !== 'all' && action.type !== typeFilter) {
      return false
    }
    
    // Time filter
    const now = new Date()
    const actionTime = new Date(action.timestamp)
    const timeDiff = now.getTime() - actionTime.getTime()
    
    switch (timeFilter) {
      case '1h':
        if (timeDiff > 60 * 60 * 1000) return false
        break
      case '24h':
        if (timeDiff > 24 * 60 * 60 * 1000) return false
        break
      case '7d':
        if (timeDiff > 7 * 24 * 60 * 60 * 1000) return false
        break
      case '30d':
        if (timeDiff > 30 * 24 * 60 * 60 * 1000) return false
        break
    }
    
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matchesType = action.type.toLowerCase().includes(searchLower)
      const matchesData = JSON.stringify(action.data).toLowerCase().includes(searchLower)
      const matchesError = action.error?.toLowerCase().includes(searchLower)
      
      if (!matchesType && !matchesData && !matchesError) {
        return false
      }
    }
    
    return true
  }).slice(0, maxItems)

  const getActionIcon = (action: AgentAction) => {
    switch (action.type) {
      case 'swap':
        return <BarChart3 className="w-4 h-4" />
      case 'pause':
        return <Clock className="w-4 h-4" />
      case 'resume':
        return <Bot className="w-4 h-4" />
      case 'strategy_change':
        return <Settings className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getActionColor = (action: AgentAction) => {
    if (action.result === 'failure') return 'text-red-400'
    
    switch (action.type) {
      case 'swap':
        return 'text-blue-400'
      case 'resume':
        return 'text-green-400'
      case 'pause':
        return 'text-yellow-400'
      case 'strategy_change':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />
      case 'failure':
        return <XCircle className="w-3 h-3 text-red-400" />
      default:
        return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  const formatActionData = (action: AgentAction) => {
    switch (action.type) {
      case 'swap':
        const swapData = action.data
        if (swapData.params) {
          return `${swapData.params.fromToken?.symbol} → ${swapData.params.toToken?.symbol} (${swapData.params.amount})`
        }
        return 'Swap executed'
      
      case 'strategy_change':
        const strategyData = action.data
        return `Risk: ${strategyData.newStrategy?.riskTolerance || 'Unknown'}`
      
      case 'pause':
        return action.data.reason || 'Agent paused'
      
      case 'resume':
        return 'Agent resumed'
      
      default:
        return 'Action performed'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp))
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true)
    
    try {
      // Show loading toast
      toast({
        title: "🔄 Preparing Export",
        description: `Generating ${format.toUpperCase()} file...`,
        variant: "default",
      })

      // Prepare export data
      const exportData = filteredActions.map(action => ({
        timestamp: formatTimestamp(action.timestamp),
        type: action.type,
        result: action.result || 'unknown',
        description: formatActionData(action),
        error: action.error || '',
        details: JSON.stringify(action.data || {})
      }))

      // Export using the service
      exportService.exportAuditTrail(exportData, format)

      // Show success toast
      toast({
        title: "✅ Export Complete",
        description: `Audit trail exported as ${format.toUpperCase()} file`,
        variant: "default",
      })
    } catch (error) {
      console.error('Export failed:', error)
      toast({
        title: "❌ Export Failed",
        description: error instanceof Error ? error.message : 'Failed to export audit trail',
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={cn('bg-gray-800/50 border border-gray-700 rounded-lg', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Agent Audit Trail</h3>
          </div>
          
          {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={isExporting || filteredActions.length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-700 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FilterType)}
            className="px-3 py-1.5 bg-gray-900 border border-gray-600 rounded text-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="swap">Swaps</option>
            <option value="pause">Pauses</option>
            <option value="resume">Resumes</option>
            <option value="strategy_change">Strategy Changes</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="px-3 py-1.5 bg-gray-900 border border-gray-600 rounded text-white text-sm"
          >
            <option value="all">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Actions List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <LoadingEmptyState
            loadingText="Loading Audit Trail"
            size="sm"
            glowColor="blue"
          />
        ) : filteredActions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={searchQuery || typeFilter !== 'all' || timeFilter !== 'all' ? 'No Actions Found' : 'No Activity Yet'}
            description={
              searchQuery || typeFilter !== 'all' || timeFilter !== 'all' 
                ? 'No actions match your current filters. Try adjusting your search criteria or time range.' 
                : 'Agent actions and trading activity will appear here once your AI agent starts operating.'
            }
            action={
              searchQuery || typeFilter !== 'all' || timeFilter !== 'all' 
                ? {
                    label: 'Clear Filters',
                    onClick: () => {
                      setSearchQuery('')
                      setTypeFilter('all')
                      setTimeFilter('24h')
                    }
                  }
                : undefined
            }
            size="sm"
            glowColor="gray"
          />
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredActions.map((action, index) => (
              <div key={index} className="p-4 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Action Icon */}
                  <div className={cn(
                    'p-2 rounded-full mt-1',
                    action.result === 'success' ? 'bg-green-500/20' :
                    action.result === 'failure' ? 'bg-red-500/20' : 'bg-gray-700'
                  )}>
                    <div className={getActionColor(action)}>
                      {getActionIcon(action)}
                    </div>
                  </div>

                  {/* Action Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium capitalize">
                        {action.type.replace('_', ' ')}
                      </span>
                      {getResultIcon(action.result)}
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(action.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-1">
                      {formatActionData(action)}
                    </p>
                    
                    {action.error && (
                      <p className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                        Error: {action.error}
                      </p>
                    )}
                    
                    {/* Additional Data */}
                    {action.data && Object.keys(action.data).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                          View Details
                        </summary>
                        <pre className="text-xs text-gray-400 mt-1 p-2 bg-gray-900/50 rounded overflow-x-auto">
                          {JSON.stringify(action.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredActions.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{filteredActions.length}</div>
              <div className="text-xs text-gray-400">Total Actions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {filteredActions.filter(a => a.result === 'success').length}
              </div>
              <div className="text-xs text-gray-400">Successful</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">
                {filteredActions.filter(a => a.result === 'failure').length}
              </div>
              <div className="text-xs text-gray-400">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentAuditTrail