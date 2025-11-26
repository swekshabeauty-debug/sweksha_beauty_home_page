import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

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
    const protectedPaths = ['/admin'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !token) {
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(req.url));
        return NextResponse.redirect(url);
    }

    // 3. Admin Lock: If accessing /admin, check email
    if (pathname.startsWith('/admin')) {
        const allowedAdmins = ['swekshabeauty@gmail.com', 'jayant.kgp81@gmail.com'];
        const userEmail = token?.email || '';
        console.log('🔐 Admin Access Attempt:', { userEmail, allowed: allowedAdmins.includes(userEmail) });

        if (!allowedAdmins.includes(userEmail)) {
            // Redirect to home with error or access denied page
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
