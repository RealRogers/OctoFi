/**
 * Performance Audit Utilities
 * Comprehensive performance monitoring and optimization tools
 */

import { useCLSMonitoring } from './layoutOptimizations';
import { useFrameRate } from './animationOptimizations';

// Performance metrics interface
interface PerformanceMetrics {
  // Core Web Vitals
  cls: number;
  fcp: number;
  lcp: number;
  fid: number;
  
  // Custom metrics
  fps: number;
  memoryUsage: number;
  bundleSize: number;
  renderTime: number;
  
  // Timestamps
  timestamp: number;
}

// Performance thresholds (Google recommendations)
export const PERFORMANCE_THRESHOLDS = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 }, // ms
  lcp: { good: 2500, needsImprovement: 4000 }, // ms
  fid: { good: 100, needsImprovement: 300 }, // ms
  fps: { good: 55, needsImprovement: 30 },
  memoryUsage: { good: 50, needsImprovement: 100 }, // MB
  renderTime: { good: 16.67, needsImprovement: 33.33 } // ms (60fps = 16.67ms per frame)
} as const;

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // CLS Observer
    if ('LayoutShift' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
          }
        }
        this.updateMetric('cls', cls);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    }

    // LCP Observer
    if ('LargestContentfulPaint' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.updateMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    }

    // FCP Observer
    if ('FirstContentfulPaint' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.updateMetric('fcp', fcpEntry.startTime);
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.push(fcpObserver);
    }

    // FID Observer
    if ('FirstInputDelay' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0];
        this.updateMetric('fid', (fidEntry as any).processingStart - fidEntry.startTime);
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    }
  }

  private updateMetric(key: keyof PerformanceMetrics, value: number) {
    const currentMetrics = this.getCurrentMetrics();
    currentMetrics[key] = value;
    currentMetrics.timestamp = performance.now();
    
    // Keep only last 100 measurements
    this.metrics.push(currentMetrics);
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const latest = this.metrics[this.metrics.length - 1];
    return latest ? { ...latest } : {
      cls: 0,
      fcp: 0,
      lcp: 0,
      fid: 0,
      fps: 60,
      memoryUsage: 0,
      bundleSize: 0,
      renderTime: 0,
      timestamp: performance.now()
    };
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // FPS monitoring
    this.startFPSMonitoring();
    
    // Memory monitoring
    this.startMemoryMonitoring();
    
    // Render time monitoring
    this.startRenderTimeMonitoring();
  }

  stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  private startFPSMonitoring() {
    let frames = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      if (!this.isMonitoring) return;
      
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.updateMetric('fps', fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  private startMemoryMonitoring() {
    const measureMemory = () => {
      if (!this.isMonitoring) return;
      
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        this.updateMetric('memoryUsage', usedMB);
      }
      
      setTimeout(measureMemory, 5000); // Every 5 seconds
    };
    
    measureMemory();
  }

  private startRenderTimeMonitoring() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('React')) {
          this.updateMetric('renderTime', entry.duration);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    this.observers.push(observer);
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getPerformanceScore(): number {
    const latest = this.getLatestMetrics();
    if (!latest) return 0;

    const scores = {
      cls: this.getMetricScore('cls', latest.cls),
      fcp: this.getMetricScore('fcp', latest.fcp),
      lcp: this.getMetricScore('lcp', latest.lcp),
      fid: this.getMetricScore('fid', latest.fid),
      fps: this.getMetricScore('fps', latest.fps),
      memoryUsage: this.getMetricScore('memoryUsage', latest.memoryUsage),
      renderTime: this.getMetricScore('renderTime', latest.renderTime)
    };

    // Weighted average (Core Web Vitals have higher weight)
    const weights = {
      cls: 0.2,
      fcp: 0.15,
      lcp: 0.2,
      fid: 0.15,
      fps: 0.1,
      memoryUsage: 0.1,
      renderTime: 0.1
    };

    return Object.entries(scores).reduce((total, [key, score]) => {
      return total + (score * weights[key as keyof typeof weights]);
    }, 0);
  }

  private getMetricScore(metric: keyof typeof PERFORMANCE_THRESHOLDS, value: number): number {
    const thresholds = PERFORMANCE_THRESHOLDS[metric];
    
    // For metrics where lower is better (cls, fcp, lcp, fid, memoryUsage, renderTime)
    if (['cls', 'fcp', 'lcp', 'fid', 'memoryUsage', 'renderTime'].includes(metric)) {
      if (value <= thresholds.good) return 100;
      if (value <= thresholds.needsImprovement) return 50;
      return 0;
    }
    
    // For metrics where higher is better (fps)
    if (value >= thresholds.good) return 100;
    if (value >= thresholds.needsImprovement) return 50;
    return 0;
  }
}

// Performance audit utilities
export const performanceAuditUtils = {
  // Run comprehensive performance audit
  runPerformanceAudit: async (): Promise<{
    metrics: PerformanceMetrics | null;
    score: number;
    recommendations: string[];
    issues: Array<{ severity: 'high' | 'medium' | 'low'; message: string }>;
  }> => {
    const monitor = new PerformanceMonitor();
    monitor.startMonitoring();
    
    // Wait for metrics to be collected
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const metrics = monitor.getLatestMetrics();
    const score = monitor.getPerformanceScore();
    
    monitor.stopMonitoring();
    
    const issues: Array<{ severity: 'high' | 'medium' | 'low'; message: string }> = [];
    const recommendations: string[] = [];
    
    if (metrics) {
      // Analyze metrics and generate recommendations
      if (metrics.cls > PERFORMANCE_THRESHOLDS.cls.needsImprovement) {
        issues.push({
          severity: 'high',
          message: `High Cumulative Layout Shift: ${metrics.cls.toFixed(4)} (should be < ${PERFORMANCE_THRESHOLDS.cls.good})`
        });
        recommendations.push('Reserve space for dynamic content to prevent layout shifts');
        recommendations.push('Use CSS containment to isolate layout calculations');
      }
      
      if (metrics.lcp > PERFORMANCE_THRESHOLDS.lcp.needsImprovement) {
        issues.push({
          severity: 'high',
          message: `Slow Largest Contentful Paint: ${metrics.lcp.toFixed(0)}ms (should be < ${PERFORMANCE_THRESHOLDS.lcp.good}ms)`
        });
        recommendations.push('Optimize images and use modern formats (WebP, AVIF)');
        recommendations.push('Implement lazy loading for below-fold content');
      }
      
      if (metrics.fps < PERFORMANCE_THRESHOLDS.fps.needsImprovement) {
        issues.push({
          severity: 'medium',
          message: `Low frame rate: ${metrics.fps}fps (should be > ${PERFORMANCE_THRESHOLDS.fps.good}fps)`
        });
        recommendations.push('Optimize animations to use GPU acceleration');
        recommendations.push('Reduce JavaScript execution during animations');
      }
      
      if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.needsImprovement) {
        issues.push({
          severity: 'medium',
          message: `High memory usage: ${metrics.memoryUsage.toFixed(1)}MB (should be < ${PERFORMANCE_THRESHOLDS.memoryUsage.good}MB)`
        });
        recommendations.push('Implement component lazy loading');
        recommendations.push('Clean up event listeners and subscriptions');
      }
    }
    
    return { metrics, score, recommendations, issues };
  },

  // Analyze bundle size
  analyzeBundleSize: async () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && !resource.name.includes('node_modules')
    );
    
    const cssResources = resources.filter(resource => 
      resource.name.includes('.css')
    );
    
    const totalJSSize = jsResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );
    
    const totalCSSSize = cssResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );
    
    return {
      totalSize: totalJSSize + totalCSSSize,
      jsSize: totalJSSize,
      cssSize: totalCSSSize,
      jsFiles: jsResources.length,
      cssFiles: cssResources.length,
      recommendations: [
        totalJSSize > 500000 ? 'Consider code splitting to reduce JS bundle size' : null,
        jsResources.length > 10 ? 'Consider bundling JS files to reduce HTTP requests' : null,
        totalCSSSize > 100000 ? 'Consider CSS optimization and purging unused styles' : null
      ].filter(Boolean)
    };
  },

  // Check for performance anti-patterns
  checkPerformanceAntiPatterns: () => {
    const issues: string[] = [];
    
    // Check for synchronous scripts
    const syncScripts = document.querySelectorAll('script:not([async]):not([defer])');
    if (syncScripts.length > 0) {
      issues.push(`${syncScripts.length} synchronous scripts found - consider async/defer`);
    }
    
    // Check for large images without optimization
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        issues.push(`Image ${index + 1} is very large (${img.naturalWidth}x${img.naturalHeight}) - consider optimization`);
      }
      
      if (!img.loading || img.loading === 'eager') {
        issues.push(`Image ${index + 1} not using lazy loading`);
      }
    });
    
    // Check for missing resource hints
    const hasPreconnect = document.querySelector('link[rel="preconnect"]');
    const hasDNSPrefetch = document.querySelector('link[rel="dns-prefetch"]');
    
    if (!hasPreconnect && !hasDNSPrefetch) {
      issues.push('No resource hints found - consider preconnect/dns-prefetch for external resources');
    }
    
    // Check for unused CSS
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    if (stylesheets.length > 5) {
      issues.push(`${stylesheets.length} CSS files loaded - consider bundling or critical CSS`);
    }
    
    return issues;
  }
};

// Real-time performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);
  const [score, setScore] = React.useState<number>(0);
  const monitorRef = React.useRef<PerformanceMonitor | null>(null);

  React.useEffect(() => {
    const monitor = new PerformanceMonitor();
    monitorRef.current = monitor;
    
    monitor.startMonitoring();
    
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      const latestMetrics = monitor.getLatestMetrics();
      const currentScore = monitor.getPerformanceScore();
      
      setMetrics(latestMetrics);
      setScore(currentScore);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      monitor.stopMonitoring();
    };
  }, []);

  return { metrics, score };
};

// Performance optimization recommendations
export const performanceOptimizations = {
  // Get optimization recommendations based on current metrics
  getOptimizationRecommendations: (metrics: PerformanceMetrics) => {
    const recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      category: string;
      title: string;
      description: string;
      implementation: string;
    }> = [];

    // CLS optimizations
    if (metrics.cls > PERFORMANCE_THRESHOLDS.cls.good) {
      recommendations.push({
        priority: 'high',
        category: 'Layout Stability',
        title: 'Reduce Cumulative Layout Shift',
        description: 'Layout shifts are causing poor user experience',
        implementation: 'Add explicit dimensions to images and reserve space for dynamic content'
      });
    }

    // LCP optimizations
    if (metrics.lcp > PERFORMANCE_THRESHOLDS.lcp.good) {
      recommendations.push({
        priority: 'high',
        category: 'Loading Performance',
        title: 'Optimize Largest Contentful Paint',
        description: 'Main content is loading too slowly',
        implementation: 'Optimize images, implement lazy loading, and reduce server response times'
      });
    }

    // FPS optimizations
    if (metrics.fps < PERFORMANCE_THRESHOLDS.fps.good) {
      recommendations.push({
        priority: 'medium',
        category: 'Animation Performance',
        title: 'Improve Frame Rate',
        description: 'Animations are not running smoothly',
        implementation: 'Use CSS transforms instead of layout properties and add will-change hints'
      });
    }

    // Memory optimizations
    if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.good) {
      recommendations.push({
        priority: 'medium',
        category: 'Memory Usage',
        title: 'Reduce Memory Consumption',
        description: 'High memory usage may cause performance issues',
        implementation: 'Implement component cleanup and avoid memory leaks'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
};

// Development performance tools
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Add performance tools to window
  (window as any).performanceAudit = {
    runAudit: performanceAuditUtils.runPerformanceAudit,
    analyzeBundleSize: performanceAuditUtils.analyzeBundleSize,
    checkAntiPatterns: performanceAuditUtils.checkPerformanceAntiPatterns,
    monitor: new PerformanceMonitor()
  };

  console.log('Performance audit tools available at window.performanceAudit');
}