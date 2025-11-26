'use client';

import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    useEffect(() => {
        if (session) {
            router.push(callbackUrl);
        }
    }, [session, router, callbackUrl]);

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600 mb-8">Please sign in to continue to Sweksha Beauty.</p>

                <div className="flex justify-center">
                    <GoogleSignInButton />
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
