/**
 * ScrollProgress Component
 * Visual indicator of scroll progress through the page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  thickness?: number;
  color?: string;
  showPercentage?: boolean;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className,
  position = 'top',
  thickness = 3,
  color = 'bg-blue-500',
  showPercentage = false
}) => {
  const { scrollProgress } = useScrollAnimations();

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50';
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50';
      case 'left':
        return 'fixed top-0 left-0 bottom-0 z-50';
      case 'right':
        return 'fixed top-0 right-0 bottom-0 z-50';
      default:
        return 'fixed top-0 left-0 right-0 z-50';
    }
  };

  const getProgressStyle = () => {
    const progress = scrollProgress.scrollProgress * 100;
    
    if (position === 'left' || position === 'right') {
      return {
        height: `${progress}%`,
        width: `${thickness}px`
      };
    } else {
      return {
        width: `${progress}%`,
        height: `${thickness}px`
      };
    }
  };

  return (
    <>
      {/* Progress Bar Container */}
      <div className={cn(getPositionClasses(), className)}>
        <div className={cn(
          'bg-gray-800/20 backdrop-blur-sm',
          position === 'left' || position === 'right' ? 'h-full' : 'w-full'
        )} style={{
          [position === 'left' || position === 'right' ? 'width' : 'height']: `${thickness}px`
        }}>
          {/* Progress Fill */}
          <motion.div
            className={cn(color, 'origin-left')}
            style={getProgressStyle()}
            initial={{ 
              [position === 'left' || position === 'right' ? 'height' : 'width']: '0%' 
            }}
            animate={{ 
              [position === 'left' || position === 'right' ? 'height' : 'width']: `${scrollProgress.scrollProgress * 100}%` 
            }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Percentage Indicator */}
      {showPercentage && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: scrollProgress.isScrolling ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(scrollProgress.scrollProgress * 100)}%
        </motion.div>
      )}
    </>
  );
};

export default ScrollProgress;