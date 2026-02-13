'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function GoogleSignInButton() {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    // Callback URL is handled by the auth state change in the parent or usually just redirects to home/dashboard
    // Firebase popup handles the flow differently, typically staying on the same page or requiring manual redirect after success.
    // For now, we'll just sign in.

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full px-6 py-3 hover:bg-gray-50 transition shadow-sm w-full max-w-xs mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-primary rounded-full animate-spin"></div>
            ) : (
                <Image
                    src="https://authjs.dev/img/providers/google.svg"
                    alt="Google"
                    width={24}
                    height={24}
                />
            )}
            <span className="font-medium text-gray-700">
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
        </button>
    );
}
