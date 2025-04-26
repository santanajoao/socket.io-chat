// 4 days
export const TOKEN_MAX_AGE_SECONDS = 4 * 24 * 60 * 60;
export const TOKEN_MAX_AGE_MS = TOKEN_MAX_AGE_SECONDS * 1000;

export const JWT_DEFAULT_CONFIG = {
  audience: process.env.FRONTEND_URL,
  issuer: process.env.API_URL,
  expiresIn: TOKEN_MAX_AGE_SECONDS,
} as const;
