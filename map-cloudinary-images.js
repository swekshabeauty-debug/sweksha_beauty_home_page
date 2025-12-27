
const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'src/data/services.json');
const imagesPath = path.join(__dirname, 'cloudinary_all_images.json');

try {
    const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
    const imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));

    // Filter out default Cloudinary samples
    const customImages = imagesData.filter(img => !img.public_id.startsWith('samples/') && !img.public_id.startsWith('cld-sample'));

    console.log(`Found ${customImages.length} custom images to map.`);

    if (customImages.length === 0) {
        console.log('No custom images found using default samples logic. Using all non-sample images.');
    }

    let imgIndex = 0;

    // We want to distribute these images across the categories/services.
    // Strategy: Assign one image per category, or cycle through them for each service?
    // User said "get all pics from here and also add all services".
    // Let's cycle through them for each SERVICE to show variety.

    const updatedServices = servicesData.map(category => {
        const newCategoryServices = category.services.map(service => {
            // Pick an image
            const image = customImages[imgIndex % customImages.length];
            imgIndex++;

            return {
                ...service,
                image: image.url
            };
        });

        return {
            ...category,
            services: newCategoryServices
        };
    });

    fs.writeFileSync(servicesPath, JSON.stringify(updatedServices, null, 2));
    console.log('✅ Updated services.json with Cloudinary images.');
    console.log(`Mapped ${imgIndex} services using ${customImages.length} unique images.`);

} catch (e) {
    console.error('Error mapping images:', e);
}
