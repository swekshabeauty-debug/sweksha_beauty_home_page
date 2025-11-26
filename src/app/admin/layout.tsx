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
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip check for login page to avoid loop
        if (pathname === '/admin/login') return;

        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router, pathname]);

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
