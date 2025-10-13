import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  placeholder?: string;
  onError?: () => void;
}

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  placeholder = '',
  onError 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse rounded-full ${fallbackClassName}`}>
          {placeholder && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              {placeholder}
            </div>
          )}
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className={`bg-gradient-to-br from-primary/20 to-secondary/20 ${fallbackClassName} flex items-center justify-center`}>
          <div className="text-muted-foreground text-xs text-center">
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full mx-auto mb-1"></div>
            No Image
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;