/**
 * ScrollReveal Component
 * Wrapper component that animates children when they come into view
 */

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimations';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'custom';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  customVariants?: Variants;
  disabled?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  customVariants,
  disabled = false
}) => {
  const controls = useAnimation();
  const elementId = useRef(`scroll-reveal-${Math.random().toString(36).substr(2, 9)}`);
  
  const { elementRef, isVisible } = useScrollAnimation(elementId.current, {
    threshold,
    triggerOnce,
    disabled
  });

  // Animation variants
  const variants: Record<string, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    custom: customVariants || {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  };

  // Trigger animation when element becomes visible
  useEffect(() => {
    if (disabled) return;

    if (isVisible) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isVisible, controls, triggerOnce, disabled]);

  // Skip animation if disabled
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={elementRef}
      className={cn('scroll-reveal', className)}
      variants={variants[animation]}
      initial="hidden"
      animate={controls}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

// Convenience components for common animations
export const FadeInOnScroll: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="fadeIn" {...props} />
);

export const SlideUpOnScroll: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="slideUp" {...props} />
);

export const SlideDownOnScroll: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="slideDown" {...props} />
);

export const ScaleOnScroll: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="scale" {...props} />
);

export default ScrollReveal;