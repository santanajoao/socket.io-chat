import { useState } from "react";

export function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLoading(callback: () => Promise<void>) {
    setIsLoading(true);
    await callback();
    setIsLoading(false);
  }

  return [isLoading, handleLoading] as const;
}
