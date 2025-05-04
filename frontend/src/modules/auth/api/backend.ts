import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { LoginFields, LoginResponse } from "../types/login";
import { RegisterFields, RegisterResponse } from "../types/register";

const authClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
});

async function login(data: LoginFields) {
  return treatAxiosRequest<LoginResponse>(() => authClient.post('/login', data));
}

async function register(data: RegisterFields) {
  return treatAxiosRequest<RegisterResponse>(() => authClient.post('/register', data));
}

export const backendAuthApi = {
  login,
  register,
};
