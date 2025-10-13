/**
 * AsymmetricControlGrid Component
 * Grid layout with 2:1:1.5 proportions for Controls, Trail, and Insights
 */

import React from 'react';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/components/ErrorBoundary';

interface AsymmetricControlGridProps {
  children: React.ReactNode;
  className?: string;
}

interface GridColumnProps {
  children: React.ReactNode;
  span: 'controls' | 'trail' | 'insights';
  className?: string;
}

const GridColumn: React.FC<GridColumnProps> = ({ children, span, className }) => {
  const getColumnClass = () => {
    switch (span) {
      case 'controls':
        return 'zone-controls';
      case 'trail':
        return 'zone-trail';
      case 'insights':
        return 'zone-insights';
      default:
        return '';
    }
  };

  return (
    <div className={cn(getColumnClass(), className)}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  );
};

const AsymmetricControlGrid: React.FC<AsymmetricControlGridProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('grid-asymmetric', className)}>
      {children}
    </div>
  );
};

// Export both components
export { AsymmetricControlGrid, GridColumn };
export default AsymmetricControlGrid;