import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-[2px] border border-[#bdc7d8] bg-white px-2 py-1.5 text-xs text-[#333333] placeholder:text-[#999999] focus:border-[#3b5998] focus:outline-none focus:ring-1 focus:ring-[#3b5998]/30 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-tahoma",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
