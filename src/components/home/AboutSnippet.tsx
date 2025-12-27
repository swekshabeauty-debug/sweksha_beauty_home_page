'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function AboutSnippet() {
    return (
        <section className="py-16 px-4 bg-white dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <FadeIn className="w-full md:w-1/2">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Sweksha Beauty Salon Interior"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </FadeIn>
                    <FadeIn className="w-full md:w-1/2" delay={0.2}>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 font-serif">Experience Beauty & Relaxation</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                At Sweksha Beauty, we believe that beauty is not just about looking good, but feeling good. Our expert team is dedicated to providing you with the best services in a hygienic and relaxing environment.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-brand-primary" /> Expert Stylists
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-brand-primary" /> Premium Products
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-brand-primary" /> Hygienic Space
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link href="/about" className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg">
                                    Learn More About Us
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
