import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { LoginFields, LoginResponse } from "../types/login";
import { BackendResponse } from "@/modules/shared/types/backend";

export const authClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
});

export async function login(data: LoginFields) {
  return treatAxiosRequest<BackendResponse<LoginResponse>>(() => authClient.post('/login', data));
}
