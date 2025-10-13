import { useState, useEffect, useRef, useCallback } from 'react';

interface UseContentOverflowOptions {
  threshold?: number;
  axis?: 'x' | 'y' | 'both';
}

export const useContentOverflow = (options: UseContentOverflowOptions = {}) => {
  const { threshold = 0, axis = 'y' } = options;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowDirection, setOverflowDirection] = useState<{
    x: boolean;
    y: boolean;
  }>({ x: false, y: false });
  const elementRef = useRef<HTMLElement>(null);

  const checkOverflow = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = element;
    
    const overflowX = scrollWidth > clientWidth + threshold;
    const overflowY = scrollHeight > clientHeight + threshold;
    
    setOverflowDirection({ x: overflowX, y: overflowY });
    
    switch (axis) {
      case 'x':
        setIsOverflowing(overflowX);
        break;
      case 'y':
        setIsOverflowing(overflowY);
        break;
      case 'both':
        setIsOverflowing(overflowX || overflowY);
        break;
    }
  }, [threshold, axis]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Initial check
    checkOverflow();

    // Set up ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    // Set up MutationObserver to watch for content changes
    const mutationObserver = new MutationObserver(checkOverflow);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [checkOverflow]);

  return {
    elementRef,
    isOverflowing,
    overflowDirection,
    checkOverflow
  };
};

// Hook for text truncation detection
export const useTextTruncation = (maxLines: number = 1) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  const checkTruncation = useCallback(() => {
    const element = textRef.current;
    if (!element) return;

    const lineHeight = parseInt(getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * maxLines;
    const actualHeight = element.scrollHeight;
    
    setIsTruncated(actualHeight > maxHeight);
  }, [maxLines]);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(checkTruncation);
    mutationObserver.observe(element, {
      childList: true,
      characterData: true
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [checkTruncation]);

  return {
    textRef,
    isTruncated,
    checkTruncation
  };
};

// Hook for scroll position tracking
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    isAtTop: true,
    isAtBottom: false,
    isAtLeft: true,
    isAtRight: false
  });
  const scrollRef = useRef<HTMLElement>(null);

  const updateScrollPosition = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = element;
    
    setScrollPosition({
      x: scrollLeft,
      y: scrollTop,
      isAtTop: scrollTop === 0,
      isAtBottom: Math.abs(scrollHeight - clientHeight - scrollTop) < 1,
      isAtLeft: scrollLeft === 0,
      isAtRight: Math.abs(scrollWidth - clientWidth - scrollLeft) < 1
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollPosition();
    element.addEventListener('scroll', updateScrollPosition);

    return () => {
      element.removeEventListener('scroll', updateScrollPosition);
    };
  }, [updateScrollPosition]);

  return {
    scrollRef,
    scrollPosition,
    updateScrollPosition
  };
};