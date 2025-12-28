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
        setMounted(true);

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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[100] max-w-md w-full"
                    >
                        <div className="relative bg-gradient-to-br from-brand-primary via-rose-500 to-brand-accent rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="relative z-10 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                                >
                                    <Gift className="w-8 h-8" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {popupOffer.discountPercent && (
                                        <p className="text-4xl font-bold mb-2">{popupOffer.discountPercent}% OFF</p>
                                    )}
                                    <h2 className="text-xl sm:text-2xl font-bold mb-2 heading-elegant">{popupOffer.title}</h2>
                                    {popupOffer.serviceName && (
                                        <p className="bg-white/20 inline-block px-3 py-1 rounded-full text-sm mb-2">
                                            on {popupOffer.serviceName}
                                        </p>
                                    )}
                                    <p className="text-white/90 mb-3">{popupOffer.details}</p>
                                    {popupOffer.validity && (
                                        <p className="text-xs text-white/70 mb-4">Valid till: {popupOffer.validity}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col sm:flex-row gap-3 justify-center"
                                >
                                    <Link
                                        href={buildBookingUrl()}
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition shadow-lg"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Book Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/80 text-sm hover:text-white transition py-2"
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
