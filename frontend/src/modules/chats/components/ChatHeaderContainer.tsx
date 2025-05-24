import { cn } from "@/modules/shared/lib/utils";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export function ChatHeaderContainer({ children, className, ...props }: Props) {
  return (
    <div className={cn("flex gap-2 justify-between items-center mb-3 border px-4 py-2 rounded-md", className)} {...props}>
      {children}
    </div>
  );
}
