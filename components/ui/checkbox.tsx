"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer h-5 w-5 shrink-0 rounded-md border-2 border-gray-300 bg-white shadow-sm transition-all duration-200 ease-in-out hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-600 data-[state=checked]:to-blue-500 data-[state=checked]:border-blue-600 data-[state=checked]:shadow-lg data-[state=checked]:scale-105",
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn(
                "flex items-center justify-center text-white animate-in zoom-in-50 duration-200"
            )}
        >
            <Check className="h-4 w-4 stroke-[3]" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
