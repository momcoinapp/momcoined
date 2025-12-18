import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "solid";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "glass", children, ...props }, ref) => {
        const variants = {
            default: "bg-white shadow-md border border-gray-100",
            glass: "glass-card",
            solid: "bg-white shadow-xl border border-gray-100",
        };

        return (
            <div
                ref={ref}
                className={cn("rounded-2xl p-6", variants[variant], className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
export { Card };
