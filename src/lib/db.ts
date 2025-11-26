import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

// Helper to read a single document (like settings.json)
async function readDocument<T>(collectionName: string, docId: string): Promise<T> {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as T;
        }
        // If document doesn't exist, return empty object or default
        return {} as T;
    } catch (error) {
        console.error(`Error reading ${collectionName}/${docId}:`, error);
        return {} as T;
    }
}

// Helper to write a single document
async function writeDocument<T>(collectionName: string, docId: string, data: T): Promise<void> {
    try {
        await setDoc(doc(db, collectionName, docId), data as any);
    } catch (error) {
        console.error(`Error writing ${collectionName}/${docId}:`, error);
        throw new Error(`Failed to write data to ${collectionName}`);
    }
}

// Helper to read a collection as an array (like services.json)
// Note: In Firestore, we will store the array inside a single document for simplicity 
// to match the previous JSON structure, OR we could use a real collection.
// For easiest migration from JSON files, we will store the entire JSON content 
// as a single document in a 'data' collection.
// e.g. collection 'data', doc 'services' -> { list: [...] }

async function readList<T>(docId: string): Promise<T[]> {
    try {
        const docRef = doc(db, 'data', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return (docSnap.data().list || []) as T[];
        }
        return [];
    } catch (error) {
        console.error(`Error reading list ${docId}:`, error);
        return [];
    }
}

async function writeList<T>(docId: string, list: T[]): Promise<void> {
    try {
        await setDoc(doc(db, 'data', docId), { list });
    } catch (error) {
        console.error(`Error writing list ${docId}:`, error);
        throw new Error(`Failed to write list to ${docId}`);
    }
}

// Typed helpers for specific data
// We map each JSON file to a document in the 'data' collection

export const getSettings = () => readDocument<any>('data', 'settings');
export const saveSettings = (data: any) => writeDocument('data', 'settings', data);

export const getServices = () => readList<any>('services');
export const saveServices = (data: any[]) => writeList('services', data);

export const getPackages = () => readList<any>('packages');
export const savePackages = (data: any[]) => writeList('packages', data);

export const getOffers = () => readList<any>('offers');
export const saveOffers = (data: any[]) => writeList('offers', data);

export const getBookings = () => readList<any>('bookings');
export const saveBookings = (data: any[]) => writeList('bookings', data);

export const getReviews = () => readList<any>('reviews');
export const saveReviews = (data: any[]) => writeList('reviews', data);

export const getTeam = () => readList<any>('team');
export const saveTeam = (data: any[]) => writeList('team', data);

export const getGallery = () => readList<any>('gallery');
export const saveGallery = (data: any[]) => writeList('gallery', data);

export const getContent = () => readDocument<any>('data', 'content');
export const saveContent = (data: any) => writeDocument('data', 'content', data);
