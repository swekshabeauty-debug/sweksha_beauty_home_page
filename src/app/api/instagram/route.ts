
import { NextResponse } from 'next/server';
import { getGallery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const gallery = await getGallery();
        // Filter for Instagram images
        const instagramImages = gallery.filter((img: any) => img.isInstagram);
        return NextResponse.json(instagramImages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch instagram feed' }, { status: 500 });
    }
}
