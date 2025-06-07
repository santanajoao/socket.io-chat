import { Badge } from "@/modules/shared/components/ui/badge";
import { cn } from "@/modules/shared/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";

const chatBadgeVariants = cva("rounded-full size-10 shrink-0", {
  variants: {
    variant: {
      default: "font-semibold text-sm",
      outline: "font-medium",
      secondary: "",
    },
    size: {
      big: "size-20 text-lg font-bold",
    },
  },
});

type Props = PropsWithChildren<{
  className?: ClassValue,
}> & VariantProps<typeof chatBadgeVariants>;

export function ChatProfileBadge({ children, className, variant, size }: Props) {
  return (
    <Badge variant={variant} className={cn(chatBadgeVariants({ variant, size }), className)}>
      {children}
    </Badge>
  );
}
