'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { ROUTES } from "../constants/routes";
import axiosInherit from "axios-inherit";

export function useBackendApi() {
  const router = useRouter();

  const backendApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
  });
  
  backendApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        router.push(ROUTES.SIGNIN);
      }
      return Promise.reject(error);
    }
  );

  return axiosInherit(backendApi);
}
