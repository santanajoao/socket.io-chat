import { NextResponse, type NextRequest } from 'next/server'
import { PUBLIC_ROUTE_LIST, ROUTES } from './modules/shared/constants/routes';
 
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const jwtToken = request.cookies.get('accessToken');

  const isPublicRoute = PUBLIC_ROUTE_LIST.includes(path);
  if (isPublicRoute && jwtToken) {
    return NextResponse.redirect(new URL(ROUTES.CHATS, request.url));
  }

  if (!isPublicRoute && !jwtToken) {
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
