'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface Package {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: string;
    services: string[];
    active: boolean;
    image?: string;
    tag?: string;
}

export default function AnimatedPackages({ packages }: { packages: Package[] }) {
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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {packages.map((pkg) => (
                <motion.div
                    key={pkg.id}
                    variants={item}
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl"
                >
                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                        {pkg.image ? (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full relative"
                            >
                                <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                            </motion.div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                        )}
                        {pkg.tag && (
                            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                {pkg.tag}
                            </span>
                        )}
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                        <p className="text-gray-600 text-sm mb-6">{pkg.description}</p>

                        <div className="mb-6 flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Includes:</h4>
                            <ul className="space-y-2">
                                {Array.isArray(pkg.services) && pkg.services.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="text-3xl font-bold text-brand-primary">₹{pkg.price}</span>
                                    <p className="text-xs text-gray-400">{pkg.duration}</p>
                                </div>
                            </div>
                            <Link
                                href={`/booking?package=${encodeURIComponent(pkg.name)}`}
                                className="block w-full bg-gray-900 text-white text-center py-3 rounded-xl font-medium hover:bg-gray-800 transition transform active:scale-95"
                            >
                                Book This Package
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
