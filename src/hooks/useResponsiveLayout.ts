import { useState, useEffect, useCallback } from 'react';
import { designTokens } from '@/lib/designTokens';

type LayoutMode = 'mobile' | 'tablet' | 'desktop';

interface UseResponsiveLayoutReturn {
  layoutMode: LayoutMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTransitioning: boolean;
  dimensions: {
    width: number;
    height: number;
  };
}

export const useResponsiveLayout = (): UseResponsiveLayoutReturn => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('desktop');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  const getLayoutMode = useCallback((width: number): LayoutMode => {
    if (width < designTokens.breakpoints.mobile) {
      return 'mobile';
    } else if (width < designTokens.breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }, []);

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    const newLayoutMode = getLayoutMode(newWidth);

    setDimensions({ width: newWidth, height: newHeight });

    // Only trigger transition if layout mode actually changes
    if (newLayoutMode !== layoutMode) {
      setIsTransitioning(true);
      
      // Use a timeout to smooth the transition
      setTimeout(() => {
        setLayoutMode(newLayoutMode);
        
        // End transition after layout has settled
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300); // Match CSS transition duration
      }, 50);
    }
  }, [layoutMode, getLayoutMode]);

  useEffect(() => {
    // Set initial layout mode
    const initialMode = getLayoutMode(dimensions.width);
    setLayoutMode(initialMode);

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize, dimensions.width, getLayoutMode]);

  return {
    layoutMode,
    isMobile: layoutMode === 'mobile',
    isTablet: layoutMode === 'tablet',
    isDesktop: layoutMode === 'desktop',
    isTransitioning,
    dimensions,
  };
};