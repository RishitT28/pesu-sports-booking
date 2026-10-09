import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#e35925] text-white hover:bg-[#cf4d1c] active:bg-[#b84317] font-bold tracking-wider uppercase text-xs shadow-xs",
        destructive:
          "bg-[#d9433b] text-white hover:bg-[#c33830] font-bold tracking-wider uppercase text-xs shadow-xs",
        outline:
          "border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f8f8fa] font-bold tracking-wider uppercase text-xs shadow-xs",
        secondary:
          "bg-[#0d1b2a] text-white hover:bg-[#1b2d42] font-bold tracking-wider uppercase text-xs shadow-xs",
        ghost: "hover:bg-[#f1f3f6] text-[#111827] font-semibold text-xs",
        link: "text-[#e35925] underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-none px-3 text-xs",
        lg: "h-10 rounded-none px-8",
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
