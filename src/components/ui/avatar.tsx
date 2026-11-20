import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({
  src,
  alt = "User Avatar",
  fallbackName = "User",
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [error, setError] = React.useState(false);

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-24 h-24 text-base",
  };

  const initials = fallbackName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[#d8dfea] border border-[#b3bed0] text-[#3b5998] font-bold select-none shrink-0",
          sizeClasses[size],
          className
        )}
      >
        {initials || "?"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={cn(
        "object-cover border border-[#cccccc] shrink-0",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
