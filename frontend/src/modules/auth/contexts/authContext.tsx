'use client';

import { useLoading } from "@/modules/shared/hooks/useLoading";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { LoginFields, LoggedUser } from "../types/login";
import { useBackendAuthApi } from "../api/backend";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useRouter } from "next/navigation";

type ContextValues = {
  user: LoggedUser | null;
  isLoading: boolean;
  login: ReturnType<typeof useBackendAuthApi>["login"];
  logout: () => Promise<void>;
};

const AuthContext = createContext<ContextValues | null>(null);

type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [isLoading, handleLoading] = useLoading(true);
  const router = useRouter();

  const backendAuthApi = useBackendAuthApi();

  async function login(data: LoginFields) {
    const response = await backendAuthApi.login(data);
    if (!response.error) {
      setUser(response.data);
    }

    return response;
  }

  async function fetchUser() {
    return handleLoading(async () => {
      const response = await backendAuthApi.getUser();
      if (!response.error) {
        setUser(response.data);
        return;
      }
    })
  }

  async function logout() {
    const response = await backendAuthApi.logout();
    if (!response.error) {
      router.push(ROUTES.SIGNIN);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const values: ContextValues = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={values}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const data = useContext(AuthContext);
  if (!data) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return data;
}
