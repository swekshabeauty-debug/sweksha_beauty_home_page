'use client';

import React from 'react';
import { Sparkles, HandPlatter, ShieldCheck, Crown } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface WhyChooseUsProps {
    activeBannerOffer: any;
}

export default function WhyChooseUs({ activeBannerOffer }: WhyChooseUsProps) {
    return (
        <section className="py-8 sm:py-12 lg:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center font-serif">
                        Why Choose Us
                    </h2>
                </FadeIn>

                {/* Offer Banner - Responsive Padding */}
                <FadeIn delay={0.2}>
                    <div className="bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 text-white text-center relative overflow-hidden shadow-md">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <Sparkles className="w-full h-full" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold relative z-10 uppercase tracking-wide">
                            {activeBannerOffer.title}
                        </h3>
                        <p className="text-sm md:text-base opacity-90 relative z-10 mt-1">{activeBannerOffer.details}</p>
                    </div>
                </FadeIn>

                {/* Features Grid - Better Tablet Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center">
                    {[
                        { title: 'Experienced Professionals', icon: HandPlatter },
                        { title: 'Hygienic & Safe', icon: ShieldCheck },
                        { title: 'Premium Products', icon: Crown },
                    ].map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <FadeIn key={i} delay={i * 0.2}>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-brand-primary shadow-sm">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-gray-700 dark:text-gray-200 font-medium">{feature.title}</h4>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
