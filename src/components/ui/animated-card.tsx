import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useReducedMotion, getAnimationConfig, usePerformanceMonitor } from "@/utils/performance";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: React.ReactNode;
  className?: string;
  enableAnimation?: boolean;
  lazyLoad?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, delay = 0, className, enableAnimation = true, lazyLoad = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const { fps } = usePerformanceMonitor();
    const [shouldAnimate, setShouldAnimate] = React.useState(!lazyLoad);
    const elementRef = React.useRef<HTMLDivElement>(null);

    // Get performance-aware animation config
    const animConfig = React.useMemo(() => 
      getAnimationConfig(prefersReducedMotion, fps), 
      [prefersReducedMotion, fps]
    );

    // Intersection observer for lazy loading
    React.useEffect(() => {
      if (!lazyLoad || shouldAnimate) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, [lazyLoad, shouldAnimate]);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLDivElement) => {
      elementRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    // Determine if animations should be enabled
    const animationsEnabled = enableAnimation && animConfig.enabled && shouldAnimate;

    if (!animationsEnabled) {
      return (
        <div
          ref={combinedRef}
          className={cn("", className)}
          {...props}
        >
          <Card className="glass-card-hover">
            {children}
          </Card>
        </div>
      );
    }

    return (
      <motion.div
        ref={combinedRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: animConfig.duration, 
          delay: delay * (animConfig.reduced ? 0.5 : 1), 
          ease: animConfig.ease
        }}
        className={cn("", className)}
        {...props}
      >
        <Card className="glass-card-hover">
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };