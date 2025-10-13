/**
 * ViewportOptimizedLayout Component
 * Optimizes layout based on viewport size to ensure critical content is above fold
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useViewportOptimization } from '@/hooks/useViewportOptimization';
import { cn } from '@/lib/utils';

interface ViewportOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ViewportOptimizedLayout: React.FC<ViewportOptimizedLayoutProps> = ({
  children,
  className
}) => {
  const {
    viewport,
    zoneHeights,
    getCSSProperties,
    shouldCompress,
    getSpacing,
    isAboveFold,
    needsOptimization
  } = useViewportOptimization({
    headerHeight: 80, // AppLayout header height
    padding: 48 // Total padding (24px top + 24px bottom)
  });

  // Apply CSS custom properties to document root
  useEffect(() => {
    const root = document.documentElement;
    const properties = getCSSProperties();
    
    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });

    // Cleanup on unmount
    return () => {
      Object.keys(properties).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [getCSSProperties]);

  // Add viewport classes to body for CSS targeting
  useEffect(() => {
    const body = document.body;
    
    // Remove existing viewport classes
    body.classList.remove(
      'viewport-small', 
      'viewport-medium', 
      'viewport-large',
      'above-fold-optimized',
      'needs-optimization'
    );
    
    // Add current viewport class
    if (viewport.isSmallViewport) {
      body.classList.add('viewport-small');
    } else if (viewport.isMediumViewport) {
      body.classList.add('viewport-medium');
    } else {
      body.classList.add('viewport-large');
    }
    
    // Add optimization classes
    if (isAboveFold) {
      body.classList.add('above-fold-optimized');
    }
    
    if (needsOptimization) {
      body.classList.add('needs-optimization');
    }
    
    return () => {
      body.classList.remove(
        'viewport-small', 
        'viewport-medium', 
        'viewport-large',
        'above-fold-optimized',
        'needs-optimization'
      );
    };
  }, [viewport, isAboveFold, needsOptimization]);

  return (
    <motion.div
      className={cn(
        'viewport-optimized-layout',
        'space-y-6', // Default spacing
        className
      )}
      style={{
        '--zone-gap': `${getSpacing('md')}px`,
        '--hero-compress': shouldCompress('hero') ? '1' : '0',
        '--performance-compress': shouldCompress('performance') ? '1' : '0',
        '--controls-compress': shouldCompress('controls') ? '1' : '0'
      } as React.CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Viewport Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>Viewport: {viewport.width}×{viewport.height}</div>
          <div>Available: {zoneHeights.availableHeight}px</div>
          <div>Critical: {zoneHeights.criticalContentHeight}px</div>
          <div>Above fold: {isAboveFold ? '✅' : '❌'}</div>
        </div>
      )}
      
      {children}
    </motion.div>
  );
};

export default ViewportOptimizedLayout;