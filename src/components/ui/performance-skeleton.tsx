import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PerformanceSkeletonProps {
  className?: string;
}

export const PerformanceSkeleton: React.FC<PerformanceSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('zone-performance', className)}>
      <Card className="glass-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-40 h-6" />
            </div>
            
            {/* Timeframe Selector Skeleton */}
            <div className="flex gap-1 glass-card rounded-lg p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-12 h-8 rounded" />
              ))}
            </div>
          </div>

          {/* Summary Metrics Skeleton */}
          <div className="flex items-center gap-6 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <div>
                  <Skeleton className="w-16 h-3 mb-1" />
                  <Skeleton className="w-20 h-5" />
                </div>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Content: 70/30 Split Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-80">
            {/* Chart Section Skeleton - 70% */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-lg p-4 h-full">
                {/* Chart Type Toggle Skeleton */}
                <div className="flex gap-2 mb-4">
                  <Skeleton className="w-20 h-7 rounded" />
                  <Skeleton className="w-16 h-7 rounded" />
                </div>

                {/* Chart Area Skeleton */}
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton 
                        key={i} 
                        className="w-8 rounded-t" 
                        style={{ height: `${Math.random() * 150 + 50}px` }}
                      />
                    ))}
                  </div>
                  
                  {/* Axes Skeleton */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700" />
                  <div className="absolute bottom-0 left-0 top-0 w-px bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Asset Allocation Section Skeleton - 30% */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-lg p-4 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-24 h-4" />
                </div>
                
                <div className="space-y-4">
                  {/* Donut Chart Skeleton */}
                  <div className="h-32 flex items-center justify-center">
                    <div className="relative">
                      <Skeleton className="w-24 h-24 rounded-full" />
                      <div className="absolute inset-6 bg-gray-800 rounded-full" />
                    </div>
                  </div>

                  {/* Asset List Skeleton */}
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-3 h-3 rounded-full" />
                          <Skeleton className="w-12 h-4" />
                        </div>
                        <Skeleton className="w-8 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSkeleton;