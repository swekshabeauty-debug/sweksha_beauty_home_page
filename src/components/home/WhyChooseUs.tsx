'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HandPlatter, ShieldCheck, Crown } from 'lucide-react';

interface WhyChooseUsProps {
    activeBannerOffer: any;
}

export default function WhyChooseUs({ activeBannerOffer }: WhyChooseUsProps) {
    const features = [
        { title: 'Experienced Professionals', icon: HandPlatter, desc: 'Trained beauticians' },
        { title: 'Hygienic & Safe', icon: ShieldCheck, desc: 'Clean environment' },
        { title: 'Premium Products', icon: Crown, desc: 'Top quality brands' },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="py-10 md:py-16 px-4 bg-brand-secondary/30"
        >
            <div className="container mx-auto max-w-6xl">
                <h2 className="heading-elegant text-2xl sm:text-3xl md:text-4xl text-foreground mb-8 md:mb-10 text-center">
                    Why Choose Us
                </h2>

                {/* Offer Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative bg-gradient-to-r from-brand-primary to-brand-accent rounded-2xl p-5 sm:p-6 md:p-8 mb-10 md:mb-14 text-white text-center overflow-hidden shadow-lg animate-pulse-glow"
                >
                    <div className="absolute inset-0 opacity-20">
                        <Sparkles className="w-full h-full" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold relative z-10 uppercase tracking-wider">
                        {activeBannerOffer.title}
                    </h3>
                    <p className="text-sm md:text-base opacity-90 relative z-10 mt-2">
                        {activeBannerOffer.details}
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl glass flex items-center justify-center text-brand-primary shadow-md"
                                >
                                    <Icon className="w-8 h-8 md:w-10 md:h-10" />
                                </motion.div>
                                <div>
                                    <h4 className="text-foreground font-semibold text-base md:text-lg">
                                        {feature.title}
                                    </h4>
                                    <p className="text-muted text-sm mt-1">{feature.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
