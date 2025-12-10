import Link from 'next/link';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white dark:bg-black dark:border-t dark:border-gray-800 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-brand-primary font-serif mb-3 sm:mb-4">Sweksha Beauty</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Your go-to parlour for glow, gloss, and confidence. We provide premium beauty services with hygiene and care.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/sweksha_beauty" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-white transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-brand-primary transition">Home</Link></li>
                            <li><Link href="/about" className="hover:text-brand-primary transition">About Us</Link></li>
                            <li><Link href="/services" className="hover:text-brand-primary transition">Services</Link></li>
                            <li><Link href="/packages" className="hover:text-brand-primary transition">Packages</Link></li>
                            <li><Link href="/gallery" className="hover:text-brand-primary transition">Gallery</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-primary transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                                <span>Main Market, Haveli Kharagpur, Munger, Bihar 811213</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                                <a href="tel:+919065347011" className="hover:text-white">+91 9065347011</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                                <a href="mailto:swekshabeauty@gmail.com" className="hover:text-white">swekshabeauty@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex justify-between">
                                <span>Mon - Sun</span>
                                <span>10:00 AM – 7:30 PM</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-300">
                            <p className="font-semibold text-brand-primary mb-1">Payment</p>
                            Payment accepted in parlour by Cash or UPI.
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Sweksha Beauty. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
