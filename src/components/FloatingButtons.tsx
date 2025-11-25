'use client';

import { Phone } from 'lucide-react';

export default function FloatingButtons() {
    return (
        <>


            {/* Sticky Call Button (Mobile Only) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 lg:hidden z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Need an appointment?</p>
                    <p className="text-xs text-gray-500">Call us now</p>
                </div>
                <a
                    href="tel:+919065347011"
                    className="bg-brand-primary text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition"
                >
                    <Phone className="w-4 h-4" /> Call Now
                </a>
            </div>
        </>
    );
}
