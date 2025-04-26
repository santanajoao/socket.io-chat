const FRONTEND_DOMAIN = new URL(process.env.FRONTEND_URL!).hostname;

export const COOKIE_DEFAULT_CONFIG = {
  domain: FRONTEND_DOMAIN,
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
} as const;
