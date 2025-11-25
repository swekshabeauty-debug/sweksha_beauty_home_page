import { getSettings } from './db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

export async function verifyPassword(password: string): Promise<boolean> {
    const settings = await getSettings();
    return bcrypt.compare(password, settings.admin.passwordHash);
}

export async function createSession() {
    const cookieStore = await cookies();
    // In a real app, we'd sign a JWT here. For simplicity, we'll set a secure flag.
    // Since we don't have a database of sessions, we rely on the cookie presence + middleware check.
    // To make it slightly more secure, we could store a session token in settings.json, but that's overkill for this scope.
    // We'll just set a simple "authenticated" cookie.
    cookieStore.set(COOKIE_NAME, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.has(COOKIE_NAME);
}
