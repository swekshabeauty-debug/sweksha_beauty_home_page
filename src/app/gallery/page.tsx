'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';
import { X } from 'lucide-react';

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
    const [selectedImage, setSelectedImage] = useState<any>(null);

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

    // Masonry column assignment
    const getColumnSpan = (index: number) => {
        // Pattern: every 3rd image is large
        return (index % 5 === 0 || index % 5 === 3) ? 'md:row-span-2' : '';
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Header */}
            <div className="relative py-24 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/50 to-background"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h1 className="heading-elegant text-5xl md:text-6xl text-foreground mb-4">Our Gallery</h1>
                    <p className="text-foreground/70 max-w-2xl mx-auto px-4 text-lg">
                        A glimpse into our work and the smiles we create.
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Category Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {GALLERY_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg scale-105'
                                : 'glass text-foreground hover:bg-brand-secondary/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Gallery Grid - Masonry Style */}
                {loading ? (
                    <div className="text-center text-foreground/50 py-20">
                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4">Loading gallery...</p>
                    </div>
                ) : filteredGallery.length === 0 ? (
                    <div className="text-center text-foreground/50 py-20">
                        <p>No photos in this category yet.</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]"
                    >
                        {filteredGallery.map((img: any, index: number) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                onClick={() => setSelectedImage(img)}
                                className={`relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer ${getColumnSpan(index)}`}
                            >
                                <Image
                                    src={getImageUrl(img.image)}
                                    alt={img.title || 'Gallery Image'}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-start justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <p className="text-white font-semibold text-lg drop-shadow-lg">{img.title}</p>
                                    <p className="text-white/80 text-sm">{img.category || 'Other'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white transition"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-4xl max-h-[85vh] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={getImageUrl(selectedImage.image)}
                            alt={selectedImage.title || 'Gallery Image'}
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                    <div className="absolute bottom-8 text-center text-white">
                        <p className="font-semibold text-xl">{selectedImage.title}</p>
                        <p className="text-white/70">{selectedImage.category}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
