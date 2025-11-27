'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SyncDataButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        if (!confirm('This will overwrite database data with local JSON files. Continue?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/migrate', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                alert('Data synced successfully!');
                router.refresh();
            } else {
                alert('Sync failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during sync.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition text-center w-full flex flex-col items-center justify-center gap-2 border border-pink-200"
        >
            <RefreshCw className={`w-5 h-5 text-pink-600 ${loading ? 'animate-spin' : ''}`} />
            <span className="block font-medium text-pink-700">
                {loading ? 'Syncing...' : 'Sync Data'}
            </span>
        </button>
    );
}
