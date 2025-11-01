import { useState, useEffect, useCallback, useMemo } from 'react';

interface ViewportInfo {
  width: number;
  height: number;
  availableHeight: number; // Height minus header/nav
  isSmallViewport: boolean;
  isMediumViewport: boolean;
  isLargeViewport: boolean;
}

interface UseViewportOptimizationOptions {
  headerHeight?: number;
  footerHeight?: number;
  padding?: number;
}

export const useViewportOptimization = (options: UseViewportOptimizationOptions = {}) => {
  const { headerHeight = 80, footerHeight = 0, padding = 48 } = options;
  
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    availableHeight: typeof window !== 'undefined' ? window.innerHeight - headerHeight - footerHeight - padding : 1000,
    isSmallViewport: false,
    isMediumViewport: false,
    isLargeViewport: true
  });

  // Update viewport info
  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const availableHeight = height - headerHeight - footerHeight - padding;
    
    setViewport({
      width,
      height,
      availableHeight,
      isSmallViewport: height < 800, // Small laptops, tablets landscape
      isMediumViewport: height >= 800 && height < 1080, // Standard laptops
      isLargeViewport: height >= 1080 // Desktop monitors
    });
  }, [headerHeight, footerHeight, padding]);

  // Listen for viewport changes
  useEffect(() => {
    updateViewport();
    
    const handleResize = () => {
      updateViewport();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateViewport]);

  // Calculate optimal heights for different zones
  const zoneHeights = useMemo(() => {
    const { availableHeight, isSmallViewport, isMediumViewport } = viewport;
    
    // Base heights for different viewport sizes
    const heroHeight = 120; // Fixed
    const performanceHeight = isSmallViewport ? 300 : isMediumViewport ? 400 : 450;
    const aiLayerHeight = 0; // Dynamic based on content
    const controlGridHeight = isSmallViewport ? 350 : isMediumViewport ? 400 : 500;
    
    // Calculate if everything fits above fold
    const criticalContentHeight = heroHeight + performanceHeight + 48; // 48px for gaps
    const fitsAboveFold = criticalContentHeight <= availableHeight;
    
    // Adjust heights if needed
    const optimizedPerformanceHeight = fitsAboveFold 
      ? performanceHeight 
      : Math.max(250, availableHeight - heroHeight - 48);
    
    return {
      hero: heroHeight,
      performance: optimizedPerformanceHeight,
      aiLayer: aiLayerHeight,
      controlGrid: controlGridHeight,
      fitsAboveFold,
      criticalContentHeight,
      availableHeight
    };
  }, [viewport]);

  // Get CSS custom properties for zones
  const getCSSProperties = useCallback(() => {
    return {
      '--hero-height': `${zoneHeights.hero}px`,
      '--performance-height': `${zoneHeights.performance}px`,
      '--control-grid-height': `${zoneHeights.controlGrid}px`,
      '--available-height': `${zoneHeights.availableHeight}px`,
      '--critical-height': `${zoneHeights.criticalContentHeight}px`
    } as React.CSSProperties;
  }, [zoneHeights]);

  // Check if specific content should be compressed
  const shouldCompress = useCallback((zone: 'hero' | 'performance' | 'controls') => {
    if (viewport.isLargeViewport) return false;
    
    switch (zone) {
      case 'hero':
        return viewport.isSmallViewport;
      case 'performance':
        return !zoneHeights.fitsAboveFold;
      case 'controls':
        return viewport.isSmallViewport;
      default:
        return false;
    }
  }, [viewport, zoneHeights]);

  // Get responsive spacing
  const getSpacing = useCallback((size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    const { isSmallViewport, isMediumViewport } = viewport;
    
    const spacingMap = {
      xs: isSmallViewport ? 8 : 12,
      sm: isSmallViewport ? 12 : 16,
      md: isSmallViewport ? 16 : 24,
      lg: isSmallViewport ? 20 : isMediumViewport ? 28 : 32,
      xl: isSmallViewport ? 24 : isMediumViewport ? 32 : 40
    };
    
    return spacingMap[size];
  }, [viewport]);

  // Scroll to zone utility
  const scrollToZone = useCallback((zoneId: string, offset = 0) => {
    const element = document.getElementById(zoneId);
    if (element) {
      const elementTop = element.offsetTop - headerHeight - offset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  }, [headerHeight]);

  return {
    viewport,
    zoneHeights,
    getCSSProperties,
    shouldCompress,
    getSpacing,
    scrollToZone,
    
    // Convenience flags
    isAboveFold: zoneHeights.fitsAboveFold,
    needsOptimization: !zoneHeights.fitsAboveFold,
    
    // Common viewport queries
    isMobile: viewport.width < 768,
    isTablet: viewport.width >= 768 && viewport.width < 1280,
    isDesktop: viewport.width >= 1280
  };
};