'use client';

import AdminHeader from '@/components/AdminHeader';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip check for login page to avoid loop
        if (pathname === '/admin/login') return;
        if (loading) return;

        if (!user) {
            router.push('/admin/login');
        } else {
            const allowedEmails = ['swekshabeauty@gmail.com', 'jayant.kgp81@gmail.com', 'admin@swekshabeauty.com'];
            if (user.email && !allowedEmails.includes(user.email)) {
                // User is logged in but not authorized
                router.push('/admin/login?error=AccessDenied');
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) {
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
