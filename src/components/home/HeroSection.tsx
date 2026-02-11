

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import AskSwekshaChat from '@/components/AskSwekshaChat';

interface HeroSectionProps {
    content: any;
}

export default function HeroSection({ content }: HeroSectionProps) {
    const containerRef = React.useRef<HTMLElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [images, setImages] = React.useState<HTMLImageElement[]>([]);

    // Image Sequence Configuration
    const frameCount = 80;

    // Scroll Hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const smoothScroll = useSpring(scrollYProgress, {
        damping: 20,
        stiffness: 100,
        restDelta: 0.001
    });

    // Map scroll progress (0 to 1) to frame index (0 to 79)
    const frameIndex = useTransform(smoothScroll, [0, 1], [0, frameCount - 1]);

    // Parallax effect: Move canvas slower than scroll
    const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    // Helper to format frame number
    const getFramePath = (index: number) =>
        `/images/hero-sequence/hero_seq_${index.toString().padStart(3, '0')}.jpg`;

    // Preload Images
    React.useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        const handleImageLoad = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                setIsLoading(false);
            }
        };

        for (let i = 0; i < frameCount; i++) {
            const img = new window.Image();
            img.src = getFramePath(i);
            img.onload = handleImageLoad;
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    // Draw frame on canvas
    const drawFrame = React.useCallback((index: number) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        const img = images[index];

        if (!canvas || !context || !img || !img.complete) return;

        // Resize canvas if needed
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        // object-cover logic
        if (canvasRatio > imgRatio) {
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        // Apply slight brightness filter
        context.filter = 'brightness(0.75)';
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        context.filter = 'none';

    }, [images]);

    // Initial draw when loading finishes
    React.useEffect(() => {
        if (!isLoading && images.length > 0) {
            drawFrame(0);
        }
    }, [isLoading, images, drawFrame]);

    // Update frame on scroll
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const index = Math.round(latest);
        if (images[index]) {
            drawFrame(index);
        }
    });

    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            if (!isLoading && images.length > 0) {
                drawFrame(Math.round(frameIndex.get()));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoading, images, drawFrame, frameIndex]);

    return (
        <section
            ref={containerRef}
            className="relative h-[200vh] w-full"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Canvas Image Sequence Player */}
                <motion.div
                    style={{ y: yParallax }}
                    className="absolute inset-0 w-full h-full"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Fallback/Loading Image - First frame */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                    <Image
                        src="/images/hero-sequence/hero_seq_000.jpg"
                        alt="Sweksha Beauty Hero"
                        fill
                        className="object-cover brightness-75"
                        priority
                    />
                </div>

                {/* Animated Gradient Overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"
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
                        className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
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
                        className="mt-6 w-full sm:w-auto pointer-events-auto"
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
