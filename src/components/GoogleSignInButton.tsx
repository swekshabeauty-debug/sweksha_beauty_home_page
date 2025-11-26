'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

export default function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/booking';

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl });
        } catch (error) {
            console.error('Login failed:', error);
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
