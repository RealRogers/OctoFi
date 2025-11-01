/**
 * LayoutTransition Component
 * Provides smooth transitions between responsive layout changes
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface LayoutTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutTransition: React.FC<LayoutTransitionProps> = ({ 
  children, 
  className 
}) => {
  const { layoutMode, isTransitioning } = useResponsiveLayout();
  const [prevLayoutMode, setPrevLayoutMode] = useState(layoutMode);

  useEffect(() => {
    if (!isTransitioning) {
      setPrevLayoutMode(layoutMode);
    }
  }, [layoutMode, isTransitioning]);

  return (
    <div className={cn(
      'relative',
      isTransitioning && 'layout-transitioning',
      className
    )}>
      <AnimatePresence mode="wait">
        <motion.div
          key={layoutMode}
          initial={prevLayoutMode !== layoutMode ? { opacity: 0.8 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LayoutTransition;