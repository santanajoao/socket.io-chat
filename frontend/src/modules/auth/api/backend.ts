import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { LoginFields, LoginResponse } from "../types/login";
import { BackendResponse } from "@/modules/shared/types/backend";
import { RegisterFields, RegisterResponse } from "../types/register";

export const authClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
});

export async function login(data: LoginFields) {
  return treatAxiosRequest<BackendResponse<LoginResponse>>(() => authClient.post('/login', data));
}

export async function register(data: RegisterFields) {
  return treatAxiosRequest<BackendResponse<RegisterResponse>>(() => authClient.post('/register', data));
}
