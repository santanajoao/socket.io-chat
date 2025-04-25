export const COOKIE_DEFAULT_CONFIG = {
  domain: process.env.FRONTEND_URL,
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
} as const;
