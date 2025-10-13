/**
 * ResponsiveControlGrid Component
 * Handles responsive transformations for the control grid across different breakpoints
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Clock, Brain } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import LayoutTransition from '@/components/ui/layout-transition';

interface ResponsiveControlGridProps {
  controlsContent: React.ReactNode;
  trailContent: React.ReactNode;
  insightsContent: React.ReactNode;
  className?: string;
}

const ResponsiveControlGrid: React.FC<ResponsiveControlGridProps> = ({
  controlsContent,
  trailContent,
  insightsContent,
  className
}) => {
  const { isMobile, isTablet, isTransitioning } = useResponsiveLayout();

  if (isMobile) {
    // Mobile: Tabs layout
    return (
      <LayoutTransition className={cn('zone-controls-tabs', className)}>
        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Controls</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls" className="mt-6">
            <ErrorBoundary>
              {controlsContent}
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <ErrorBoundary>
              {trailContent}
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <ErrorBoundary>
              {insightsContent}
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </LayoutTransition>
    );
  }

  if (isTablet) {
    // Tablet: 2-column layout with Controls full-width on top
    return (
      <LayoutTransition className={cn('space-y-6', className)}>
        {/* Controls - Full width on top */}
        <div className="zone-controls">
          <ErrorBoundary>
            {controlsContent}
          </ErrorBoundary>
        </div>
        
        {/* Trail and Insights - Side by side */}
        <div className="grid grid-cols-2 gap-6">
          <div className="zone-trail">
            <ErrorBoundary>
              {trailContent}
            </ErrorBoundary>
          </div>
          
          <div className="zone-insights">
            <ErrorBoundary>
              {insightsContent}
            </ErrorBoundary>
          </div>
        </div>
      </LayoutTransition>
    );
  }

  // Desktop: Asymmetric grid (2fr 1fr 1.5fr)
  return (
    <LayoutTransition className={cn('grid-asymmetric', className)}>
      <div className="zone-controls">
        <ErrorBoundary>
          {controlsContent}
        </ErrorBoundary>
      </div>
      
      <div className="zone-trail">
        <ErrorBoundary>
          {trailContent}
        </ErrorBoundary>
      </div>
      
      <div className="zone-insights">
        <ErrorBoundary>
          {insightsContent}
        </ErrorBoundary>
      </div>
    </LayoutTransition>
  );
};

export default ResponsiveControlGrid;