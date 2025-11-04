/**
 * Monitoring Service
 * Handles performance monitoring, error tracking, and analytics
 */

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

interface ErrorReport {
  message: string
  stack?: string
  timestamp: number
  userAgent: string
  url: string
  userId?: string
  metadata?: Record<string, any>
}

interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: number
  userId?: string
}

class MonitoringService {
  private performanceMetrics: PerformanceMetric[] = []
  private errorReports: ErrorReport[] = []
  private analyticsEvents: AnalyticsEvent[] = []
  private userId?: string

  /**
   * Initialize monitoring service
   */
  init(userId?: string) {
    this.userId = userId
    this.setupErrorHandling()
    this.setupPerformanceObserver()
    this.trackPageLoad()
  }

  /**
   * Set up global error handling
   */
  private setupErrorHandling() {
    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.userId,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.userId,
        metadata: {
          type: 'unhandledrejection',
          reason: event.reason
        }
      })
    })
  }

  /**
   * Set up performance observer
   */
  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.trackMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart)
            this.trackMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart)
            this.trackMetric('first_byte', navEntry.responseStart - navEntry.fetchStart)
          }
        }
      })

      try {
        navObserver.observe({ entryTypes: ['navigation'] })
      } catch (e) {
        console.warn('Navigation timing not supported')
      }

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackMetric(entry.name.replace('-', '_'), entry.startTime)
        }
      })

      try {
        paintObserver.observe({ entryTypes: ['paint'] })
      } catch (e) {
        console.warn('Paint timing not supported')
      }

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.trackMetric('largest_contentful_paint', lastEntry.startTime)
      })

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP timing not supported')
      }

      // Observe cumulative layout shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.trackMetric('cumulative_layout_shift', clsValue)
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS timing not supported')
      }
    }
  }

  /**
   * Track page load performance
   */
  private trackPageLoad() {
    window.addEventListener('load', () => {
      // Track bundle size
      if ('navigator' in window && 'connection' in navigator) {
        const connection = (navigator as any).connection
        this.trackMetric('connection_type', connection.effectiveType, {
          downlink: connection.downlink,
          rtt: connection.rtt
        })
      }

      // Track memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory
        this.trackMetric('memory_used', memory.usedJSHeapSize)
        this.trackMetric('memory_total', memory.totalJSHeapSize)
        this.trackMetric('memory_limit', memory.jsHeapSizeLimit)
      }
    })
  }

  /**
   * Track a performance metric
   */
  trackMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }

    this.performanceMetrics.push(metric)

    // Send to external service if configured
    this.sendToExternalService('metric', metric)

    // Keep only last 100 metrics
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics.shift()
    }
  }

  /**
   * Report an error
   */
  reportError(error: ErrorReport) {
    this.errorReports.push(error)

    // Send to external service
    this.sendToExternalService('error', error)

    // Keep only last 50 errors
    if (this.errorReports.length > 50) {
      this.errorReports.shift()
    }
  }

  /**
   * Track an analytics event
   */
  trackEvent(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
      userId: this.userId
    }

    this.analyticsEvents.push(analyticsEvent)

    // Send to external service
    this.sendToExternalService('event', analyticsEvent)

    // Keep only last 200 events
    if (this.analyticsEvents.length > 200) {
      this.analyticsEvents.shift()
    }
  }

  /**
   * Track DeFi-specific events
   */
  trackStakingEvent(action: 'stake' | 'withdraw' | 'claim', data: {
    poolAddress: string
    amount?: string
    tokenSymbol?: string
    txHash?: string
    success?: boolean
    error?: string
  }) {
    this.trackEvent(`staking_${action}`, {
      ...data,
      category: 'defi',
      subcategory: 'staking'
    })
  }

  /**
   * Track wallet events
   */
  trackWalletEvent(action: 'connect' | 'disconnect' | 'switch_network', data: {
    walletType?: string
    chainId?: number
    address?: string
    success?: boolean
    error?: string
  }) {
    this.trackEvent(`wallet_${action}`, {
      ...data,
      category: 'wallet'
    })
  }

  /**
   * Track UI interactions
   */
  trackUIEvent(action: string, element: string, data?: Record<string, any>) {
    this.trackEvent('ui_interaction', {
      action,
      element,
      ...data,
      category: 'ui'
    })
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    metrics: PerformanceMetric[]
    averages: Record<string, number>
    latest: Record<string, number>
  } {
    const averages: Record<string, number> = {}
    const latest: Record<string, number> = {}
    const metricsByName: Record<string, number[]> = {}

    // Group metrics by name
    for (const metric of this.performanceMetrics) {
      if (!metricsByName[metric.name]) {
        metricsByName[metric.name] = []
      }
      metricsByName[metric.name].push(metric.value)
      latest[metric.name] = metric.value
    }

    // Calculate averages
    for (const [name, values] of Object.entries(metricsByName)) {
      averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length
    }

    return {
      metrics: this.performanceMetrics,
      averages,
      latest
    }
  }

  /**
   * Get error summary
   */
  getErrorSummary(): {
    errors: ErrorReport[]
    count: number
    recentErrors: ErrorReport[]
  } {
    return {
      errors: this.errorReports,
      count: this.errorReports.length,
      recentErrors: this.errorReports.slice(-10)
    }
  }

  /**
   * Send data to external monitoring services
   */
  private sendToExternalService(type: 'metric' | 'error' | 'event', data: any) {
    // Send to Sentry for errors
    if (type === 'error' && window.Sentry) {
      window.Sentry.captureException(new Error(data.message), {
        extra: data.metadata,
        user: { id: this.userId }
      })
    }

    // Send to Google Analytics for events
    if (type === 'event' && window.gtag) {
      window.gtag('event', data.event, {
        custom_parameter_1: JSON.stringify(data.properties),
        user_id: this.userId
      })
    }

    // Send to custom analytics endpoint
    if (process.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(process.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: Date.now(),
          userId: this.userId,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(error => {
        console.warn('Failed to send analytics data:', error)
      })
    }
  }

  /**
   * Clear all stored data
   */
  clear() {
    this.performanceMetrics = []
    this.errorReports = []
    this.analyticsEvents = []
  }

  /**
   * Export data for debugging
   */
  exportData() {
    return {
      performance: this.getPerformanceSummary(),
      errors: this.getErrorSummary(),
      events: this.analyticsEvents,
      userId: this.userId,
      timestamp: Date.now()
    }
  }
}

// Extend window interface for external services
declare global {
  interface Window {
    Sentry?: any
    gtag?: any
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService()

// Auto-initialize on import
if (typeof window !== 'undefined') {
  monitoringService.init()
}