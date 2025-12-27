
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debugState() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('galleries');

        const all = await collection.find({}).toArray();
        console.log(`Total documents: ${all.length}`);

        console.log('\n--- BY ID (Descending) ---');
        // Simulate app sorting
        const sortedById = [...all].sort((a, b) => {
            if (a.id < b.id) return 1;
            if (a.id > b.id) return -1;
            return 0;
        });

        sortedById.forEach((img, i) => {
            console.log(`[${i}] ID: ${img.id} | Insta: ${img.isInstagram} | Cat: ${img.category} | Img: ${img.image?.substring(0, 20)}... | _id: ${img._id}`);
        });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

debugState();
