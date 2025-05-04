'use client';

import { useLoading } from "@/modules/shared/hooks/useLoading";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { LoginFields, LoginResponse } from "../types/login";
import { backendAuthApi } from "../api/backend";

type ContextValues = {
  user: LoginResponse | null;
  isLoading: boolean;
  login: typeof backendAuthApi.login;
};

const AuthContext = createContext<ContextValues | null>(null);

type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, handleLoading] = useLoading();

  async function login(data: LoginFields) {
    return handleLoading(async () => {
      const response = await backendAuthApi.login(data);
      if (!response.error) {
        setUser(response.data);
      }

      return response;
    });
  }

  const values: ContextValues = {
    user,
    isLoading,
    login,
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
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
