type BackendSuccessResponse<T> = {
  data: T;
  error?: undefined;
};

export type ApiErrorResponse = {
  message: string;
  status: number;
  statusText: string;
};

export type BackendErrorResponse = {
  error: ApiErrorResponse;
  data?: undefined;
};

export type BackendResponse<T> = BackendSuccessResponse<T> | BackendErrorResponse;
