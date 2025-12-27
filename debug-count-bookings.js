
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debugBookings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('bookings');
        const count = await collection.countDocuments();
        console.log(`Total documents in 'bookings' collection: ${count}`);

        const allDocs = await collection.find({}).toArray();
        console.log('Document IDs found:');
        allDocs.forEach(doc => {
            console.log(`- _id: ${doc._id}, id: ${doc.id}, customerName: ${doc.customerName}`);
        });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

debugBookings();
