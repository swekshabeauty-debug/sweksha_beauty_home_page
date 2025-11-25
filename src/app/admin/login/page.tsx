'use client';

import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLoginPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            // Middleware will handle the redirect if they are not an admin
            // But we can also do a client-side check for better UX
            const allowedAdmins = ['swekshabeauty@gmail.com', 'jayant.kgp81@gmail.com'];
            if (allowedAdmins.includes(session.user?.email || '')) {
                router.push('/admin/dashboard');
            } else {
                alert('Access Denied. You are not an admin.');
            }
        }
    }, [session, router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
                <div className="flex justify-center">
                    <GoogleSignInButton />
                </div>
                <p className="mt-4 text-center text-sm text-gray-500">
                    Only authorized administrators can access this area.
                </p>
            </div>
        </div>
    );
}
