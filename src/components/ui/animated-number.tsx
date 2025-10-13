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
}) => {
  return (
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
    />
  );
};

AnimatedNumber.displayName = "AnimatedNumber";

export { AnimatedNumber };