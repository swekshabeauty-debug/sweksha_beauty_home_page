
require('dotenv').config({ path: '.env.local' });

const config = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
};

console.log('Cloud Name present:', !!config.cloudName);
console.log('API Key present:', !!config.apiKey);
console.log('API Secret present:', !!config.apiSecret);
console.log('Upload Preset present:', !!config.uploadPreset);

if (config.cloudName) console.log('Cloud Name:', config.cloudName);
// Do not log secrets
