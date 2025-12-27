
const dotenv = require('dotenv');
const fs = require('fs');

try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    console.log('--- Cloudinary Config Check ---');
    console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', envConfig.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
    console.log('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:', envConfig.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? '✅ Set' : '❌ Missing');
    console.log('NEXT_PUBLIC_CLOUDINARY_API_KEY:', envConfig.NEXT_PUBLIC_CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');

} catch (e) {
    console.error('Error reading .env.local:', e.message);
}
