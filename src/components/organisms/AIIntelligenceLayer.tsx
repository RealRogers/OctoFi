/**
 * AIIntelligenceLayer Component
 * Conditional container for AI recommendations that only appears when recommendations exist
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  X,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Settings,
  BarChart3
} from 'lucide-react';
import { AIRecommendation, RecommendationPriority } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { cn } from '@/lib/utils';

interface AIIntelligenceLayerProps {
  recommendations: AIRecommendation[];
  onApplyRecommendation: (recommendation: AIRecommendation) => Promise<void>;
  onDismissRecommendation: (recommendationId: string) => void;
  onRefresh?: () => void;
  maxVisible?: number;
  className?: string;
}

const AIIntelligenceLayer: React.FC<AIIntelligenceLayerProps> = ({
  recommendations,
  onApplyRecommendation,
  onDismissRecommendation,
  onRefresh,
  maxVisible = 3,
  className
}) => {
  const [showAll, setShowAll] = useState(false);
  
  const {
    activeRecommendations,
    applyingIds,
    expandedId,
    isRefreshing,
    stats,
    handleApply,
    handleDismiss,
    handleRefresh,
    handleToggleExpand
  } = useAIRecommendations({
    recommendations,
    onApplyRecommendation,
    onDismissRecommendation,
    onRefresh
  });

  const visibleRecommendations = showAll 
    ? activeRecommendations 
    : activeRecommendations.slice(0, maxVisible);

  const hasMoreRecommendations = activeRecommendations.length > maxVisible;



  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'critical': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-blue-500';
    }
  };

  const getPriorityBadgeColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strategy': return <Settings className="w-4 h-4" />;
      case 'risk': return <Shield className="w-4 h-4" />;
      case 'opportunity': return <Target className="w-4 h-4" />;
      case 'optimization': return <BarChart3 className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'increase': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'decrease': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  // Don't render if no recommendations
  if (activeRecommendations.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
        animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn('zone-ai-layer', className)}
      >
        <Card className="glass-card-hover border-l-4 border-l-purple-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                AI Recommendations
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
                {stats.critical > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {stats.critical} Critical
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                {hasMoreRecommendations && !showAll && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(true)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    View All ({activeRecommendations.length})
                  </Button>
                )}
                
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-8 w-8 p-0 hover:bg-purple-500/20"
                  >
                    <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {visibleRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1] 
                    }}
                    className={cn(
                      "glass-card p-4 rounded-lg border-l-4 transition-all duration-200",
                      getPriorityColor(recommendation.priority),
                      "hover:bg-white/5"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 glass-card rounded-lg">
                          {getCategoryIcon(recommendation.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white text-sm">
                              {recommendation.title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={cn('text-xs', getPriorityBadgeColor(recommendation.priority))}
                            >
                              {recommendation.priority.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-2">
                            {recommendation.message}
                          </p>
                          
                          {/* Confidence and Impact */}
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Confidence:</span>
                              <Progress 
                                value={recommendation.confidence} 
                                className="h-1.5 w-16 bg-gray-800"
                              />
                              <span className="text-gray-300">
                                {recommendation.confidence}%
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">Impact:</span>
                              {getImpactIcon(recommendation.impact?.return || 'neutral')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-3">
                        {recommendation.action?.autoApplicable && (
                          <Button
                            size="sm"
                            onClick={() => handleApply(recommendation)}
                            disabled={applyingIds.has(recommendation.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3 transition-all duration-200"
                          >
                            {applyingIds.has(recommendation.id) ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Apply
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(recommendation.id)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        
                        {recommendation.rationale && recommendation.rationale.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleExpand(recommendation.id)}
                            className="h-8 w-8 p-0 transition-all duration-200"
                          >
                            {expandedId === recommendation.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedId === recommendation.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pt-3 border-t border-gray-700"
                        >
                          <div className="space-y-2">
                            {recommendation.rationale && (
                              <div>
                                <span className="text-xs font-medium text-gray-400">Rationale:</span>
                                <ul className="mt-1 space-y-1">
                                  {recommendation.rationale.map((reason, index) => (
                                    <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                                      <span className="text-purple-400 mt-1">•</span>
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {!recommendation.action?.autoApplicable && (
                              <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                                <AlertTriangle className="w-3 h-3" />
                                Manual review required - cannot be auto-applied
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Show Less Button */}
              {showAll && hasMoreRecommendations && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center pt-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Show Less
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIIntelligenceLayer;