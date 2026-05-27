'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

interface OfferPopupProps {
    offers: Offer[];
}

export default function OfferPopup({ offers }: OfferPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Find active popup offer
    const popupOffer = offers.find(o => o.active && o.type === 'popup');

    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));

        // Only show popup if there's an active popup offer
        if (!popupOffer) return;

        // Check if user has already seen popup in this session
        const hasSeenPopup = sessionStorage.getItem('hasSeenOfferPopup');

        if (!hasSeenPopup) {
            // Delay showing popup for better UX
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenOfferPopup', 'true');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [popupOffer]);

    if (!mounted || !popupOffer) return null;

    // Build booking URL with service + discount
    const buildBookingUrl = () => {
        const params = new URLSearchParams();
        params.set('offer', popupOffer.title);
        if (popupOffer.serviceName) {
            params.set('service', popupOffer.serviceName);
        }
        if (popupOffer.discountPercent) {
            params.set('discount', popupOffer.discountPercent.toString());
        }
        return `/booking?${params.toString()}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/55 backdrop-blur-md z-[99]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 32 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 32 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 360 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="offer-popup-title"
                        className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 z-[100] w-full sm:max-w-md px-3 pb-3 sm:p-0"
                    >
                        <div className="relative max-h-[calc(100svh-1rem)] overflow-y-auto bg-[linear-gradient(145deg,var(--brand-primary),var(--brand-accent))] rounded-t-2xl sm:rounded-lg p-5 sm:p-7 text-white shadow-2xl">
                            <div className="absolute inset-x-6 top-0 h-px bg-white/45" />
                            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/35 sm:hidden" />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 transition"
                                aria-label="Close offer popup"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-white/16 rounded-lg flex items-center justify-center border border-white/20"
                                >
                                    <Gift className="w-8 h-8" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {popupOffer.discountPercent && (
                                        <p className="text-4xl sm:text-5xl font-black mb-2 leading-none">{popupOffer.discountPercent}% OFF</p>
                                    )}
                                    <h2 id="offer-popup-title" className="text-xl sm:text-2xl font-bold mb-2 heading-elegant">{popupOffer.title}</h2>
                                    {popupOffer.serviceName && (
                                        <p className="bg-white/16 inline-block px-3 py-1 rounded-full text-sm mb-3 border border-white/15">
                                            on {popupOffer.serviceName}
                                        </p>
                                    )}
                                    <p className="text-white/90 mb-3 text-sm sm:text-base leading-relaxed">{popupOffer.details}</p>
                                    {popupOffer.validity && (
                                        <p className="text-xs text-white/70 mb-4">Valid till: {popupOffer.validity}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col sm:flex-row gap-3 justify-center mt-5"
                                >
                                    <Link
                                        href={buildBookingUrl()}
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center justify-center gap-2 bg-white text-brand-accent px-6 py-3.5 sm:py-3 rounded-full font-bold hover:bg-white/90 transition shadow-lg"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Book Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/80 text-sm hover:text-white transition py-3 sm:py-2"
                                    >
                                        Maybe Later
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
