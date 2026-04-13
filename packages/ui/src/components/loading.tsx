import * as React from "react";
import { cn } from "@supporthub/ui/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "lg";
  fullScreen?: boolean;
}

/**
 * A minimal loading indicator using three pulsing dots.
 */
export function Loading({
  className,
  size = "default",
  fullScreen = false,
  ...props
}: LoadingProps) {
  const dotSize = {
    xs: "size-1",
    sm: "size-1.5",
    default: "size-2",
    lg: "size-3",
  }[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1",
        fullScreen &&
          "fixed inset-0 z-50 bg-background/50 backdrop-blur-sm h-screen w-screen",
        !fullScreen && "h-full w-full",
        className,
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dotSize, "rounded-full bg-primary/60 animate-bounce")}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
