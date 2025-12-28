
import { NextResponse } from 'next/server';
import * as db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to fetch something simple
        const services = await db.getServices();
        const content = await db.getContent();

        return NextResponse.json({
            status: "Connected to Firebase",
            servicesCount: services.length,
            contentLoaded: !!content,
            message: "Data layer is working!"
        });

    } catch (e: any) {
        return NextResponse.json({
            status: "Error",
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
