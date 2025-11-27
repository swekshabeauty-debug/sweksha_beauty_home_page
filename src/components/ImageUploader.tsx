'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function ImageUploader({ value, onChange, className = '' }: ImageUploaderProps) {
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setLoading(true);

        try {
            // Compress the image
            const options = {
                maxSizeMB: 0.8, // Max 800KB
                maxWidthOrHeight: 1920, // Max dimension
                useWebWorker: true,
                fileType: 'image/jpeg' as const,
            };

            const compressedBlob = await imageCompression(file, options);

            // Create a new File with proper .jpg extension
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^/.]+$/, '.jpg'),
                { type: 'image/jpeg' }
            );

            // Upload to Firebase Storage
            const filename = `${Date.now()}-${compressedFile.name}`;
            const storageRef = ref(storage, `uploads/${filename}`);

            await uploadBytes(storageRef, compressedFile);
            const url = await getDownloadURL(storageRef);

            onChange(url);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`Failed to upload image: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    if (value) {
        return (
            <div className={`relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 ${className}`}>
                <Image
                    src={value}
                    alt="Uploaded"
                    fill
                    className="object-cover"
                />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-48 ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
                } ${className}`}
        >
            <input {...getInputProps()} />
            {loading ? (
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            ) : (
                <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                        {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                    </p>
                </>
            )}
        </div>
    );
}
