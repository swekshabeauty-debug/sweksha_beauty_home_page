import { NextResponse } from 'next/server';
// import { db } from '@/lib/firebase';
// import { doc, setDoc } from 'firebase/firestore';
import * as db from '@/lib/db'; // Use MongoDB adapter

// Import data directly
import services from '@/data/services.json';
import packages from '@/data/packages.json';
import offers from '@/data/offers.json';
import bookings from '@/data/bookings.json';
import reviews from '@/data/reviews.json';
import team from '@/data/team.json';
import gallery from '@/data/gallery.json';
import settings from '@/data/settings.json';
import content from '@/data/content.json';

export async function POST() {
    try {
        console.log('Starting migration to MongoDB...');

        // 1. Migrate Lists using db helper functions
        await db.saveServices(services);
        await db.savePackages(packages);
        await db.saveOffers(offers);
        await db.saveBookings(bookings);
        await db.saveReviews(reviews);
        await db.saveTeam(team);
        await db.saveGallery(gallery);
        await db.saveFAQ(require('@/data/faq.json') || []);

        // 2. Migrate Single Docs
        await db.saveSettings(settings);
        await db.saveContent(content);

        return NextResponse.json({ success: true, message: 'Migration to MongoDB completed successfully!' });
    } catch (error: any) {
        console.error('Migration failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
