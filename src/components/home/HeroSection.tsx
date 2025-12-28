'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import AskSwekshaChat from '@/components/AskSwekshaChat';

interface HeroSectionProps {
    content: any;
}

export default function HeroSection({ content }: HeroSectionProps) {
    return (
        <section className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] xl:h-[700px] w-full overflow-hidden">
            {/* Animated Background Image with Ken Burns Effect */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{
                    scale: [1.1, 1, 1.05],
                    opacity: 1
                }}
                transition={{
                    scale: {
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    },
                    opacity: {
                        duration: 1.5,
                        ease: "easeOut"
                    }
                }}
            >
                <Image
                    src={content?.home?.heroImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
                    alt="Sweksha Beauty Hero"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
            </motion.div>

            {/* Animated Gradient Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            ></motion.div>

            {/* Floating Particles/Sparkles Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Particles />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold font-serif mb-2 drop-shadow-md"
                >
                    Sweksha Beauty
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl font-medium mb-8 opacity-90"
                >
                    – Radiance Awaits You
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/booking"
                        className="btn-premium shimmer"
                    >
                        Book Appointment
                    </Link>
                    <a
                        href="tel:+919065347011"
                        className="glass text-white px-8 py-3 rounded-full font-medium transition hover:bg-white/20 flex items-center justify-center gap-2"
                    >
                        Call Now <Phone className="w-4 h-4" />
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-6 w-full sm:w-auto"
                >
                    <AskSwekshaChat
                        customTrigger={
                            <button className="w-full sm:w-auto bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white px-6 py-3 sm:py-2 rounded-full font-medium transition shadow-lg flex items-center justify-center gap-2 group">
                                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
                                Ask Sweksha AI Assistant
                            </button>
                        }
                    />
                </motion.div>
            </div>
        </section>
    );
}

function Particles() {
    const [particles, setParticles] = React.useState<Array<{ left: string; top: string; duration: number; delay: number }>>([]);

    React.useEffect(() => {
        const newParticles = [...Array(15)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <>
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    style={{ left: p.left, top: p.top }}
                    animate={{
                        y: [-20, -100],
                        opacity: [0, 1, 0],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </>
    );
}
