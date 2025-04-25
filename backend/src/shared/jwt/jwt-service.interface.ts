type ValidVerifyResponse<T> = {
  valid: true;
  data: T;
};
type InvalidVerifyResponse = {
  valid: false;
  data: null;
};

export type JwtPayload = Record<string, unknown>;

export type VerifyResponse<T> = ValidVerifyResponse<T> | InvalidVerifyResponse;

export interface JwtServiceInterface {
  sign<T extends JwtPayload>(payload: T): string;
  verify<T extends JwtPayload>(token: string): VerifyResponse<T>;
}
