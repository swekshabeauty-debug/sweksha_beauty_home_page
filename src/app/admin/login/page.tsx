'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/admin/dashboard');
        }
    }, [user, router]);

    const handleGoogleLogin = () => {
        signInWithGoogle();
    };


    if (loading) {
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

                {user ? (
                    <div className="text-center flex flex-col gap-4">
                        <p className="text-green-600 mb-2">You are logged in!</p>
                        <a
                            href="/admin/dashboard"
                            className="bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 inline-block"
                        >
                            Go to Dashboard
                        </a>
                        <button
                            onClick={signInWithGoogle}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Switch Account
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <p className="text-gray-600">Please sign in with an authorized Google account to access the admin dashboard.</p>
                        </div>

                        <div className="flex justify-center mb-6">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full px-6 py-3 hover:bg-gray-50 transition shadow-sm w-full font-medium text-gray-700"
                            >
                                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-6 h-6" />
                                Sign in with Google
                            </button>
                        </div>
                        <p className="mt-4 text-center text-xs text-gray-400">
                            Status: {user ? 'Logged In' : 'Logged Out'}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
