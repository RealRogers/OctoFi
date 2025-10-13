/**
 * Accessible Components
 * Pre-built components with proper ARIA labels and semantic HTML
 */

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Accessible Dashboard Section
interface AccessibleSectionProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  id?: string;
}

export const AccessibleSection = forwardRef<HTMLElement, AccessibleSectionProps>(
  ({ children, title, description, level = 2, className, id }, ref) => {
    const sectionId = useId();
    const titleId = useId();
    const descriptionId = useId();
    
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <section
        ref={ref}
        id={id || sectionId}
        className={className}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <HeadingTag
          id={titleId}
          className="sr-only"
        >
          {title}
        </HeadingTag>
        
        {description && (
          <p id={descriptionId} className="sr-only">
            {description}
          </p>
        )}
        
        {children}
      </section>
    );
  }
);

AccessibleSection.displayName = 'AccessibleSection';

// Accessible Status Indicator
interface AccessibleStatusProps {
  status: 'active' | 'inactive' | 'error' | 'loading';
  label: string;
  description?: string;
  className?: string;
}

export const AccessibleStatus: React.FC<AccessibleStatusProps> = ({
  status,
  label,
  description,
  className
}) => {
  const statusId = useId();
  const descriptionId = useId();
  
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'inactive': return 'bg-gray-400';
      case 'error': return 'bg-red-400';
      case 'loading': return 'bg-yellow-400 animate-pulse';
    }
  };
  
  const getAriaLabel = () => {
    return `${label}: ${status}${description ? `. ${description}` : ''}`;
  };
  
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="status"
      aria-labelledby={statusId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div
        className={cn('w-3 h-3 rounded-full', getStatusColor())}
        aria-hidden="true"
      />
      
      <span id={statusId} className="sr-only">
        {getAriaLabel()}
      </span>
      
      <span aria-hidden="true">{label}</span>
      
      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}
    </div>
  );
};

// Accessible Metric Display
interface AccessibleMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

export const AccessibleMetric: React.FC<AccessibleMetricProps> = ({
  label,
  value,
  unit,
  trend,
  description,
  className
}) => {
  const metricId = useId();
  const descriptionId = useId();
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return null;
    }
  };
  
  const getTrendLabel = () => {
    switch (trend) {
      case 'up': return 'increasing';
      case 'down': return 'decreasing';
      default: return 'stable';
    }
  };
  
  const getFullLabel = () => {
    const trendText = trend ? `, ${getTrendLabel()}` : '';
    const unitText = unit ? ` ${unit}` : '';
    return `${label}: ${value}${unitText}${trendText}`;
  };
  
  return (
    <div
      className={className}
      role="img"
      aria-labelledby={metricId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div className="text-sm text-gray-400 mb-1">
        {label}
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm ml-1">{unit}</span>}
        </span>
        
        {trend && (
          <span
            className={cn(
              'text-sm',
              trend === 'up' ? 'text-green-400' : 
              trend === 'down' ? 'text-red-400' : 'text-gray-400'
            )}
            aria-hidden="true"
          >
            {getTrendIcon()}
          </span>
        )}
      </div>
      
      <span id={metricId} className="sr-only">
        {getFullLabel()}
      </span>
      
      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}
    </div>
  );
};

// Accessible Action Button
interface AccessibleActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  description?: string;
  shortcut?: string;
  className?: string;
}

export const AccessibleActionButton = forwardRef<HTMLButtonElement, AccessibleActionButtonProps>(
  ({ children, onClick, disabled, loading, description, shortcut, className }, ref) => {
    const buttonId = useId();
    const descriptionId = useId();
    
    const getAriaLabel = () => {
      let label = children?.toString() || '';
      if (loading) label += ', loading';
      if (disabled) label += ', disabled';
      if (shortcut) label += `, keyboard shortcut ${shortcut}`;
      return label;
    };
    
    return (
      <Button
        ref={ref}
        onClick={onClick}
        disabled={disabled || loading}
        className={className}
        aria-labelledby={buttonId}
        aria-describedby={description ? descriptionId : undefined}
        aria-keyshortcuts={shortcut}
      >
        <span id={buttonId} className="sr-only">
          {getAriaLabel()}
        </span>
        
        <span aria-hidden="true">
          {children}
        </span>
        
        {description && (
          <span id={descriptionId} className="sr-only">
            {description}
          </span>
        )}
      </Button>
    );
  }
);

AccessibleActionButton.displayName = 'AccessibleActionButton';

// Accessible Progress Indicator
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  description?: string;
  className?: string;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  max = 100,
  label,
  description,
  className
}) => {
  const progressId = useId();
  const descriptionId = useId();
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={progressId} className="text-sm text-gray-400">
          {label}
        </label>
        <span className="text-sm text-gray-300" aria-hidden="true">
          {percentage}%
        </span>
      </div>
      
      <div
        role="progressbar"
        id={progressId}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${percentage} percent`}
        aria-describedby={description ? descriptionId : undefined}
        className="w-full bg-gray-800 rounded-full h-2"
      >
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
      
      {description && (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      )}
    </div>
  );
};

// Accessible Data Table
interface AccessibleTableProps {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
  className?: string;
}

export const AccessibleTable: React.FC<AccessibleTableProps> = ({
  caption,
  headers,
  rows,
  className
}) => {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm" role="table">
        <caption className="sr-only">
          {caption}
        </caption>
        
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="text-left p-2 text-gray-400 font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-700">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="p-2 text-gray-300"
                  {...(cellIndex === 0 ? { scope: 'row' } : {})}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Accessible Alert/Notification
interface AccessibleAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const AccessibleAlert: React.FC<AccessibleAlertProps> = ({
  type,
  title,
  message,
  onDismiss,
  className
}) => {
  const alertId = useId();
  const titleId = useId();
  
  const getRole = () => {
    return type === 'error' || type === 'warning' ? 'alert' : 'status';
  };
  
  const getAriaLive = () => {
    return type === 'error' || type === 'warning' ? 'assertive' : 'polite';
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };
  
  return (
    <div
      id={alertId}
      role={getRole()}
      aria-live={getAriaLive()}
      aria-labelledby={titleId}
      className={cn(
        'p-4 rounded-lg border',
        getTypeColor(),
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 id={titleId} className="font-medium text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-300">
            {message}
          </p>
        </div>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            aria-label={`Dismiss ${type} alert: ${title}`}
            className="ml-4"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
};

// Accessible Loading State
interface AccessibleLoadingProps {
  label?: string;
  description?: string;
  className?: string;
}

export const AccessibleLoading: React.FC<AccessibleLoadingProps> = ({
  label = 'Loading',
  description,
  className
}) => {
  const loadingId = useId();
  const descriptionId = useId();
  
  return (
    <div
      className={cn('flex items-center justify-center p-8', className)}
      role="status"
      aria-labelledby={loadingId}
      aria-describedby={description ? descriptionId : undefined}
      aria-live="polite"
    >
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        aria-hidden="true"
      />
      
      <span id={loadingId} className="ml-3 text-gray-400">
        {label}
      </span>
      
      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}
    </div>
  );
};