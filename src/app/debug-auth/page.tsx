'use client';

import { useAuth } from '@/components/AuthProvider';

export default function DebugAuth() {
    const { user, loading } = useAuth();

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Auth Debugger</h1>
            <div className="space-y-2">
                <p><strong>Status:</strong> {loading ? 'Loading...' : (user ? 'Authenticated' : 'Unauthenticated')}</p>
                <p><strong>User:</strong> {user?.displayName || 'None'}</p>
                <p><strong>Email:</strong> {user?.email || 'None'}</p>
                <p><strong>UID:</strong> {user?.uid || 'N/A'}</p>
            </div>
        </div>
    );
}
