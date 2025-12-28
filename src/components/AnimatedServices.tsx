'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, Suspense, useEffect } from 'react';
import { getImageUrl } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface Service {
    id: string;
    name: string;
    price: string;
    duration: string;
    description: string;
    active: boolean;
    image?: string;
}

interface ServiceCategory {
    id: string;
    name: string;
    services: Service[];
}

function ServicesContent({ services = [] }: { services: ServiceCategory[] }) {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category');
    const safeServices = Array.isArray(services) ? services : [];

    // Check if initialCategory exists in services, otherwise default to 'all'
    const validInitial = initialCategory && safeServices.some(s => s.id === initialCategory)
        ? initialCategory
        : 'all';

    const [selectedCategory, setSelectedCategory] = useState<string>(validInitial);

    // Update state if URL changes dynamically
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat && safeServices.some(s => s.id === cat)) {
            setSelectedCategory(cat);
        }
    }, [searchParams, safeServices]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const categories = [
        { id: 'all', name: 'All' },
        ...safeServices.map(s => ({ id: s.id, name: s.name }))
    ];

    const filteredServices = selectedCategory === 'all'
        ? safeServices
        : safeServices.filter(s => s.id === selectedCategory);

    return (
        <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sticky top-[72px] bg-background/80 backdrop-blur-md z-10 pt-3 border-b border-brand-secondary/30">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                            px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300
                            ${selectedCategory === category.id
                                ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg transform scale-105'
                                : 'glass text-foreground hover:bg-brand-secondary/50'}
                        `}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                {filteredServices.map((category, index) => (
                    <motion.div
                        key={category.id || `category-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Only show category title if viewing "All" to avoid redundancy when filtered */}
                        {selectedCategory === 'all' && (
                            <h2 className="text-lg font-bold text-gray-800 mb-4 sticky top-[120px] bg-brand-bg/95 backdrop-blur-sm py-2 z-[5]">{category.name}</h2>
                        )}

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {category.services.filter((s) => s.active).map((service, idx) => (
                                <motion.div key={service.id || `service-${index}-${idx}`} variants={item}>
                                    <Link
                                        href={`/booking?service=${encodeURIComponent(service.name)}`}
                                        className="block"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="card-elegant shimmer p-5 flex gap-5 items-center cursor-pointer group"
                                        >
                                            {/* Service Image */}
                                            <div className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden relative shadow-md">
                                                <Image
                                                    src={getImageUrl(service.image)}
                                                    alt={service.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-foreground text-base md:text-lg leading-tight mb-1 group-hover:text-brand-primary transition-colors">{service.name}</h3>
                                                        <p className="text-foreground/60 text-sm line-clamp-2">{service.description}</p>
                                                    </div>
                                                    <div className="text-right shrink-0 ml-4">
                                                        <span className="block font-bold text-lg text-brand-primary">₹{service.price}</span>
                                                        <span className="text-xs text-foreground/50 block">{service.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function AnimatedServices(props: { services: ServiceCategory[] }) {
    return (
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading services...</div>}>
            <ServicesContent {...props} />
        </Suspense>
    );
}
