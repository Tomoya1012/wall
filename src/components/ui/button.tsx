import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#3b5998] text-white border border-[#2b4170] hover:bg-[#344f86] active:bg-[#253961] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] rounded-[2px]",
        fbSecondary:
          "bg-[#eceff5] text-[#3b5998] border border-[#cad4e4] hover:bg-[#dfe5ee] active:bg-[#d0d9e5] rounded-[2px]",
        fbShare:
          "bg-[#5b74a8] text-white border border-[#29447e] hover:bg-[#4f679b] active:bg-[#3b5284] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] rounded-[2px]",
        fbWhite:
          "bg-white text-[#333] border border-[#cccccc] hover:bg-[#f6f6f6] active:bg-[#ececec] rounded-[2px]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 rounded-[2px]",
        outline:
          "border border-[#d8dfea] bg-transparent hover:bg-[#eceff5] text-[#3b5998] rounded-[2px]",
        ghost:
          "hover:bg-[#eceff5] text-[#3b5998] rounded-[2px]",
        link:
          "text-[#3b5998] underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-7 px-3 py-1",
        sm: "h-6 px-2 text-[11px]",
        lg: "h-8 px-4 text-xs",
        icon: "h-6 w-6 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
