export const PUBLIC_ROUTES = {
  SIGNIN: '/login',
  SIGNUP: '/register',
} as const;

export const PUBLIC_ROUTE_LIST: string[] = Object.values(PUBLIC_ROUTES);

export const PROTECTED_ROUTES = {
  CHATS: '/',
} as const

export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
};
