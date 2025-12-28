
import { NextResponse } from 'next/server';
import { getServices } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const services = await getServices();
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}
