'use client';

import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Offer {
    id: string;
    title: string;
    details: string;
    validity?: string;
    type: 'popup' | 'banner';
    active: boolean;
    serviceCategory?: string;
    serviceName?: string;
    discountPercent?: number;
}

interface OfferBannerProps {
    offer: Offer | null;
}

export default function OfferBanner({ offer }: OfferBannerProps) {
    const [isDismissed, setIsDismissed] = useState(false);

    if (!offer || isDismissed) return null;

    // Build booking URL with service + discount
    const buildBookingUrl = () => {
        const params = new URLSearchParams();
        params.set('offer', offer.title);
        if (offer.serviceName) {
            params.set('service', offer.serviceName);
        }
        if (offer.discountPercent) {
            params.set('discount', offer.discountPercent.toString());
        }
        return `/booking?${params.toString()}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-brand-primary via-rose-500 to-brand-accent text-white relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 py-3 relative z-10">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Sparkles className="w-4 h-4 animate-pulse hidden sm:block" />
                    <Link
                        href={buildBookingUrl()}
                        className="flex items-center gap-2 group"
                    >
                        {offer.discountPercent && (
                            <span className="bg-white text-brand-primary px-2 py-0.5 rounded-full text-xs font-bold">
                                {offer.discountPercent}% OFF
                            </span>
                        )}
                        <span className="font-bold text-sm sm:text-base">{offer.title}</span>
                        {offer.serviceName && (
                            <span className="hidden sm:inline text-white/80 text-sm">on {offer.serviceName}</span>
                        )}
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium group-hover:bg-white group-hover:text-brand-primary transition-all">
                            Book Now →
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
