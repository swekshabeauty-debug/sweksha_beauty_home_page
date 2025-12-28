'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface FeaturedServicesProps {
    services: any[];
}

export default function FeaturedServices({ services }: FeaturedServicesProps) {
    return (
        <section className="py-12 px-4 bg-brand-bg/50 dark:bg-black/80">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 font-serif">Featured Services</h2>
                    <p className="text-gray-600 dark:text-gray-400">Discover our most popular beauty treatments</p>
                </div>

                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar">
                    {(Array.isArray(services) ? services : []).flatMap(cat => cat.services || []).filter(s => s.active && s.image).slice(0, 4).map((service, i) => (
                        <FadeIn key={service._id || i} delay={i * 0.1} className="min-w-[280px] sm:min-w-0 snap-center">
                            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group h-full border border-transparent hover:border-brand-primary/20">
                                <div className="h-48 relative overflow-hidden">
                                    <Image
                                        src={getImageUrl(service.image)}
                                        alt={service.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-white font-medium text-sm">View Details</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-1 truncate">{service.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{service.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-brand-primary text-lg">₹{service.price}</span>
                                        <Link href={`/booking?service=${encodeURIComponent(service.name)}`} className="text-xs bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-200 transition font-medium">
                                            Book
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link href="/services" className="inline-flex items-center gap-2 text-brand-primary font-medium hover:underline">
                        View All Services <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
