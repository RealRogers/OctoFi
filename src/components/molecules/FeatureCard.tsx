/**
 * FeatureCard Component
 * 
 * A reusable molecule component for displaying AI features and capabilities.
 * Used in the About Us page to showcase the AI trading agent's features.
 * 
 * Features:
 * - Displays an icon, title, description, and optional bullet points
 * - Supports highlight lists for detailed feature breakdown
 * - Includes hover effects and smooth transitions
 * - Fully accessible with ARIA labels
 * - Responsive design with proper spacing
 * 
 * @component
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={Brain}
 *   title="Market Analysis"
 *   description="Advanced AI algorithms analyze market trends"
 *   highlights={["Real-time detection", "Sentiment analysis"]}
 * />
 * ```
 */

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Title of the feature */
  title: string;
  /** Detailed description of the feature */
  description: string;
  /** Optional array of highlight bullet points */
  highlights?: string[];
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * FeatureCard displays an AI feature with icon, title, description, and optional highlights.
 * Designed to be used in grid layouts on the About Us page.
 * Memoized to prevent unnecessary re-renders.
 */
const FeatureCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  highlights,
  className 
}: FeatureCardProps) => {
  return (
    <Card 
      className={cn(
        "bg-card/50 backdrop-blur-sm border-border/50",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
        "transition-all duration-300",
        "h-full", // Ensure equal height in grid layouts
        className
      )}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Icon with accent background */}
        <div className="mb-4">
          <div className="inline-flex p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Icon 
              className="w-8 h-8 text-primary"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        {/* Optional Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="mt-auto pt-4 border-t border-border/30">
            <ul className="space-y-2" role="list">
              {highlights.map((highlight, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  {/* Bullet point */}
                  <span 
                    className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
