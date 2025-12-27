
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
// Using a descriptive placeholder that we will ask the user to create
const preset = 'sweksha_beauty';

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split('\n');
    let newContent = '';
    let presetUpdated = false;

    for (const line of lines) {
        if (line.startsWith('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=')) {
            newContent += `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${preset}\n`;
            presetUpdated = true;
        } else {
            newContent += line + '\n';
        }
    }

    if (!presetUpdated) newContent += `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${preset}\n`;

    // Clean up multiple newlines
    newContent = newContent.replace(/\n\n+/g, '\n').trim() + '\n';

    fs.writeFileSync(envPath, newContent);
    console.log(`✅ Updated .env.local with placeholder Preset: ${preset}`);

} catch (e) {
    console.error('Error updating .env.local:', e);
}
