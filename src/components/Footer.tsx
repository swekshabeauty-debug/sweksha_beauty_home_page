import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/images/logo.jpg"
                                alt="Sweksha Beauty"
                                width={180}
                                height={60}
                                className="h-12 w-auto object-contain brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Your go-to parlour for glow, gloss, and confidence. Premium beauty services with hygiene and care.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://instagram.com/sweksha_beauty"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full glass flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/about', label: 'About Us' },
                                { href: '/services', label: 'Services' },
                                { href: '/packages', label: 'Packages' },
                                { href: '/gallery', label: 'Gallery' },
                                { href: '/contact', label: 'Contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-brand-primary transition-colors duration-300 hover:pl-2"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-brand-primary" />
                                </div>
                                <span className="leading-relaxed">Main Market, Haveli Kharagpur, Munger, Bihar 811213</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-brand-primary" />
                                </div>
                                <a href="tel:+919065347011" className="hover:text-brand-primary transition">+91 9065347011</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-brand-primary" />
                                </div>
                                <a href="mailto:swekshabeauty@gmail.com" className="hover:text-brand-primary transition">swekshabeauty@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Opening Hours</h4>
                        <ul className="space-y-2 text-sm text-gray-400 mb-6">
                            <li className="flex justify-between">
                                <span>Mon - Sun</span>
                                <span className="text-brand-primary font-medium">10:00 AM – 7:30 PM</span>
                            </li>
                        </ul>
                        <div className="glass p-4 rounded-xl">
                            <p className="font-semibold text-brand-primary mb-1 text-sm">Payment Methods</p>
                            <p className="text-gray-400 text-xs">Cash & UPI accepted at parlour</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Sweksha Beauty. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600">
                        Crafted with <span className="text-brand-primary">♥</span> for beauty lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
