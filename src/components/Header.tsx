'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Instagram, LogOut, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
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

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-brand-secondary/20">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 flex justify-between items-center">
                {/* Logo - Responsive Size */}
                {/* Logo - Responsive Size */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/logo.jpg"
                        alt="Sweksha Beauty"
                        width={180}
                        height={60}
                        className="h-12 sm:h-14 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop/Tablet Nav */}
                <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm lg:text-base font-medium transition-colors hover:text-brand-primary ${pathname === link.href ? 'text-brand-primary' : 'text-gray-600'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <a
                        href="https://instagram.com/sweksha_beauty"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:text-brand-primary/80"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>

                    {/* User Profile / Sign In */}
                    {session ? (
                        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                            {session.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
                            ) : (
                                <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold">
                                    {session.user?.name?.[0] || <User className="w-4 h-4" />}
                                </div>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="text-gray-400 hover:text-red-500 transition"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="text-sm font-medium text-gray-600 hover:text-brand-primary"
                        >
                            Sign In
                        </button>
                    )}

                    <Link
                        href="/booking"
                        className="bg-brand-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition shadow-md hover:shadow-lg"
                    >
                        Book Appointment
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-700 p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <nav className="flex flex-col p-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-base font-medium ${pathname === link.href ? 'text-brand-primary' : 'text-gray-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
                            {session ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold">
                                                {session.user?.name?.[0] || 'U'}
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-900">{session.user?.name}</span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-sm text-red-500 font-medium"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className="text-left font-medium text-gray-600 hover:text-brand-primary"
                                >
                                    Sign In with Google
                                </button>
                            )}

                            <a
                                href="https://instagram.com/sweksha_beauty"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-brand-primary font-medium"
                            >
                                <Instagram className="w-5 h-5" /> Follow on Instagram
                            </a>
                            <Link
                                href="/booking"
                                className="bg-brand-primary text-white px-5 py-3 rounded-lg text-center font-medium hover:opacity-90 transition"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
