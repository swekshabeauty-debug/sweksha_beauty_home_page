'use client';

import { useEffect, useState } from 'react';

export default function TestDB() {
    const [status, setStatus] = useState('Testing...');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function testConnection() {
            try {
                const res = await fetch('/api/data/services');
                if (!res.ok) throw new Error('Failed to fetch services');
                const services = await res.json();

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

    const handleMigrate = async () => {
        setStatus('Migrating data... Please wait.');
        try {
            const res = await fetch('/api/migrate', { method: 'POST' });
            const result = await res.json();
            if (result.success) {
                setStatus('Migration Successful! Refreshing data...');
                window.location.reload();
            } else {
                setStatus('Migration Failed: ' + result.error);
            }
        } catch (err: any) {
            setStatus('Migration Error: ' + err.message);
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
            <div className="space-y-4">
                <div className={`p-4 rounded ${status.startsWith('Success') ? 'bg-green-100 text-green-800' : status.startsWith('Migration Successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <strong>Status:</strong> {status}
                </div>

                {status.includes('EMPTY') && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 mb-2">The database is empty. Click below to upload default data.</p>
                        <button
                            onClick={handleMigrate}
                            className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                        >
                            Start Data Migration
                        </button>
                    </div>
                )}

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
