
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function fixGallerySchema() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('galleries');

        // Find docs with 'url' and no 'image'
        const toFix = await collection.find({
            url: { $exists: true },
            image: { $exists: false }
        }).toArray();

        console.log(`Found ${toFix.length} documents to fix.`);

        for (const doc of toFix) {
            console.log(`Fixing doc ${doc._id}...`);
            await collection.updateOne(
                { _id: doc._id },
                {
                    $set: { image: doc.url },
                    $unset: { url: "" }
                }
            );
        }

        console.log('✅ Schema fix complete.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

fixGallerySchema();
