import { getPackages } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import AnimatedPackages from '@/components/AnimatedPackages';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Special Packages',
    description: 'Discover our curated beauty packages for bridal, party wear, and complete makeovers at Sweksha Beauty.',
};

export default async function PackagesPage() {
    const packages = await getPackages();
    const activePackages = packages.filter((p: any) => p.active);

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-brand-bg py-16 text-center">
                <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">Special Packages</h1>
                <p className="text-gray-600 max-w-2xl mx-auto px-4">
                    Curated combinations for complete pampering and savings.
                </p>
            </div>

            <div className="container mx-auto px-4 py-16">
                <AnimatedPackages packages={activePackages} />
            </div>
        </div>
    );
}
