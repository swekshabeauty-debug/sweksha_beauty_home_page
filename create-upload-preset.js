
require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dmjpzzx9h',
    api_key: '677998825295425',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function createPreset() {
    try {
        console.log('Creating upload preset: sweksha_beauty ...');

        const result = await cloudinary.api.create_upload_preset({
            name: 'sweksha_beauty',
            unsigned: true,
            folder: 'uploads', // Optional: put uploads in a specific folder
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        });

        console.log('✅ Upload preset created successfully!');
        console.log(result);

    } catch (e) {
        console.error('❌ Error creating preset:', e);
        if (e.error && e.error.message && e.error.message.includes('already exists')) {
            console.log('⚠️ Preset already exists. Trying to update it to be unsigned...');
            try {
                await cloudinary.api.update_upload_preset('sweksha_beauty', {
                    unsigned: true,
                    mode: 'unsigned' // Just to be sure, though API indicates 'unsigned: true' maps to mode
                });
                console.log('✅ Preset updated to unsigned.');
            } catch (updateErr) {
                console.error('❌ Failed to update preset:', updateErr);
            }
        }
    }
}

createPreset();
