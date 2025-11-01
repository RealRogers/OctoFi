import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatusCardsSkeletonProps {
  className?: string;
}

const StatusCardsSkeleton: React.FC<StatusCardsSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4", className)}>
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="glass-card">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface PerformanceChartSkeletonProps {
  className?: string;
}

const PerformanceChartSkeleton: React.FC<PerformanceChartSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-12" />
            ))}
          </div>
        </div>
        
        {/* Summary Metrics Skeleton */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Chart Type Selector Skeleton */}
        <div className="flex gap-2 border-b border-gray-700 pb-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        
        {/* Chart Area Skeleton */}
        <div className="h-64 flex items-end justify-between px-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-4" 
              style={{ height: `${Math.random() * 200 + 50}px` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ComponentSkeletonProps {
  className?: string;
  title?: string;
}

const ComponentSkeleton: React.FC<ComponentSkeletonProps> = ({ className, title }) => {
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface GridSkeletonProps {
  className?: string;
  columns?: number;
  rows?: number;
}

const GridSkeleton: React.FC<GridSkeletonProps> = ({ 
  className, 
  columns = 3, 
  rows = 2 
}) => {
  return (
    <div className={cn(`grid grid-cols-1 xl:grid-cols-${columns} gap-6`, className)}>
      {[...Array(columns * rows)].map((_, i) => (
        <ComponentSkeleton key={i} />
      ))}
    </div>
  );
};

export { 
  StatusCardsSkeleton, 
  PerformanceChartSkeleton, 
  ComponentSkeleton, 
  GridSkeleton 
};