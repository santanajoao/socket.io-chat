import { cn } from "@/modules/shared/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";

const chatCountBadgeVariants = cva("rounded-full min-w-5 h-5 border font-medium text-xs flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-accent text-primary",
    },
    size: {
      default: "min-w-5 h-5",
    },
  },
});

type Props = PropsWithChildren<{
  className?: ClassValue,
}> & VariantProps<typeof chatCountBadgeVariants>;

export function CountBadge({ children, className, variant = 'default', size }: Props) {
  return (
    <div className={cn(chatCountBadgeVariants({ variant, size }), className)}>
      {children}
    </div>
  );
}
