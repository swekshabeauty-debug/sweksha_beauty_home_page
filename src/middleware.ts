import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    console.log(`[Middleware] Path: ${pathname}, Token: ${token ? 'Found' : 'Missing'}`);

    // 1. Allow public assets and auth routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/login' ||
        pathname.includes('.') // files like favicon.ico, robots.txt
    ) {
        return NextResponse.next();
    }

    // 2. Protected Routes: Only redirect to login for specific paths
    // 2. Protected Routes: Only redirect to login for specific paths
    const protectedPaths = ['/admin'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    // EXCEPTION: Allow access to admin login page
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    if (isProtected && !token) {
        // If trying to access admin, go to admin login
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        // Otherwise go to generic login
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(req.url));
        return NextResponse.redirect(url);
    }

    // 3. Admin Lock: REMOVED
    // if (pathname.startsWith('/admin')) {
    //    // Logic removed to ensure access
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
