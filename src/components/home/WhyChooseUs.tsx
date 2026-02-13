'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HandPlatter, ShieldCheck, Crown } from 'lucide-react';

interface WhyChooseUsProps {
    activeBannerOffer: any;
}

export default function WhyChooseUs({ activeBannerOffer }: WhyChooseUsProps) {
    const features = [
        { title: 'Experienced Professionals', icon: HandPlatter, desc: 'Trained beauticians dedicated to your care' },
        { title: 'Hygienic & Safe', icon: ShieldCheck, desc: 'Sanitized environment and sterile tools' },
        { title: 'Premium Products', icon: Crown, desc: 'Top quality international brands tailored for you' },
    ];

    return (
        <section className="py-10 md:py-16 px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-bg to-white dark:from-black dark:to-gray-900 -z-20" />
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="heading-elegant text-3xl md:text-5xl text-foreground mb-4">
                        Why Choose Us
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent mx-auto opacity-70" />
                </motion.div>

                {/* Offer Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative bg-gradient-to-r from-brand-primary via-[#D4A373] to-brand-accent rounded-3xl p-6 sm:p-8 md:p-10 mb-16 text-white text-center overflow-hidden shadow-elegant group"
                >
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                        <Sparkles className="w-full h-full animate-pulse-glow" />
                    </div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-highlight/20 rounded-full blur-2xl" />

                    <h3 className="text-xl sm:text-2xl md:text-4xl font-serif font-bold relative z-10 uppercase tracking-widest mb-3 drop-shadow-sm">
                        {activeBannerOffer.title}
                    </h3>
                    <p className="text-base md:text-lg opacity-95 relative z-10 font-medium tracking-wide">
                        {activeBannerOffer.details}
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-2xl md:rounded-3xl transform group-hover:scale-105 transition-transform duration-500" />
                                <div className="relative h-full glass dark:glass-dark p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/40 dark:border-white/5 shadow-soft hover:shadow-elegant transition-all duration-300 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-bg dark:bg-white/5 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                                        <Icon className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <h4 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-brand-primary transition-colors">
                                        {feature.title}
                                    </h4>
                                    <p className="text-muted text-sm md:text-base leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
