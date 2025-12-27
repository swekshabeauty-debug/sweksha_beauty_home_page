
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const apiKey = '677998825295425';

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split('\n');
    let newContent = '';
    let keyUpdated = false;
    let nextKeyUpdated = false;

    for (const line of lines) {
        if (line.startsWith('CLOUDINARY_API_KEY=')) {
            newContent += `CLOUDINARY_API_KEY=${apiKey}\n`;
            keyUpdated = true;
        } else if (line.startsWith('NEXT_PUBLIC_CLOUDINARY_API_KEY=')) {
            newContent += `NEXT_PUBLIC_CLOUDINARY_API_KEY=${apiKey}\n`;
            nextKeyUpdated = true;
        } else {
            newContent += line + '\n';
        }
    }

    if (!keyUpdated) newContent += `CLOUDINARY_API_KEY=${apiKey}\n`;
    if (!nextKeyUpdated) newContent += `NEXT_PUBLIC_CLOUDINARY_API_KEY=${apiKey}\n`;

    // Clean up multiple newlines
    newContent = newContent.replace(/\n\n+/g, '\n').trim() + '\n';

    fs.writeFileSync(envPath, newContent);
    console.log('✅ Updated .env.local with API Key');

} catch (e) {
    console.error('Error updating .env.local:', e);
}
