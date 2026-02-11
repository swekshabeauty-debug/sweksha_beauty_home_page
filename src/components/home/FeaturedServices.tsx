'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeaturedServicesProps {
    services: any[];
}

export default function FeaturedServices({ services }: FeaturedServicesProps) {
    const allServices = (Array.isArray(services) ? services : [])
        .flatMap(cat => cat.services || [])
        .filter(s => s.active)
        .sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0))
        .slice(0, 4);

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="py-10 md:py-16 px-4 bg-background"
        >
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="heading-elegant text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">
                        Featured Services
                    </h2>
                    <p className="text-muted text-sm sm:text-base max-w-md mx-auto">
                        Discover our most popular beauty treatments
                    </p>
                </div>

                {/* Horizontal scroll on mobile, grid on larger screens */}
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 snap-x snap-mandatory hide-scrollbar">
                    {allServices.map((service, i) => (
                        <motion.div
                            key={service._id || service.id || i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="min-w-[260px] sm:min-w-0 snap-center"
                        >
                            <Link
                                href={`/booking?service=${encodeURIComponent(service.name)}`}
                                className="block h-full"
                            >
                                <div className="card-elegant overflow-hidden h-full group">
                                    {/* Image */}
                                    <div className="h-40 sm:h-48 relative overflow-hidden">
                                        <Image
                                            src={getImageUrl(service.image)}
                                            alt={service.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-brand-primary transition-colors">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-muted mb-3 line-clamp-2">
                                            {service.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-brand-primary text-lg">
                                                ₹{service.price}
                                            </span>
                                            <span className="text-xs bg-foreground text-background px-4 py-2 rounded-full font-medium group-hover:bg-brand-primary transition-colors">
                                                Book
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
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-brand-primary font-medium hover:gap-3 transition-all"
                    >
                        View All Services <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
}
