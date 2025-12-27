
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const apiSecret = 'PU1DsoOjS2A90T7wSwb44rq3tm0';

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split('\n');
    let newContent = '';
    let secretUpdated = false;

    for (const line of lines) {
        if (line.startsWith('CLOUDINARY_API_SECRET=')) {
            newContent += `CLOUDINARY_API_SECRET=${apiSecret}\n`;
            secretUpdated = true;
        } else {
            newContent += line + '\n';
        }
    }

    if (!secretUpdated) newContent += `CLOUDINARY_API_SECRET=${apiSecret}\n`;

    // Clean up multiple newlines
    newContent = newContent.replace(/\n\n+/g, '\n').trim() + '\n';

    fs.writeFileSync(envPath, newContent);
    console.log('✅ Updated .env.local with API Secret');

} catch (e) {
    console.error('Error updating .env.local:', e);
}
