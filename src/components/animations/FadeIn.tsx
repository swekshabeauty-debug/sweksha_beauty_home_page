'use client';

import { motion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    width?: "100%" | "fit-content";
    delay?: number;
    className?: string;
}

export default function FadeIn({ children, width = "100%", delay = 0, className = "" }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} // Small Y offset for mobile friendliness (less jumpy)
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }} // Triggers when 10% in view. Once=true prevents jitter on scroll up
            transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            style={{ width }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
