import { useState } from "react";

export type UseLoadingHandle = <T>(callback: () => Promise<T>) => Promise<T>;

export function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading: UseLoadingHandle = async (callback) => {
    setIsLoading(true);
    const response = await callback();
    setIsLoading(false);
    return response;
  }

  return [isLoading, handleLoading] as const;
}
