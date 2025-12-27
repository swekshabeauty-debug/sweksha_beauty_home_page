'use client';

import React from 'react';
import Link from 'next/link';
import { Flower2, Package, Image as ImageIcon, MessageCircle, Mail, Info } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function QuickLinks() {
    return (
        <section className="py-8 sm:py-12 -mt-12 sm:-mt-16 relative z-20">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-6 sm:overflow-visible scrollbar-hide">
                    {[
                        { name: 'Services', icon: Flower2, href: '/services' },
                        { name: 'Packages', icon: Package, href: '/packages' },
                        { name: 'Gallery', icon: ImageIcon, href: '/gallery' },
                        { name: 'Reviews', icon: MessageCircle, href: '/reviews' },
                        { name: 'Contact', icon: Mail, href: '/contact' },
                        { name: 'About', icon: Info, href: '/about' },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <FadeIn
                                key={i}
                                delay={i * 0.1}
                                className="snap-center shrink-0 w-28 sm:w-auto"
                                width="fit-content"
                            >
                                <Link
                                    href={item.href}
                                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition flex flex-col items-center text-center gap-2 sm:gap-3 group h-full justify-center w-full"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-bg dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-secondary/20 transition">
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm">{item.name}</span>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
