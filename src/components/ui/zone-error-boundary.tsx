/**
 * Zone-specific Error Boundary Components
 * Specialized error boundaries for different dashboard zones with appropriate fallbacks
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bot, 
  Activity, 
  BarChart3, 
  Settings,
  Brain,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ZoneErrorBoundaryProps {
  children: ReactNode;
  zoneName: string;
  zoneType: 'hero' | 'performance' | 'ai-layer' | 'controls' | 'analytics';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  className?: string;
}

interface ZoneErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ZoneErrorBoundary extends Component<ZoneErrorBoundaryProps, ZoneErrorBoundaryState> {
  constructor(props: ZoneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ZoneErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ZoneErrorBoundary (${this.props.zoneName}) caught an error:`, error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  getZoneIcon = () => {
    switch (this.props.zoneType) {
      case 'hero': return Bot;
      case 'performance': return Activity;
      case 'ai-layer': return Brain;
      case 'controls': return Settings;
      case 'analytics': return BarChart3;
      default: return AlertTriangle;
    }
  };

  getZoneDescription = () => {
    switch (this.props.zoneType) {
      case 'hero': return 'Agent status and key metrics are temporarily unavailable';
      case 'performance': return 'Performance charts and data are temporarily unavailable';
      case 'ai-layer': return 'AI recommendations are temporarily unavailable';
      case 'controls': return 'Agent controls are temporarily unavailable';
      case 'analytics': return 'Extended analytics are temporarily unavailable';
      default: return 'This section is temporarily unavailable';
    }
  };

  getMinimalFallback = () => {
    const Icon = this.getZoneIcon();
    
    return (
      <div className={cn(
        "flex items-center justify-center p-8 glass-card rounded-lg border-red-500/20",
        this.props.className
      )}>
        <div className="text-center space-y-3">
          <Icon className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm text-gray-400">{this.props.zoneName} Error</p>
          <Button 
            onClick={this.handleReset} 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  };

  getDetailedFallback = () => {
    const Icon = this.getZoneIcon();
    
    return (
      <Card className={cn(
        "glass-card border-red-500/30",
        this.props.className
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-400 text-sm">
            <Icon className="w-4 h-4" />
            {this.props.zoneName} Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-300">
            {this.getZoneDescription()}
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="bg-gray-900/50 p-2 rounded text-xs">
              <summary className="cursor-pointer text-gray-400 mb-1 text-xs">
                Error Details
              </summary>
              <pre className="text-red-400 whitespace-pre-wrap text-xs">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2">
            <Button onClick={this.handleReset} variant="outline" size="sm" className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  render() {
    if (this.state.hasError) {
      // Use minimal fallback for hero zone to maintain layout
      if (this.props.zoneType === 'hero') {
        return this.getMinimalFallback();
      }
      
      // Use detailed fallback for other zones
      return this.getDetailedFallback();
    }

    return this.props.children;
  }
}

// Specialized zone error boundaries
export const HeroErrorBoundary: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <ZoneErrorBoundary 
    zoneName="Hero Status" 
    zoneType="hero" 
    className={className}
  >
    {children}
  </ZoneErrorBoundary>
);

export const PerformanceErrorBoundary: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <ZoneErrorBoundary 
    zoneName="Performance Overview" 
    zoneType="performance" 
    className={className}
  >
    {children}
  </ZoneErrorBoundary>
);

export const AILayerErrorBoundary: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <ZoneErrorBoundary 
    zoneName="AI Recommendations" 
    zoneType="ai-layer" 
    className={className}
  >
    {children}
  </ZoneErrorBoundary>
);

export const ControlsErrorBoundary: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <ZoneErrorBoundary 
    zoneName="Agent Controls" 
    zoneType="controls" 
    className={className}
  >
    {children}
  </ZoneErrorBoundary>
);

export const AnalyticsErrorBoundary: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <ZoneErrorBoundary 
    zoneName="Extended Analytics" 
    zoneType="analytics" 
    className={className}
  >
    {children}
  </ZoneErrorBoundary>
);

export default ZoneErrorBoundary;