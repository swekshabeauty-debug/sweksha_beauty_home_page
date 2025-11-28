import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export interface BookingDetails {
    id: string;
    name: string;
    email: string; // Added email field
    phone: string;
    serviceCategory?: string;
    service: string;
    package?: string;
    date: string;
    time: string;
    notes: string;
}

/**
 * Send booking alert email to admin
 */
export async function sendAdminBookingAlert(booking: BookingDetails) {
    // Determine the base URL
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        if (process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        } else {
            // Fallback to production URL if env vars are missing
            baseUrl = 'https://sweksha-beauty-home-page.vercel.app';
        }
    }

    console.log('🔗 Generating email link with base URL:', baseUrl);

    // Link to the admin panel bookings page instead of direct API confirmation
    const confirmLink = `${baseUrl}/admin/bookings`;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box; }
                .header { background: #F29D8D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .detail-row { margin: 15px 0; padding: 10px; background: white; border-radius: 4px; }
                .label { font-weight: bold; color: #666; display: inline-block; width: 150px; }
                .value { color: #333; }
                .confirm-btn { 
                    display: inline-block; 
                    background: #22c55e; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    margin-top: 20px;
                    font-weight: bold;
                }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                
                @media only screen and (max-width: 600px) {
                    .container { padding: 10px; }
                    .content { padding: 20px; }
                    .label { display: block; width: 100%; margin-bottom: 5px; }
                    .detail-row { padding: 15px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 New Booking Alert!</h1>
                </div>
                <div class="content">
                    <div class="detail-row">
                        <span class="label">👤 Customer:</span>
                        <span class="value">${booking.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">📧 Email:</span>
                        <span class="value">${booking.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">📱 Phone:</span>
                        <span class="value">${booking.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">💅 Service:</span>
                        <span class="value">${booking.serviceCategory ? `${booking.serviceCategory} - ` : ''}${booking.service}</span>
                    </div>
                    ${booking.package ? `
                    <div class="detail-row">
                        <span class="label">📦 Package:</span>
                        <span class="value">${booking.package}</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">📅 Date:</span>
                        <span class="value">${booking.date}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">🕐 Time:</span>
                        <span class="value">${booking.time}</span>
                    </div>
                    ${booking.notes ? `
                    <div class="detail-row">
                        <span class="label">📝 Notes:</span>
                        <span class="value">${booking.notes}</span>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center;">
                        <a href="${confirmLink}" class="confirm-btn">View Request in Admin</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Sweksha Beauty - Admin Notification</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Sweksha Beauty" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `🔔 New Booking: ${booking.name} - ${booking.date}`,
            html: htmlContent,
        });
        console.log('✅ Admin booking alert sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send admin alert:', error);
        return { success: false, error };
    }
}

/**
 * Send booking confirmation email to customer
 */
export async function sendCustomerConfirmation(booking: BookingDetails) {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box; }
                .header { background: linear-gradient(135deg, #F29D8D 0%, #FCD8B8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #FFF3EB; padding: 30px; border-radius: 0 0 8px 8px; }
                .success-icon { font-size: 48px; margin-bottom: 10px; }
                .detail-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F29D8D; }
                .detail-item { margin: 10px 0; }
                .label { font-weight: bold; color: #666; }
                .value { color: #333; font-size: 18px; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
                .contact-info { margin-top: 20px; font-size: 14px; color: #666; }
                
                @media only screen and (max-width: 600px) {
                    .container { padding: 10px; }
                    .header { padding: 20px; }
                    .content { padding: 20px; }
                    .value { font-size: 16px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="success-icon">✅</div>
                    <h1>Booking Confirmed!</h1>
                    <p>Sweksha Beauty</p>
                </div>
                <div class="content">
                    <p>Hello <strong>${booking.name}</strong>! 👋</p>
                    <p>Your appointment has been confirmed. We're excited to see you!</p>
                    
                    <div class="detail-box">
                        <div class="detail-item">
                            <div class="label">💅 Service</div>
                            <div class="value">${booking.serviceCategory ? `${booking.serviceCategory} - ` : ''}${booking.service}</div>
                        </div>
                        ${booking.package ? `
                        <div class="detail-item">
                            <div class="label">📦 Package</div>
                            <div class="value">${booking.package}</div>
                        </div>
                        ` : ''}
                        <div class="detail-item">
                            <div class="label">📅 Date</div>
                            <div class="value">${booking.date}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">🕐 Time</div>
                            <div class="value">${booking.time}</div>
                        </div>
                    </div>

                    <div style="background: #fff; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <p><strong>💰 Payment:</strong> Pay at shop via Cash or UPI</p>
                    </div>

                    <div class="contact-info">
                        <p><strong>📍 Location:</strong> Main Market, Haveli Kharagpur, Munger, Bihar</p>
                        <p><strong>📞 Contact:</strong> 9065347011</p>
                    </div>
                </div>
                <div class="footer">
                    <p>Thank you for choosing Sweksha Beauty! ✨</p>
                    <p style="font-size: 12px; color: #999;">If you need to reschedule, please call us.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    // Only send if email is provided
    if (!booking.email) {
        console.log('ℹ️ No email provided for customer confirmation, skipping.');
        return { success: true, skipped: true };
    }

    try {
        await transporter.sendMail({
            from: `"Sweksha Beauty" <${process.env.EMAIL_USER}>`,
            to: booking.email, // Use customer email
            subject: `✅ Booking Confirmed - ${booking.date} at ${booking.time}`,
            html: htmlContent,
        });
        console.log('✅ Customer confirmation sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send customer confirmation:', error);
        return { success: false, error };
    }
}

/**
 * Mock WhatsApp notification (placeholder for future implementation)
 */
export async function sendWhatsAppNotification(to: string, message: string) {
    console.log(`📱 WhatsApp notification (mock): To ${to}`);
    console.log(`Message: ${message}`);

    // TODO: Implement with Twilio/WATI when ready
    // Example Twilio code:
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //     body: message,
    //     from: 'whatsapp:+14155238886',
    //     to: `whatsapp:${to}`
    // });

    return { success: true, mock: true };
}
