import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;

    try {
        let data;
        switch (type) {
            case 'services': data = await db.getServices(); break;
            case 'packages': data = await db.getPackages(); break;
            case 'offers': data = await db.getOffers(); break;
            case 'bookings': data = await db.getBookings(); break;
            case 'reviews': data = await db.getReviews(); break;
            case 'team': data = await db.getTeam(); break;
            case 'gallery': data = await db.getGallery(); break;
            case 'content': data = await db.getContent(); break;
            case 'settings': data = await db.getSettings(); break;
            case 'faq': data = await db.getFAQ(); break;
            default: return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;
    const body = await request.json();

    try {
        switch (type) {
            case 'services': await db.saveServices(body); break;
            case 'packages': await db.savePackages(body); break;
            case 'offers': await db.saveOffers(body); break;
            case 'bookings': await db.saveBookings(body); break;
            case 'reviews': await db.saveReviews(body); break;
            case 'team': await db.saveTeam(body); break;
            case 'gallery': await db.saveGallery(body); break;
            case 'content': await db.saveContent(body); break;
            case 'settings': await db.saveSettings(body); break;
            case 'faq': await db.saveFAQ(body); break;
            default: return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
