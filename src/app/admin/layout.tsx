'use client';

import AdminHeader from '@/components/AdminHeader';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip check for login page to avoid loop
        if (pathname === '/admin/login') return;

        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            const allowedEmails = ['swekshabeauty@gmail.com', 'jayant.kgp81@gmail.com'];
            if (session?.user?.email && !allowedEmails.includes(session.user.email)) {
                // User is logged in but not authorized
                router.push('/admin/login?error=AccessDenied');
            }
        }
    }, [status, router, pathname, session]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {pathname !== '/admin/login' && <AdminHeader />}
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
