import { useState, useCallback, useEffect } from 'react';
import { AIRecommendation } from '@/services/types';
import { useToast } from '@/components/ui/use-toast';

interface UseAIRecommendationsProps {
  recommendations: AIRecommendation[];
  onApplyRecommendation: (recommendation: AIRecommendation) => Promise<void>;
  onDismissRecommendation: (recommendationId: string) => void;
  onRefresh?: () => void;
}

export const useAIRecommendations = ({
  recommendations,
  onApplyRecommendation,
  onDismissRecommendation,
  onRefresh
}: UseAIRecommendationsProps) => {
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Filter active recommendations
  const activeRecommendations = recommendations
    .filter(rec => rec.status === 'pending')
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  // Handle applying a recommendation
  const handleApply = useCallback(async (recommendation: AIRecommendation) => {
    if (!recommendation.action?.autoApplicable) {
      toast({
        title: "Manual Action Required",
        description: "This recommendation requires manual review and cannot be auto-applied",
        variant: "default",
      });
      return;
    }

    setApplyingIds(prev => new Set(prev).add(recommendation.id));

    try {
      await onApplyRecommendation(recommendation);
      
      // Success toast with recommendation-specific message
      const successMessage = getSuccessMessage(recommendation);
      toast({
        title: "✅ Applied Successfully",
        description: successMessage,
        variant: "default",
      });

      // Auto-collapse if expanded
      if (expandedId === recommendation.id) {
        setExpandedId(null);
      }
    } catch (error) {
      toast({
        title: "❌ Application Failed",
        description: error instanceof Error ? error.message : 'Failed to apply recommendation',
        variant: "destructive",
      });
    } finally {
      setApplyingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recommendation.id);
        return newSet;
      });
    }
  }, [onApplyRecommendation, toast, expandedId]);

  // Handle dismissing a recommendation
  const handleDismiss = useCallback((recommendationId: string) => {
    onDismissRecommendation(recommendationId);
    
    // Auto-collapse if expanded
    if (expandedId === recommendationId) {
      setExpandedId(null);
    }

    toast({
      title: "Recommendation Dismissed",
      description: "The recommendation has been dismissed",
      variant: "default",
    });
  }, [onDismissRecommendation, toast, expandedId]);

  // Handle refreshing recommendations
  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
      toast({
        title: "🔄 Recommendations Updated",
        description: "AI recommendations have been refreshed",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Refresh Failed",
        description: "Failed to refresh recommendations",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, toast]);

  // Handle expanding/collapsing recommendation details
  const handleToggleExpand = useCallback((recommendationId: string) => {
    setExpandedId(prev => prev === recommendationId ? null : recommendationId);
  }, []);

  // Get success message based on recommendation type
  const getSuccessMessage = (recommendation: AIRecommendation) => {
    switch (recommendation.category) {
      case 'strategy':
        return `Strategy updated: ${recommendation.title}`;
      case 'risk':
        return `Risk settings adjusted: ${recommendation.title}`;
      case 'opportunity':
        return `Opportunity captured: ${recommendation.title}`;
      case 'optimization':
        return `Portfolio optimized: ${recommendation.title}`;
      default:
        return recommendation.title;
    }
  };

  // Auto-refresh recommendations periodically
  useEffect(() => {
    if (!onRefresh) return;

    const interval = setInterval(() => {
      // Only auto-refresh if not currently applying any recommendations
      if (applyingIds.size === 0 && !isRefreshing) {
        onRefresh();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [onRefresh, applyingIds.size, isRefreshing]);

  // Get recommendation statistics
  const stats = {
    total: activeRecommendations.length,
    critical: activeRecommendations.filter(r => r.priority === 'critical').length,
    high: activeRecommendations.filter(r => r.priority === 'high').length,
    autoApplicable: activeRecommendations.filter(r => r.action?.autoApplicable).length,
  };

  return {
    activeRecommendations,
    applyingIds,
    expandedId,
    isRefreshing,
    stats,
    handleApply,
    handleDismiss,
    handleRefresh,
    handleToggleExpand,
  };
};