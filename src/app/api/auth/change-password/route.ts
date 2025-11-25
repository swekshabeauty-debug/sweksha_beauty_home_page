import { getSettings, saveSettings } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { currentPassword, newPassword } = await request.json();
        const settings = await getSettings();

        const isValid = await bcrypt.compare(currentPassword, settings.admin.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        settings.admin.passwordHash = hash;
        await saveSettings(settings);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
