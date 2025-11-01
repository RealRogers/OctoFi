import * as React from "react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  separator?: string;
  preserveValue?: boolean;
  ariaLabel?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration = 1.5,
  separator = ",",
  preserveValue = false,
  ariaLabel,
}) => {
  // Format the value for screen readers
  const formattedValue = `${prefix}${value.toFixed(decimals)}${suffix}`;
  const accessibleLabel = ariaLabel || formattedValue;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={accessibleLabel}
    >
      <CountUp
        end={value}
        duration={duration}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        className={cn("animate-count-up", className)}
        separator={separator}
        preserveValue={preserveValue}
        useEasing={true}
        easingFn={(t: number, b: number, c: number, d: number) => {
          // Custom easing function matching our design system
          return c * ((t = t / d - 1) * t * t + 1) + b;
        }}
        aria-hidden="true"
      />
    </span>
  );
};

AnimatedNumber.displayName = "AnimatedNumber";

export { AnimatedNumber };