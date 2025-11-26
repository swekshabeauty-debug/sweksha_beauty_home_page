'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/admin/dashboard');
        }
    }, [status, router]);

    const handleAdminLogin = () => {
        signIn('google');
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>

                {status === 'authenticated' ? (
                    <div className="text-center">
                        <p className="text-green-600 mb-4">You are logged in!</p>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <button
                                onClick={handleAdminLogin}
                                className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full px-6 py-3 hover:bg-gray-50 transition shadow-sm w-full font-medium text-gray-700"
                            >
                                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-6 h-6" />
                                Sign in as Admin
                            </button>
                        </div>
                        <p className="mt-4 text-center text-xs text-gray-400">
                            Status: {status}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
