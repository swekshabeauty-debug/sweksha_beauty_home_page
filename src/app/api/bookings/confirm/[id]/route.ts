import { NextRequest, NextResponse } from 'next/server';
import { getBookings, saveBookings } from '@/lib/db';
import { sendCustomerConfirmation } from '@/lib/notifications';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const bookings = await getBookings();
        const booking = bookings.find((b: any) => b.id === id);

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Update booking status to confirmed
        const updatedBookings = bookings.map((b: any) =>
            b.id === id ? { ...b, status: 'Confirmed', confirmedAt: new Date().toISOString() } : b
        );

        await saveBookings(updatedBookings);

        // Send confirmation email to customer
        await sendCustomerConfirmation(booking);

        // Return a success HTML page
        return new NextResponse(
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Booking Confirmed</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #FFF3EB 0%, #FCD8B8 100%);
                    }
                    .container {
                        text-align: center;
                        background: white;
                        padding: 40px;
                        border-radius: 16px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                        max-width: 500px;
                    }
                    .success-icon {
                        font-size: 64px;
                        margin-bottom: 20px;
                    }
                    h1 {
                        color: #22c55e;
                        margin-bottom: 10px;
                    }
                    .details {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        text-align: left;
                    }
                    .detail-item {
                        margin: 10px 0;
                        font-size: 14px;
                    }
                    .label {
                        font-weight: bold;
                        color: #666;
                    }
                    .btn {
                        display: inline-block;
                        background: #F29D8D;
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 6px;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                    .btn:hover {
                        opacity: 0.9;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✅</div>
                    <h1>Booking Confirmed!</h1>
                    <p>The booking has been successfully confirmed and the customer has been notified via email.</p>
                    
                    <div class="details">
                        <div class="detail-item">
                            <span class="label">Customer:</span> ${booking.name}
                        </div>
                        <div class="detail-item">
                            <span class="label">Phone:</span> ${booking.phone}
                        </div>
                        <div class="detail-item">
                            <span class="label">Service:</span> ${booking.service}
                        </div>
                        <div class="detail-item">
                            <span class="label">Date:</span> ${booking.date}
                        </div>
                        <div class="detail-item">
                            <span class="label">Time:</span> ${booking.time}
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <a href="https://wa.me/91${booking.phone}?text=Hello ${booking.name}, your booking for ${booking.service} on ${booking.date} at ${booking.time} is CONFIRMED! See you soon at Sweksha Beauty. ✨" 
                           class="btn" style="background: #25D366;">
                            📱 Send WhatsApp
                        </a>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings" class="btn">
                            View All Bookings
                        </a>
                    </div>
                </div>
            </body>
            </html>
            `,
            {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            }
        );
    } catch (error) {
        console.error('Error confirming booking:', error);
        return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 });
    }
}
