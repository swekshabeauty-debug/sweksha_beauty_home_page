
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function fixFlags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('galleries');

        // Get all items sorted by id (newest first)
        // We know sorting by id desc puts newest first.
        const all = await collection.find({}).toArray();
        const sorted = all.sort((a, b) => {
            if (a.id < b.id) return 1;
            if (a.id > b.id) return -1;
            return 0;
        });

        console.log(`Total items: ${sorted.length}`);

        // Take the top 10 newest items and FORCE isInstagram: true
        // This ensures the user's recent uploads show up.
        const toFix = sorted.slice(0, 10);

        for (const doc of toFix) {
            console.log(`Forcing isInstagram=true for ${doc.id} (${doc.title || 'no title'})`);
            await collection.updateOne(
                { _id: doc._id },
                { $set: { isInstagram: true } }
            );
        }

        console.log('✅ Flags updated.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

fixFlags();
