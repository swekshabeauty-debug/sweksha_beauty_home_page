import { auth } from "@/auth"
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    console.log(`[Middleware] Path: ${pathname}, User: ${isLoggedIn ? 'Authenticated' : 'Guest'}`);

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
    // const protectedPaths = ['/admin'];
    // const isProtected = protectedPaths.some(path => pathname.startsWith(path));
    const isProtected = false; // Temporarily disabled to rely on client-side check in AdminLayout

    // EXCEPTION: Allow access to admin login page
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    if (isProtected && !isLoggedIn) {
        // If trying to access admin, go to admin login
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        // Otherwise go to generic login
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(req.url));
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
