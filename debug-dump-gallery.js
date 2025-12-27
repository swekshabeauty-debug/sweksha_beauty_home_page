
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debugDumpGallery() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('galleries');
        const count = await collection.countDocuments();
        console.log(`Total documents: ${count}`);

        const all = await collection.find({}).toArray();
        console.log(JSON.stringify(all, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

debugDumpGallery();
