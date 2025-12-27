
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debugGallery() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('galleries'); // Accessing 'galleries' (plural) usually, or 'gallery' depending on model name
        // Checking both potential collection names
        const count1 = await collection.countDocuments();
        console.log(`Total documents in 'galleries' collection: ${count1}`);

        const collection2 = mongoose.connection.collection('gallery');
        const count2 = await collection2.countDocuments();
        console.log(`Total documents in 'gallery' collection: ${count2}`);

        const targetCollection = count1 > 0 ? collection : collection2;

        const allDocs = await targetCollection.find({}).toArray();
        console.log('Document IDs found and sample image path:');
        allDocs.forEach(doc => {
            console.log(`- _id: ${doc._id}, image: ${doc.image}, url: ${doc.url}`);
        });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

debugGallery();
