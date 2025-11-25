'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import Image from 'next/image';

const GALLERY_CATEGORIES = [
    'All',
    'Hair Services',
    'Facial & Skin Care',
    'Makeup & Styling',
    'Bridal',
    'Waxing',
    'Other'
];

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newImageCategory, setNewImageCategory] = useState('Other');
    const [activeTab, setActiveTab] = useState<'gallery' | 'instagram'>('gallery');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        const res = await fetch('/api/data/gallery');
        const data = await res.json();
        setImages(data);
        setLoading(false);
    };

    const handleUpload = async (url: string) => {
        if (!url) return;
        const newImage = {
            id: Date.now().toString(),
            url,
            caption: '',
            category: newImageCategory,
            isInstagram: activeTab === 'instagram'
        };
        const updatedImages = [newImage, ...images];

        await fetch('/api/data/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedImages),
        });

        setImages(updatedImages);
        setNewImageCategory('Other'); // Reset category
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this image?')) return;
        const updatedImages = images.filter(img => img.id !== id);

        await fetch('/api/data/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedImages),
        });

        setImages(updatedImages);
    };

    const handleCaptionChange = async (id: string, caption: string) => {
        const updatedImages = images.map(img => img.id === id ? { ...img, caption } : img);
        setImages(updatedImages);
    };

    const handleCategoryChange = async (id: string, category: string) => {
        const updatedImages = images.map(img => img.id === id ? { ...img, category } : img);
        setImages(updatedImages);
    };

    const saveGallery = async () => {
        await fetch('/api/data/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(images),
        });
        alert('Changes saved!');
    };

    if (loading) return <div>Loading...</div>;

    const filteredImages = images.filter(img =>
        activeTab === 'gallery' ? !img.isInstagram : img.isInstagram
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
                <button onClick={saveGallery} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'gallery'
                                ? 'bg-brand-primary text-white border-b-2 border-brand-primary'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        Main Gallery ({images.filter(img => !img.isInstagram).length})
                    </button>
                    <button
                        onClick={() => setActiveTab('instagram')}
                        className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'instagram'
                                ? 'bg-brand-primary text-white border-b-2 border-brand-primary'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        Instagram Feed ({images.filter(img => img.isInstagram).length})
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    {activeTab === 'gallery' ? 'Upload to Main Gallery' : 'Upload to Instagram Feed'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {activeTab === 'gallery'
                        ? 'These images will appear in the Gallery page for customers to browse.'
                        : 'These images will appear in the Instagram section on homepage (@swekshabeauty).'}
                </p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        value={newImageCategory}
                        onChange={(e) => setNewImageCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                        {GALLERY_CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <ImageUploader onChange={handleUpload} className="h-32" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((img) => (
                    <div key={img.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative h-48">
                            <Image src={img.url} alt={img.caption || 'Gallery Image'} fill className="object-cover" />
                            <button
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-3 space-y-2">
                            <input
                                type="text"
                                value={img.caption}
                                onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                                placeholder="Add caption..."
                                className="w-full text-sm border-none focus:ring-0 p-0 text-gray-600 placeholder-gray-400"
                            />
                            <select
                                value={img.category || 'Other'}
                                onChange={(e) => handleCategoryChange(img.id, e.target.value)}
                                className="w-full text-xs border border-gray-200 rounded px-2 py-1 text-gray-600"
                            >
                                {GALLERY_CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
