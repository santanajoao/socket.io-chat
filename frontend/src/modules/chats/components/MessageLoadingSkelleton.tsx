import { LoaderContainer } from "@/modules/shared/components/containers/LoaderContainer";
import { cn } from "@/modules/shared/lib/utils";

const MESSAGES = [
  { side: 'center', size: 'max-w-3xs' },
  { side: 'left', size: 'max-w-xs' },
  { side: 'right', size: 'max-w-xs' },
  { side: 'right', size: 'max-w-2xs' },
  { side: 'left', size: 'max-w-3xs' },
  { side: 'right', size: 'max-w-xs  ' },
  { side: 'left', size: 'max-w-sm' },
];

export function MessageLoadingSkelleton() {
  return (
    <div className="flex flex-col flex-1 gap-[inherit]">
      {MESSAGES.map(({ side, size }, index) => (
        <LoaderContainer
          key={index}
          className={cn('h-16 w-full rounded-lg', size, {
            "self-center h-11": side === 'center',
            "self-start": side === 'left',
            "self-end": side === 'right',
          })}
        />
      ))}
    </div>
  );
}
