'use client';

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function TestUploadPage() {
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [url, setUrl] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('Initializing upload...');
        setError('');
        setUrl('');

        try {
            // Dynamically import auth to avoid SSR issues
            const { auth } = await import('@/lib/firebase');
            const { signInAnonymously } = await import('firebase/auth');

            if (!auth.currentUser) {
                setStatus('Signing in anonymously...');
                await signInAnonymously(auth);
            }

            const filename = `test-${Date.now()}-${file.name}`;
            const storageRef = ref(storage, `uploads/${filename}`);

            setStatus('Starting uploadBytes...');
            const snapshot = await uploadBytes(storageRef, file);
            setStatus('Upload complete. Getting URL...');

            const downloadUrl = await getDownloadURL(snapshot.ref);
            setUrl(downloadUrl);
            setStatus('Success!');
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || JSON.stringify(err));
            setStatus('Failed');
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Test Image Upload</h1>
            <input type="file" onChange={handleUpload} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />

            {status && <p className="text-gray-600 mb-2">Status: {status}</p>}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
                    <p className="font-bold">Error:</p>
                    <pre className="text-xs whitespace-pre-wrap">{error}</pre>
                </div>
            )}
            {url && (
                <div className="bg-green-50 text-green-700 p-4 rounded">
                    <p className="font-bold">Success!</p>
                    <a href={url} target="_blank" rel="noreferrer" className="underline break-all">{url}</a>
                    <img src={url} alt="Uploaded" className="mt-2 max-w-full h-auto rounded" />
                </div>
            )}
        </div>
    );
}
