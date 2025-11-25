import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const ext = path.extname(file.name);
        const filename = `${uuidv4()}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists (though public usually exists, uploads might not)
        // We'll rely on manual creation or check here
        try {
            await writeFile(path.join(uploadDir, filename), buffer);
        } catch (e) {
            // Try creating the directory if it fails
            const fs = require('fs');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            await writeFile(path.join(uploadDir, filename), buffer);
        }

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
