import { ComponentProps } from "react"
import { cn } from "../../lib/utils";

type Props = ComponentProps<"div">;

export function PageContainer({ children, className, ...props }: Props) {
  return (
    <div className={cn("h-dvh w-full flex flex-col items-center justify-center p-4 max-w-7xl m-auto", className)} {...props}>
      {children}
    </div>
  )
}
