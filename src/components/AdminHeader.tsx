'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const navLinks = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Services', href: '/admin/services' },
        { name: 'Bookings', href: '/admin/bookings' },
        { name: 'Packages', href: '/admin/packages' },
        { name: 'Offers', href: '/admin/offers' },
        { name: 'Gallery', href: '/admin/gallery' },
        { name: 'Reviews', href: '/admin/reviews' },
    ];

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo / Brand */}
                <div className="flex items-center gap-8">
                    <Link href="/admin/dashboard" className="text-xl font-bold font-serif text-brand-primary">
                        Sweksha Admin
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-brand-primary font-semibold'
                                        : 'text-gray-500 hover:text-brand-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side: Profile & Mobile Menu */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-gray-200">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-gray-900">Owner</span>
                            <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Logout</button>
                        </div>
                        <div className="w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center text-brand-primary">
                            <User className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
                    <nav className="flex flex-col p-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-sm font-medium ${pathname === link.href ? 'text-brand-primary' : 'text-gray-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/admin/team" className="text-sm font-medium text-gray-600">Team</Link>
                        <Link href="/admin/content" className="text-sm font-medium text-gray-600">Content</Link>
                        <Link href="/admin/settings" className="text-sm font-medium text-gray-600">Settings</Link>
                        <button onClick={handleLogout} className="text-sm font-medium text-red-500 text-left pt-2 border-t border-gray-100">
                            Logout
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}
