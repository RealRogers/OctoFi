/**
 * ValueCard Component
 * 
 * A reusable molecule component for displaying core values and principles.
 * Used in the About Us page to showcase OctoFi's guiding principles.
 * 
 * Features:
 * - Displays an icon, title, and description
 * - Supports custom accent colors for icons
 * - Includes hover effects and smooth transitions
 * - Fully accessible with ARIA labels
 * - Responsive design with proper spacing
 * 
 * @component
 * @example
 * ```tsx
 * <ValueCard
 *   icon={Shield}
 *   title="Security First"
 *   description="Audited smart contracts and secure infrastructure"
 *   color="text-green-400"
 * />
 * ```
 */

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueCardProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Title of the value/principle */
  title: string;
  /** Detailed description of the value */
  description: string;
  /** Optional Tailwind color class for icon accent (e.g., "text-blue-400") */
  color?: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ValueCard displays a core value or principle with an icon, title, and description.
 * Designed to be used in grid layouts on the About Us page.
 * Memoized to prevent unnecessary re-renders.
 */
const ValueCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  color = "text-primary",
  className 
}: ValueCardProps) => {
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
        {/* Icon */}
        <div className="mb-4">
          <Icon 
            className={cn(
              "w-12 h-12",
              color,
              "transition-transform duration-300 group-hover:scale-110"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
});

ValueCard.displayName = "ValueCard";

export default ValueCard;
