
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
        console.log('Fetching images from folder: Dynamic folders');

        // Fetch resources from the specific folder
        // Note: The folder name might be "Dynamic folders" (with space) or "Dynamic_folders".
        // Let's try to search by prefix or expression.

        const result = await cloudinary.search
            .expression('folder:"Dynamic folders"')
            .sort_by('public_id', 'desc')
            .max_results(50)
            .execute();

        if (result.resources && result.resources.length > 0) {
            console.log(`Found ${result.resources.length} images.`);

            const mapping = result.resources.map(res => ({
                public_id: res.public_id,
                url: res.secure_url,
                filename: res.filename
            }));

            fs.writeFileSync('cloudinary_images.json', JSON.stringify(mapping, null, 2));
            console.log('✅ Listed images to cloudinary_images.json');

            // Print names for debugging
            mapping.forEach(m => console.log(`- ${m.filename}: ${m.url}`));
        } else {
            console.log('❌ No images found in "Dynamic folders".');
            // Try listing root just in case
            console.log('Trying root search...');
            const rootResult = await cloudinary.search
                .expression('resource_type:image')
                .max_results(10)
                .execute();
            console.log('Root samples:', rootResult.resources.map(r => r.filename));
        }

    } catch (e) {
        console.error('Error fetching images:', e);
    }
}

listImages();
