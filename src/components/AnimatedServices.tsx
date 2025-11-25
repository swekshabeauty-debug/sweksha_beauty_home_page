'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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

export default function AnimatedServices({ services }: { services: ServiceCategory[] }) {
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

    return (
        <div className="space-y-8">
            {services.map((category) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{category.name}</h2>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        {category.services.filter((s) => s.active).map((service) => (
                            <motion.div key={service.id} variants={item}>
                                <Link
                                    href={`/booking?service=${encodeURIComponent(service.name)}`}
                                    className="block"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center transition cursor-pointer border border-transparent hover:border-brand-primary/20"
                                    >
                                        {/* Service Image Placeholder */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden relative">
                                            <Image
                                                src={service.image || "/images/hero-placeholder.jpg"}
                                                alt={service.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight mb-1">{service.name}</h3>
                                                    <p className="text-gray-500 text-xs line-clamp-2">{service.description}</p>
                                                </div>
                                                <div className="text-right shrink-0 ml-2">
                                                    <span className="block font-bold text-gray-900">₹{service.price}</span>
                                                    <span className="text-[10px] text-gray-400 block">{service.duration}</span>
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
    );
}
