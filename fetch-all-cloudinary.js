
require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dmjpzzx9h',
    api_key: '677998825295425',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function listImages() {
    try {
        console.log('Fetching ALL images to find the folder structure...');

        // Just search for all images to see where they are
        const result = await cloudinary.search
            .expression('resource_type:image')
            .sort_by('created_at', 'desc')
            .max_results(50)
            .execute();

        if (result.resources && result.resources.length > 0) {
            console.log(`Found ${result.resources.length} images.`);

            const mapping = result.resources.map(res => ({
                public_id: res.public_id,
                folder: res.folder,
                url: res.secure_url,
                filename: res.filename
            }));

            fs.writeFileSync('cloudinary_all_images.json', JSON.stringify(mapping, null, 2));

            mapping.forEach(m => console.log(`[${m.folder || 'ROOT'}] ${m.filename}: ${m.url}`));
        } else {
            console.log('❌ No images found.');
        }

    } catch (e) {
        console.error('Error fetching images:', e);
    }
}

listImages();
