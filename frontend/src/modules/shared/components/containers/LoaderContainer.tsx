import { cn } from "../../lib/utils";

type Props = {
  className?: string;
}

export function LoaderContainer({ className }: Props) {
  return (
    <div aria-label="Loading" className={cn('bg-accent animate-pulse rounded-md', className)} />
  );
}
