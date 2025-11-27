import { getServices } from '@/lib/db';
import { Clock, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedServices from '@/components/AnimatedServices';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Services',
    description: 'Explore our wide range of beauty services including facials, waxing, hair spa, and bridal makeup at Sweksha Beauty.',
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    const services = await getServices();

    return (
        <div className="bg-brand-bg min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white pt-8 pb-4 px-4 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto max-w-md flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-serif text-gray-900 italic">Our Services</h1>
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="container mx-auto max-w-md px-4 mt-6">
                {/* Promotional Banner */}
                <div className="bg-brand-primary/20 rounded-full py-3 px-4 text-center mb-8">
                    <p className="text-gray-800 font-medium text-sm italic">
                        Unlock Your Radiance – Special Offers Available!
                    </p>
                </div>

                {/* Services List */}
                {/* Services List */}
                <AnimatedServices services={services} />

                {/* Bottom Disclaimer */}
                <p className="text-center text-xs text-gray-400 mt-8 mb-24">
                    All prices are indicative. Please ask for final quotes. Offers subject to change.
                </p>
            </div>

            {/* Fixed Book Now Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                <div className="container mx-auto max-w-md">
                    <Link
                        href="/booking"
                        className="block w-full bg-brand-primary text-white text-center py-3 rounded-full font-bold text-lg hover:opacity-90 transition shadow-lg"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
