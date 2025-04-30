import axios, { AxiosResponse } from "axios";
import { BackendErrorResponse, BackendResponse } from "../types/backend";

export async function treatAxiosRequest<T>(callback: () => Promise<AxiosResponse<BackendResponse<T>>>) {
  try {
    const response = await callback();

    return response.data;
  } catch (error) {
    const defaultErrorResponse: BackendErrorResponse = {
      error: {
        message: 'Sorry, something went wrong! Try again or reload the page.',
      },
    };

    if (!axios.isAxiosError(error) || !error.response) return defaultErrorResponse;
    return error.response.data as BackendResponse<T>;
  }
}
