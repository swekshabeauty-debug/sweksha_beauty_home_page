'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/admin/dashboard');
        }
    }, [status, router]);

    const handleGoogleLogin = () => {
        signIn('google');
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            password: password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid password');
            setLoading(false);
        } else {
            // Successful login will trigger the useEffect to redirect
            router.refresh();
        }
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
                    <div className="text-center flex flex-col gap-4">
                        <p className="text-green-600 mb-2">You are logged in!</p>
                        <a
                            href="/admin/dashboard"
                            className="bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 inline-block"
                        >
                            Go to Dashboard
                        </a>
                        <button
                            onClick={() => signIn('google')}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Switch Account
                        </button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handlePasswordLogin} className="mb-6">
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Admin Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary outline-none transition"
                                    placeholder="Enter admin password"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Login with Password'}
                            </button>
                        </form>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full px-6 py-3 hover:bg-gray-50 transition shadow-sm w-full font-medium text-gray-700"
                            >
                                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-6 h-6" />
                                Sign in with Google
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
