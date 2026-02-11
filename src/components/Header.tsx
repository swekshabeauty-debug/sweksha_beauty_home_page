'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Instagram, LogOut, User, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Packages', href: '/packages' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Reviews', href: '/reviews' },
        { name: 'Contact', href: '/contact' },
    ];

    // Check system theme preference
    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(darkModeQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        darkModeQuery.addEventListener('change', handler);
        return () => darkModeQuery.removeEventListener('change', handler);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 safe-area-top ${scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-xl'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
            } border-b border-brand-primary/10`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary tracking-wide">
                            Sweksha Beauty
                        </span>
                    </motion.div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative text-sm xl:text-base font-medium transition-colors hover:text-brand-primary ${pathname === link.href
                                ? 'text-brand-primary'
                                : 'text-foreground/70'
                                }`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
                                />
                            )}
                        </Link>
                    ))}

                    <a
                        href="https://instagram.com/sweksha_beauty"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:scale-110 transition-transform"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>

                    {/* User Profile / Sign In */}
                    {session ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-foreground/10">
                            {session.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border-2 border-brand-primary/30" />
                            ) : (
                                <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold text-sm">
                                    {session.user?.name?.[0] || <User className="w-4 h-4" />}
                                </div>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="text-foreground/50 hover:text-red-500 transition"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="text-sm font-medium text-foreground/70 hover:text-brand-primary transition"
                        >
                            Sign In
                        </button>
                    )}

                    <Link
                        href="/booking"
                        className="btn-premium text-sm px-5 py-2.5"
                    >
                        Book Appointment
                    </Link>
                </nav>

                {/* Mobile Controls */}
                <div className="flex items-center gap-2 lg:hidden">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full text-foreground/70 hover:bg-brand-primary/10 transition"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Menu"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="lg:hidden bg-background border-t border-foreground/5 overflow-hidden"
                    >
                        <nav className="flex flex-col p-5 space-y-1 safe-area-bottom">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block py-3 px-4 rounded-xl text-base font-medium transition-all ${pathname === link.href
                                            ? 'bg-brand-primary/10 text-brand-primary'
                                            : 'text-foreground/70 active:bg-foreground/5'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="border-t border-foreground/10 pt-4 mt-4 space-y-3"
                            >
                                {session ? (
                                    <div className="flex items-center justify-between px-4 py-3 bg-foreground/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            {session.user?.image ? (
                                                <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold">
                                                    {session.user?.name?.[0] || 'U'}
                                                </div>
                                            )}
                                            <span className="font-medium text-foreground">{session.user?.name}</span>
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-sm text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => signIn('google')}
                                        className="w-full text-left py-3 px-4 font-medium text-foreground/70 active:bg-foreground/5 rounded-xl transition"
                                    >
                                        Sign In with Google
                                    </button>
                                )}

                                <a
                                    href="https://instagram.com/sweksha_beauty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 py-3 px-4 text-brand-primary font-medium rounded-xl active:bg-brand-primary/5 transition"
                                >
                                    <Instagram className="w-5 h-5" />
                                    Follow on Instagram
                                </a>

                                <Link
                                    href="/booking"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full btn-premium text-center py-4"
                                >
                                    Book Appointment
                                </Link>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
