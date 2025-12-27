
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function countServices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // We don't import the model here, just check the collection directly
        const collection = mongoose.connection.collection('services');
        const count = await collection.countDocuments();
        console.log(`Total documents in 'services' collection: ${count}`);

        const allDocs = await collection.find({}).toArray();
        console.log('Document IDs found:');
        allDocs.forEach(doc => {
            console.log(`- _id: ${doc._id}, id: ${doc.id}, name: ${doc.name}, services count: ${doc.services?.length}`);
        });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

countServices();
