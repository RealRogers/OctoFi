/**
 * AgentAuditTrailCompact Component
 * Compact version of AgentAuditTrail optimized for narrow column (20% width)
 */

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3, 
  Bot, 
  Settings,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  MoreHorizontal
} from 'lucide-react';
import { AgentAction } from '@/services/types';
import { useTradingAgent } from '@/hooks/useTradingAgent';
import { exportService } from '@/services/exportService';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AgentAuditTrailCompactProps {
  className?: string;
  maxItems?: number;
  showExport?: boolean;
}

const AgentAuditTrailCompact: React.FC<AgentAuditTrailCompactProps> = ({
  className,
  maxItems = 8,
  showExport = true
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const { recentActions, isLoading } = useTradingAgent();
  const { toast } = useToast();

  // Get recent actions limited to maxItems
  const recentLimitedActions = recentActions.slice(0, maxItems);

  const getActionIcon = (action: AgentAction) => {
    switch (action.type) {
      case 'swap':
        return <BarChart3 className="w-3 h-3" />;
      case 'pause':
        return <Clock className="w-3 h-3" />;
      case 'resume':
        return <Bot className="w-3 h-3" />;
      case 'strategy_change':
        return <Settings className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getActionColor = (action: AgentAction) => {
    if (action.result === 'failure') return 'text-red-400';
    
    switch (action.type) {
      case 'swap':
        return 'text-blue-400';
      case 'resume':
        return 'text-green-400';
      case 'pause':
        return 'text-yellow-400';
      case 'strategy_change':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="w-2 h-2 text-green-400" />;
      case 'failure':
        return <XCircle className="w-2 h-2 text-red-400" />;
      default:
        return <Clock className="w-2 h-2 text-gray-400" />;
    }
  };

  const formatActionType = (type: string) => {
    switch (type) {
      case 'swap':
        return 'Trade';
      case 'pause':
        return 'Pause';
      case 'resume':
        return 'Resume';
      case 'strategy_change':
        return 'Strategy';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    try {
      toast({
        title: "🔄 Preparing Export",
        description: `Generating ${format.toUpperCase()} file...`,
        variant: "default",
      });

      const exportData = recentActions.map(action => ({
        timestamp: new Date(action.timestamp).toISOString(),
        type: action.type,
        result: action.result || 'unknown',
        error: action.error || '',
        details: JSON.stringify(action.data || {})
      }));

      exportService.exportAuditTrail(exportData, format);

      toast({
        title: "✅ Export Complete",
        description: `Audit trail exported as ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: error instanceof Error ? error.message : 'Export failed',
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const successCount = recentLimitedActions.filter(a => a.result === 'success').length;
  const failureCount = recentLimitedActions.filter(a => a.result === 'failure').length;

  return (
    <Card className={cn('glass-card h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            History
          </CardTitle>
          
          {showExport && recentActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isExporting}
                  className="h-6 w-6 p-0"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem 
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="text-xs"
                >
                  <FileSpreadsheet className="w-3 h-3 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="text-xs"
                >
                  <FileText className="w-3 h-3 mr-2" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Quick Stats */}
        {recentLimitedActions.length > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">{successCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">{failureCount}</span>
            </div>
            <div className="text-xs text-gray-400">
              Last {recentLimitedActions.length}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2 glass-card rounded animate-pulse">
                <div className="w-6 h-6 bg-gray-700 rounded" />
                <div className="flex-1 space-y-1">
                  <div className="w-16 h-3 bg-gray-700 rounded" />
                  <div className="w-12 h-2 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentLimitedActions.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No activity yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Actions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {recentLimitedActions.map((action, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 glass-card rounded-lg transition-all duration-200 cursor-pointer",
                  "hover:bg-white/5",
                  expandedId === index && "bg-white/5"
                )}
                onClick={() => setExpandedId(expandedId === index ? null : index)}
              >
                <div className="flex items-center gap-2">
                  {/* Action Icon */}
                  <div className={cn(
                    'p-1 rounded',
                    action.result === 'success' ? 'bg-green-500/20' :
                    action.result === 'failure' ? 'bg-red-500/20' : 'bg-gray-700/50'
                  )}>
                    <div className={getActionColor(action)}>
                      {getActionIcon(action)}
                    </div>
                  </div>

                  {/* Action Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white truncate">
                        {formatActionType(action.type)}
                      </span>
                      <div className="flex items-center gap-1">
                        {getResultIcon(action.result)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTimestamp(action.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === index && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    {action.error && (
                      <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded mb-2">
                        {action.error}
                      </div>
                    )}
                    
                    {action.data && Object.keys(action.data).length > 0 && (
                      <div className="text-xs text-gray-400">
                        <div className="font-medium mb-1">Details:</div>
                        <div className="bg-gray-900/50 p-2 rounded text-xs overflow-x-auto">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(action.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View More Link */}
        {recentActions.length > maxItems && (
          <div className="text-center pt-2 border-t border-gray-700 mt-2">
            <button className="text-xs text-blue-400 hover:text-blue-300">
              View All ({recentActions.length})
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentAuditTrailCompact;