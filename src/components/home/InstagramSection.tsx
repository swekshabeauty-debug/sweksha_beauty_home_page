'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface InstagramSectionProps {
    instagramImages: any[];
}

export default function InstagramSection({ instagramImages }: InstagramSectionProps) {
    return (
        <section className="py-12 px-4 bg-white dark:bg-gray-900">
            <div className="container mx-auto max-w-4xl text-center relative">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-8 font-serif">
                    Instagram @swekshabeauty
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {instagramImages.map((img: any, i: number) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                            >
                                <Image
                                    src={img.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
                                    alt={img.title || 'Instagram Post'}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                <a
                    href="https://instagram.com/sweksha_beauty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-brand-bg dark:bg-brand-primary/20 text-brand-primary px-8 py-2 rounded-full font-bold text-sm hover:bg-brand-secondary transition"
                >
                    FOLLOW US
                </a>

                {/* Floating QR Code (Desktop) */}
                <div className="hidden lg:block absolute -right-24 bottom-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform rotate-3 hover:rotate-0 transition">
                    <div className="w-24 h-24 bg-gray-900 dark:bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-white dark:text-gray-900">
                        <Instagram className="w-12 h-12" />
                    </div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Scan to Follow</p>
                </div>
            </div>
        </section>
    );
}
