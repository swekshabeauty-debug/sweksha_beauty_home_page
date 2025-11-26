'use client';

import { useEffect, useState } from 'react';
import { getServices } from '@/lib/db';

export default function TestDB() {
    const [status, setStatus] = useState('Testing...');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function testConnection() {
            try {
                const services = await getServices();
                setData(services);
                if (services.length > 0) {
                    setStatus('Success: Connected and found data!');
                } else {
                    setStatus('Connected, but returned EMPTY array. (Data might be missing in Firestore)');
                }
            } catch (err: any) {
                console.error(err);
                setStatus('Failed: Error connecting to DB');
                setError(err.message || JSON.stringify(err));
            }
        }
        testConnection();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
            <div className="space-y-4">
                <div className={`p-4 rounded ${status.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <strong>Status:</strong> {status}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 font-mono text-sm">
                        <strong>Error Details:</strong> {error}
                    </div>
                )}

                {data && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                        <strong>Data Found ({data.length} items):</strong>
                        <pre className="mt-2 text-xs overflow-auto max-h-60">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
