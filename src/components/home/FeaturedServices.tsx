'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeaturedServicesProps {
    services: Array<{
        services?: Array<{
            _id?: string;
            id?: string;
            active?: boolean;
            featured?: boolean;
            name: string;
            image?: string;
            price: string | number;
            description?: string;
        }>;
    }>;
}

export default function FeaturedServices({ services }: FeaturedServicesProps) {
    const allServices = (Array.isArray(services) ? services : [])
        .flatMap(cat => cat.services || [])
        .filter(s => s.active)
        .sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0))
        .slice(0, 4);

    return (
        <section className="py-12 md:py-20 px-4 relative overflow-hidden bg-brand-bg/70 dark:bg-black/40">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="heading-elegant text-3xl md:text-5xl text-foreground mb-4">
                        Featured Services
                    </h2>
                    <p className="text-muted text-base md:text-lg max-w-xl mx-auto font-light">
                        Discover our most solicited beauty treatments curated for your elegance
                    </p>
                </motion.div>

                {/* Horizontal scroll on mobile, grid on larger screens */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 snap-x snap-mandatory hide-scrollbar">
                    {allServices.map((service, i) => (
                        <motion.div
                            key={service._id || service.id || i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="min-w-[280px] sm:min-w-0 snap-center h-full shrink-0"
                        >
                            <Link
                                href={`/booking?service=${encodeURIComponent(service.name)}`}
                                className="block h-full group"
                            >
                                <div className="card-elegant overflow-hidden h-full transition-all duration-300 hover:shadow-elegant relative">
                                    {/* Image */}
                                    <div className="h-56 relative overflow-hidden">
                                        <Image
                                            src={getImageUrl(service.image)}
                                            alt={service.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                        {/* Price Tag Overlay */}
                                        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {formatCurrency(service.price)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 relative">
                                        <h3 className="font-serif font-semibold text-lg md:text-xl text-foreground mb-2 group-hover:text-brand-primary transition-colors truncate">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">
                                            {service.description}
                                        </p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-xs uppercase tracking-wider text-brand-primary font-bold">
                                                Premium Care
                                            </span>
                                            <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center transform group-hover:bg-foreground transition-colors group-hover:rotate-45 duration-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-10"
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium group"
                    >
                        View All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
