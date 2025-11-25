import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

export async function readJSON<T>(filename: string): Promise<T> {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        throw new Error(`Failed to read data from ${filename}`);
    }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(DATA_DIR, filename);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        throw new Error(`Failed to write data to ${filename}`);
    }
}

// Typed helpers for specific files
export const getSettings = () => readJSON<any>('settings.json');
export const saveSettings = (data: any) => writeJSON('settings.json', data);

export const getServices = () => readJSON<any[]>('services.json');
export const saveServices = (data: any[]) => writeJSON('services.json', data);

export const getPackages = () => readJSON<any[]>('packages.json');
export const savePackages = (data: any[]) => writeJSON('packages.json', data);

export const getOffers = () => readJSON<any[]>('offers.json');
export const saveOffers = (data: any[]) => writeJSON('offers.json', data);

export const getBookings = () => readJSON<any[]>('bookings.json');
export const saveBookings = (data: any[]) => writeJSON('bookings.json', data);

export const getReviews = () => readJSON<any[]>('reviews.json');
export const saveReviews = (data: any[]) => writeJSON('reviews.json', data);

export const getTeam = () => readJSON<any[]>('team.json');
export const saveTeam = (data: any[]) => writeJSON('team.json', data);

export const getGallery = () => readJSON<any[]>('gallery.json');
export const saveGallery = (data: any[]) => writeJSON('gallery.json', data);

export const getContent = () => readJSON<any>('content.json');
export const saveContent = (data: any) => writeJSON('content.json', data);
