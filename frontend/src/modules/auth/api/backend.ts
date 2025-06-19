import { useBackendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { LoginFields, LoginResponse } from "../types/login";
import { RegisterFields, RegisterResponse } from "../types/register";
import axios from "axios";

export function useBackendAuthApi() {
  const backendApi = useBackendApi();

  const authClient = backendApi.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
  });

  async function login(data: LoginFields) {
    return treatAxiosRequest<LoginResponse>(() => authClient.post('/login', data));
  }

  async function register(data: RegisterFields) {
    return treatAxiosRequest<RegisterResponse>(() => authClient.post('/register', data));
  }

  async function getUser() {
    return treatAxiosRequest<LoginResponse>(() => authClient.get('/user'));
  }

  async function logout() {
    return treatAxiosRequest(() => axios.post('/api/logout'));
  }

  return {
    login,
    register,
    getUser,
    logout,
  };
}
