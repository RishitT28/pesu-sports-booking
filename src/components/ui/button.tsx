import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-serif",
  {
    variants: {
      variant: {
        default:
          "bg-[#c45524] text-white hover:bg-[#b04a1d] active:bg-[#9c4017] font-semibold text-xs shadow-xs",
        destructive: "bg-[#b94236] text-white hover:bg-[#a3372c] font-semibold text-xs shadow-xs",
        outline:
          "border border-[#ded9cd] bg-[#ffffff] text-[#242831] hover:bg-[#ebe7df] font-semibold text-xs shadow-xs",
        secondary: "bg-[#1a2639] text-white hover:bg-[#25354e] font-semibold text-xs shadow-xs",
        ghost: "hover:bg-[#ebe8e1] text-[#242831] font-normal text-xs",
        link: "text-[#c45524] underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-none px-3 text-xs",
        lg: "h-10 rounded-none px-7 text-sm",
        icon: "h-9 w-9 rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
