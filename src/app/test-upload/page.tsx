'use client';

import { useState } from 'react';

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
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error('Cloudinary configuration missing. Please check .env.local');
            }

            setStatus('Uploading to Cloudinary...');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();
            setUrl(data.secure_url);
            setStatus('Success!');
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || JSON.stringify(err));
            setStatus('Failed');
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Test Cloudinary Upload</h1>
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
