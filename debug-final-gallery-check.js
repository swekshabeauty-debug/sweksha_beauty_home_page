
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debugFinalCheck() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('galleries');

        // Simulating the query from db.ts: sort({ id: -1 })
        // Note: db.ts does find({}).sort(...) then filters in JS.
        // Let's see the raw data first.

        const all = await collection.find({}, { sort: { id: -1 } }).toArray();
        console.log(`Total images: ${all.length}`);

        const insta = all.filter(i => i.isInstagram === true);
        console.log(`Instagram images: ${insta.length}`);

        console.log('--- Top 6 Instagram Images (as per Logic) ---');
        insta.slice(0, 6).forEach((img, i) => {
            console.log(`#${i + 1}: ID=${img.id}, Title="${img.title}", Image=${img.image?.substring(0, 50)}...`);
        });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

debugFinalCheck();
