
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debugGalleryData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check 'galleries' collection (where mongoose usually saves if model is 'Gallery')
        const collection = mongoose.connection.collection('galleries');
        const items = await collection.find({ isInstagram: true }).toArray();

        console.log(`Found ${items.length} Instagram items in 'galleries':`);
        items.forEach(item => {
            console.log(JSON.stringify(item, null, 2));
        });

        // Also check 'data' collection (where the migration script might have put things if it used the firebase-like structure, though we switched to mongoose models)
        // Actually, let's just stick to the mongoose model collection first as that's what the app uses.

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

debugGalleryData();
