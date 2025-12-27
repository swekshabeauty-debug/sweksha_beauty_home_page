import { createBooking } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendAdminBookingAlert } from '@/lib/notifications';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, serviceCategory, service, price, package: pkg, date, time, notes } = body;

        // Validation
        if (!name || !phone || (!service && !pkg) || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate 10-digit phone number
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json({
                error: 'Invalid phone number. Please enter a valid 10-digit mobile number starting with 6-9.'
            }, { status: 400 });
        }

        const newBooking = {
            id: uuidv4(),
            name,
            email,
            phone,
            serviceCategory: serviceCategory || null,
            service: service || 'Package Booking',
            price: price || 0,
            package: pkg || null,
            date,
            time,
            notes: notes || '',
            status: 'New',
            paymentStatus: 'pending',
            paymentMethod: 'cash',
            createdAt: new Date().toISOString(),
        };

        // Add to database
        let bookingId = newBooking.id;
        try {
            await createBooking(newBooking);
        } catch (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ error: 'Failed to save booking to database' }, { status: 500 });
        }

        // Send email notification to admin
        try {
            await sendAdminBookingAlert(newBooking);
            console.log('✅ Admin notification sent for booking:', newBooking.id);
        } catch (emailError) {
            console.error('⚠️ Failed to send email notification:', emailError);
            // Don't fail the booking if email fails
        }

        return NextResponse.json({ success: true, bookingId: newBooking.id });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
