
import * as admin from 'firebase-admin';
import servicesData from '@/data/services.json';

// ----------------------------------------------------------------------
// Firebase Admin Initialization
// ----------------------------------------------------------------------

const formatPrivateKey = (key: string) => {
    return key.replace(/\\n/g, '\n');
};

function getFirebaseCredentials() {
    // 1. Try Environment Variable (Best for Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } catch (e) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', e);
        }
    }

    // 2. Try Local File (Best for Local Dev)
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require('../../service-account.json');
        return serviceAccount;
    } catch (e) {
        console.warn('Local service-account.json not found.');
        return null;
    }
}

if (!admin.apps.length) {
    const credentials = getFirebaseCredentials();

    if (credentials) {
        admin.initializeApp({
            credential: admin.credential.cert(credentials),
        });
    } else {
        console.error('Firebase Admin could not be initialized. Missing credentials.');
    }
}

const db = admin.firestore();

// Helper to get list from a single doc (e.g. data/services)
async function getList(docId: string) {
    try {
        const doc = await db.collection('data').doc(docId).get();
        if (doc.exists) {
            return doc.data()?.list || [];
        }
        return [];
    } catch (e) {
        console.error(`Error fetching ${docId}:`, e);
        return [];
    }
}

// Helper to save list to a single doc
async function saveList(docId: string, list: any[]) {
    try {
        await db.collection('data').doc(docId).set({ list });
    } catch (e) {
        console.error(`Error saving ${docId}:`, e);
        throw e;
    }
}

// ----------------------------------------------------------------------
// Bookings
// ----------------------------------------------------------------------

export async function getBookings() {
    const bookings = await getList('bookings');
    // Sort logic handled in memory for list storage
    return bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBooking(data: any) {
    const newBooking = {
        ...data,
        id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
    };

    // Use arrayUnion for atomic add if possible, but 'list' implies strict order/structure? 
    // Let's use arrayUnion to be safe.
    await db.collection('data').doc('bookings').update({
        list: admin.firestore.FieldValue.arrayUnion(newBooking)
    }).catch(async (e) => {
        // If doc doesn't exist, create it
        if (e.code === 5) { // NOT_FOUND
            await db.collection('data').doc('bookings').set({ list: [newBooking] });
        } else {
            throw e;
        }
    });

    return newBooking;
}

export async function updateBooking(id: string, data: any) {
    // This is expensive with the "List in Doc" pattern (Read -> Modify -> Write)
    // But acceptable for low volume.
    const bookings = await getList('bookings');
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index !== -1) {
        const updated = { ...bookings[index], ...data };
        bookings[index] = updated;
        await saveList('bookings', bookings);
        return updated;
    }
    return null;
}

/**
 * @deprecated
 */
export async function saveBookings(data: any[]) {
    await saveList('bookings', data);
}

// ----------------------------------------------------------------------
// Services
// ----------------------------------------------------------------------

export async function getServices() {
    return servicesData;
}

export async function saveServices(data: any[]) {
    await saveList('services', data);
}

// ----------------------------------------------------------------------
// Packages
// ----------------------------------------------------------------------

export async function getPackages() {
    return await getList('packages');
}

export async function savePackages(data: any[]) {
    await saveList('packages', data);
}

// ----------------------------------------------------------------------
// Offers
// ----------------------------------------------------------------------

export async function getOffers() {
    return await getList('offers');
}

export async function saveOffers(data: any[]) {
    await saveList('offers', data);
}

// ----------------------------------------------------------------------
// Reviews
// ----------------------------------------------------------------------

export async function getReviews() {
    return await getList('reviews');
}

export async function saveReviews(data: any[]) {
    await saveList('reviews', data);
}

// ----------------------------------------------------------------------
// Team
// ----------------------------------------------------------------------

export async function getTeam() {
    return await getList('team');
}

export async function saveTeam(data: any[]) {
    await saveList('team', data);
}

// ----------------------------------------------------------------------
// Gallery
// ----------------------------------------------------------------------

export async function getGallery() {
    return await getList('gallery');
}

export async function saveGallery(data: any[]) {
    await saveList('gallery', data);
}

// ----------------------------------------------------------------------
// FAQ
// ----------------------------------------------------------------------

export async function getFAQ() {
    return await getList('faq');
}

export async function saveFAQ(data: any[]) {
    await saveList('faq', data);
}

// ----------------------------------------------------------------------
// Settings & Content (Single Documents)
// ----------------------------------------------------------------------

export async function getSettings() {
    try {
        const doc = await db.collection('data').doc('settings').get();
        return doc.exists ? doc.data() : {};
    } catch (e) {
        return {};
    }
}

export async function saveSettings(data: any) {
    await db.collection('data').doc('settings').set(data, { merge: true });
}

// Default Content
const DEFAULT_CONTENT = {
    home: {
        heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        subtitle: '– Radiance Awaits You',
        highlights: [
            'Experienced beauticians',
            'Hygienic & comfortable ambience',
            'Quality products only'
        ]
    },
    about: {
        title: 'Experience Beauty & Relaxation',
        description: 'At Sweksha Beauty, we believe that beauty is not just about looking good, but feeling good. Our expert team is dedicated to providing you with the best services in a hygienic and relaxing environment.',
        image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        values: [
            'Customer Satisfaction First',
            'Premium Quality Products',
            'Hygiene & Safety Standards',
            'Experienced Professionals'
        ]
    },
    contact: {
        email: 'info@swekshabeauty.com',
        phone: '+919065347011',
        address: 'Main Market, Haveli Kharagpur, Bihar 811213'
    }
};

export async function getContent() {
    try {
        const doc = await db.collection('data').doc('content').get();
        if (doc.exists) {
            return { ...DEFAULT_CONTENT, ...doc.data() };
        }
        return DEFAULT_CONTENT;
    } catch (e) {
        return DEFAULT_CONTENT;
    }
}

export async function saveContent(data: any) {
    await db.collection('data').doc('content').set(data, { merge: true });
}
