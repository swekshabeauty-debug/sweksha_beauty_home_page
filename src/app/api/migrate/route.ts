import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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
        console.log('Starting migration via API...');

        // 1. Migrate Lists
        await setDoc(doc(db, 'data', 'services'), { list: services });
        await setDoc(doc(db, 'data', 'packages'), { list: packages });
        await setDoc(doc(db, 'data', 'offers'), { list: offers });
        await setDoc(doc(db, 'data', 'bookings'), { list: bookings });
        await setDoc(doc(db, 'data', 'reviews'), { list: reviews });
        await setDoc(doc(db, 'data', 'team'), { list: team });
        await setDoc(doc(db, 'data', 'gallery'), { list: gallery });

        // 2. Migrate Single Docs
        await setDoc(doc(db, 'data', 'settings'), settings);
        await setDoc(doc(db, 'data', 'content'), content);

        return NextResponse.json({ success: true, message: 'Migration completed successfully!' });
    } catch (error: any) {
        console.error('Migration failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
