import { cn } from "../../lib/utils";

type Props = {
  className?: string;
}

export function LoaderContainer({ className }: Props) {
  return (
    <span aria-label="Loading" className={cn('bg-accent animate-pulse rounded-md block', className)} />
  );
}
