/**
 * Spacing Utility Components
 * Consistent spacing components based on 8px grid system
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  direction?: 'vertical' | 'horizontal' | 'both';
  className?: string;
}

interface StackProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

interface ContainerProps {
  children: React.ReactNode;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Spacing size mappings (8px grid)
const spacingSizes = {
  xs: '8px',    // 1 * 8px
  sm: '16px',   // 2 * 8px
  md: '24px',   // 3 * 8px
  lg: '32px',   // 4 * 8px
  xl: '40px',   // 5 * 8px
  '2xl': '48px' // 6 * 8px
};

const spacingClasses = {
  xs: 'gap-2',    // 8px
  sm: 'gap-4',    // 16px
  md: 'gap-6',    // 24px
  lg: 'gap-8',    // 32px
  xl: 'gap-10',   // 40px
  '2xl': 'gap-12' // 48px
};

const paddingClasses = {
  none: 'p-0',
  xs: 'p-2',    // 8px
  sm: 'p-4',    // 16px
  md: 'p-6',    // 24px
  lg: 'p-8',    // 32px
  xl: 'p-10'    // 40px
};

const marginClasses = {
  none: 'm-0',
  xs: 'm-2',    // 8px
  sm: 'm-4',    // 16px
  md: 'm-6',    // 24px
  lg: 'm-8',    // 32px
  xl: 'm-10'    // 40px
};

/**
 * Spacer component for adding consistent spacing
 */
export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  className
}) => {
  const spacingValue = spacingSizes[size];
  
  const style: React.CSSProperties = {
    width: direction === 'horizontal' || direction === 'both' ? spacingValue : undefined,
    height: direction === 'vertical' || direction === 'both' ? spacingValue : undefined,
    minWidth: direction === 'horizontal' || direction === 'both' ? spacingValue : undefined,
    minHeight: direction === 'vertical' || direction === 'both' ? spacingValue : undefined,
  };

  return <div className={cn('flex-shrink-0', className)} style={style} />;
};

/**
 * Stack component for consistent spacing between children
 */
export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'md',
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  className
}) => {
  const flexDirection = direction === 'vertical' ? 'flex-col' : 'flex-row';
  const gapClass = spacingClasses[spacing];
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div className={cn(
      'flex',
      flexDirection,
      gapClass,
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Container component with consistent padding and margin
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'md',
  margin = 'none',
  className
}) => {
  return (
    <div className={cn(
      paddingClasses[padding],
      marginClasses[margin],
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Zone wrapper with consistent spacing
 */
export const Zone: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('content-spacing', className)}>
      {children}
    </div>
  );
};

/**
 * Section wrapper with consistent margins
 */
export const Section: React.FC<{
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}> = ({ children, spacing = 'normal', className }) => {
  const spacingClasses = {
    tight: 'content-spacing-tight',
    normal: 'content-spacing',
    loose: 'content-spacing-loose'
  };

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  );
};