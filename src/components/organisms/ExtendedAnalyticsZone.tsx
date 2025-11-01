/**
 * ExtendedAnalyticsZone Component
 * Lazy-loaded Zone 5 with performance comparison and historical metrics
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PerformanceMetrics } from '@/services/types';
import PerformanceComparisonBars from '@/components/molecules/PerformanceComparisonBars';
import HistoricalMetricsGrid from '@/components/molecules/HistoricalMetricsGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { useLazyLoad } from '@/hooks/useLazyLoad';
import { cn } from '@/lib/utils';

interface ExtendedAnalyticsZoneProps {
  performance: PerformanceMetrics;
  className?: string;
  lazyLoad?: boolean;
}

const ExtendedAnalyticsZone: React.FC<ExtendedAnalyticsZoneProps> = ({
  performance,
  className,
  lazyLoad = true
}) => {
  const { elementRef, isVisible, isLoaded, isLoading } = useLazyLoad({
    enabled: lazyLoad,
    rootMargin: '150px',
    threshold: 0.1,
    loadDelay: 300
  });

  // Skeleton component for loading state
  const AnalyticsSkeleton = () => (
    <div className="space-y-8">
      {/* Performance Comparison Skeleton */}
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-40 h-6" />
          </div>
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="w-32 h-4" />
          
          {/* Metric bars skeleton */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4">
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="w-20 h-3" />
                    <div className="flex-1 mx-4">
                      <Skeleton className="w-full h-2 rounded-full" />
                    </div>
                    <Skeleton className="w-12 h-3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Metrics Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-32 h-6" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="w-8 h-4" />
                </div>
                <Skeleton className="w-16 h-8" />
                <div className="space-y-1">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-full h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-1">
                <Skeleton className="w-16 h-3 mx-auto" />
                <Skeleton className="w-12 h-6 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn('zone-analytics min-h-[400px]', className)}
    >
      <AnimatePresence mode="wait">
        {!isVisible ? (
          // Placeholder to maintain layout
          <div className="min-h-[400px]" />
        ) : isLoading || !isLoaded ? (
          // Loading skeleton
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyticsSkeleton />
          </motion.div>
        ) : (
          // Actual content
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.1, 0.25, 1],
              staggerChildren: 0.1
            }}
            className="space-y-8"
          >
            {/* Performance Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PerformanceComparisonBars 
                performance={performance}
                showBenchmarks={true}
              />
            </motion.div>

            {/* Historical Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HistoricalMetricsGrid performance={performance} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExtendedAnalyticsZone;