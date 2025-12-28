'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

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
    const [gallery, setGallery] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        const res = await fetch('/api/data/gallery');
        const data = await res.json();
        setGallery(data);
        setLoading(false);
    };

    const filteredGallery = selectedCategory === 'All'
        ? gallery
        : gallery.filter(img => img.category === selectedCategory);

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-brand-bg py-16 text-center">
                <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">Our Gallery</h1>
                <p className="text-gray-600 max-w-2xl mx-auto px-4">
                    A glimpse into our work and the smiles we create.
                </p>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Category Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {GALLERY_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-center text-gray-500 py-20">Loading...</div>
                ) : filteredGallery.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <p>No photos in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGallery.map((img: any) => (
                            <div key={img.id} className="relative group overflow-hidden rounded-xl shadow-md aspect-square">
                                <Image
                                    src={getImageUrl(img.image)}
                                    alt={img.title || 'Gallery Image'}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-start justify-end p-6">
                                    <p className="text-white font-medium text-lg">{img.title}</p>
                                    <p className="text-white/80 text-sm">{img.category || 'Other'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
