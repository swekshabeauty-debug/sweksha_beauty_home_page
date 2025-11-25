import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Test endpoint to verify email credentials
 * Visit: http://localhost:3000/api/test-email
 */
export async function GET() {
    try {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return NextResponse.json({
                success: false,
                error: 'Email credentials not configured',
                message: 'Please add EMAIL_USER and EMAIL_PASSWORD to your .env.local file',
            }, { status: 400 });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Verify connection
        await transporter.verify();

        // Send test email
        const info = await transporter.sendMail({
            from: `"Sweksha Beauty" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: '✅ Email Configuration Test - Sweksha Beauty',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px; }
                        .success { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
                        .details { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
                        .detail-row { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
                        .label { font-weight: bold; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success">
                            <h1>✅ Success!</h1>
                            <p>Your email configuration is working perfectly.</p>
                        </div>
                        <p>This is a test email from your Sweksha Beauty booking system.</p>
                        <div class="details">
                            <div class="detail-row">
                                <span class="label">Email Host:</span> ${process.env.EMAIL_HOST || 'smtp.gmail.com'}
                            </div>
                            <div class="detail-row">
                                <span class="label">Port:</span> ${process.env.EMAIL_PORT || '587'}
                            </div>
                            <div class="detail-row">
                                <span class="label">From:</span> ${process.env.EMAIL_USER}
                            </div>
                            <div class="detail-row">
                                <span class="label">Test Time:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </div>
                        </div>
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">
                            Your booking notification system is ready to send emails! 🎉
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json({
            success: true,
            message: '✅ Email sent successfully! Check your inbox.',
            details: {
                messageId: info.messageId,
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: process.env.EMAIL_PORT || '587',
            }
        });

    } catch (error: any) {
        console.error('❌ Email test failed:', error);

        // Provide helpful error messages
        let errorMessage = error.message || 'Unknown error';
        let helpText = '';

        if (error.code === 'EAUTH') {
            helpText = 'Authentication failed. Please check:\n1. EMAIL_USER is correct\n2. EMAIL_PASSWORD is the App Password (not your regular Gmail password)\n3. 2-Factor Authentication is enabled on Gmail';
        } else if (error.code === 'ECONNECTION') {
            helpText = 'Connection failed. Please check:\n1. Internet connection\n2. EMAIL_HOST and EMAIL_PORT are correct\n3. Firewall/antivirus is not blocking port 587';
        } else if (error.code === 'ESOCKET') {
            helpText = 'Network error. Try changing EMAIL_PORT to 465 and set secure: true in notifications.ts';
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            help: helpText,
            configuration: {
                EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Missing',
                EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing',
                EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com (default)',
                EMAIL_PORT: process.env.EMAIL_PORT || '587 (default)',
                ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '❌ Not set',
            }
        }, { status: 500 });
    }
}
