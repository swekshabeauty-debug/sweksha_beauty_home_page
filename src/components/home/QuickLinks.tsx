'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flower2, Package, Image as ImageIcon, MessageCircle, Mail, Info } from 'lucide-react';

export default function QuickLinks() {
    const links = [
        { name: 'Services', icon: Flower2, href: '/services' },
        { name: 'Packages', icon: Package, href: '/packages' },
        { name: 'Gallery', icon: ImageIcon, href: '/gallery' },
        { name: 'Reviews', icon: MessageCircle, href: '/reviews' },
        { name: 'Contact', icon: Mail, href: '/contact' },
        { name: 'About', icon: Info, href: '/about' },
    ];

    return (
        <section className="py-6 sm:py-10 -mt-8 sm:-mt-14 relative z-20">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-6 sm:overflow-visible hide-scrollbar">
                    {links.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="snap-center shrink-0 w-24 sm:w-auto"
                            >
                                <Link
                                    href={item.href}
                                    className="card-elegant p-3 sm:p-4 flex flex-col items-center text-center gap-2 sm:gap-3 group h-full justify-center w-full active:scale-95 transition-transform"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300"
                                    >
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </motion.div>
                                    <span className="text-foreground/80 font-medium text-xs sm:text-sm group-hover:text-brand-primary transition-colors">
                                        {item.name}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
