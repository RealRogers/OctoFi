/**
 * Content Overflow Handling Components
 * Components to handle text truncation, scrollable content, and empty states
 */

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Text Truncation with Tooltip
interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 50,
  className,
  showTooltip = true
}) => {
  const isTruncated = text.length > maxLength;
  const truncatedText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  if (!isTruncated || !showTooltip) {
    return <span className={className}>{truncatedText}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('cursor-help', className)}>
            {truncatedText}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs whitespace-pre-wrap">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Scrollable Container with Custom Scrollbar
interface ScrollableContainerProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  showScrollIndicator?: boolean;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  maxHeight = '400px',
  className,
  showScrollIndicator = true
}) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollable = () => {
      const scrollable = container.scrollHeight > container.clientHeight;
      setIsScrollable(scrollable);
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      setIsScrolledToBottom(isAtBottom);
    };

    checkScrollable();
    container.addEventListener('scroll', handleScroll);
    
    // Re-check on content changes
    const observer = new MutationObserver(checkScrollable);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          'overflow-y-auto overflow-x-hidden',
          'scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600',
          'hover:scrollbar-thumb-gray-500',
          className
        )}
        style={{ maxHeight }}
      >
        {children}
      </div>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && isScrollable && !isScrolledToBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none flex items-end justify-center pb-1">
          <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
        </div>
      )}
    </div>
  );
};

// Expandable Content
interface ExpandableContentProps {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
  expandText?: string;
  collapseText?: string;
}

export const ExpandableContent: React.FC<ExpandableContentProps> = ({
  children,
  maxHeight = 200,
  className,
  expandText = 'Show more',
  collapseText = 'Show less'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const checkHeight = () => {
      const contentHeight = content.scrollHeight;
      setNeedsExpansion(contentHeight > maxHeight);
    };

    checkHeight();
    
    // Re-check on content changes
    const observer = new MutationObserver(checkHeight);
    observer.observe(content, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [maxHeight]);

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className={cn(
          'overflow-hidden transition-all duration-300',
          !isExpanded && needsExpansion && 'relative'
        )}
        style={{
          maxHeight: isExpanded || !needsExpansion ? 'none' : `${maxHeight}px`
        }}
      >
        {children}
        
        {/* Fade overlay when collapsed */}
        {!isExpanded && needsExpansion && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>
      
      {needsExpansion && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-gray-400 hover:text-white"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              {collapseText}
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              {expandText}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      className
    )}>
      {Icon && (
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse rounded-full" />
          <Icon className="relative w-16 h-16 text-blue-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Content Overflow Menu
interface OverflowMenuProps {
  items: Array<{
    id: string;
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
  }>;
  maxVisible?: number;
  className?: string;
}

export const OverflowMenu: React.FC<OverflowMenuProps> = ({
  items,
  maxVisible = 3,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const visibleItems = items.slice(0, maxVisible);
  const hiddenItems = items.slice(maxVisible);

  if (items.length <= maxVisible) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="text-xs"
            >
              {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
              {item.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {visibleItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={item.onClick}
            className="text-xs"
          >
            {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
            {item.label}
          </Button>
        );
      })}
      
      {hiddenItems.length > 0 && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
          
          {isOpen && (
            <div className="absolute top-full right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-32">
              {hiddenItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {IconComponent && <IconComponent className="w-3 h-3" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};