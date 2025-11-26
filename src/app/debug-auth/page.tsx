'use client';

import { useSession } from 'next-auth/react';

export default function DebugAuth() {
    const { data: session, status } = useSession();

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Auth Debugger</h1>
            <div className="space-y-2">
                <p><strong>Status:</strong> {status}</p>
                <p><strong>User:</strong> {session?.user?.name || 'None'}</p>
                <p><strong>Email:</strong> {session?.user?.email || 'None'}</p>
                <p><strong>Expires:</strong> {session?.expires || 'N/A'}</p>
            </div>
        </div>
    );
}
