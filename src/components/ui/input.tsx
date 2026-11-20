import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-7 w-full rounded-[2px] border border-[#bdc7d8] bg-white px-2 py-1 text-xs text-[#333333] placeholder:text-neutral-400 focus:border-[#3b5998] focus:outline-none focus:ring-1 focus:ring-[#3b5998]/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
