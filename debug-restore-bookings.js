
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function debugRestoreBookings() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected');

        const filePath = path.join(__dirname, 'src/data/bookings.json');
        console.log(`Reading file: ${filePath}`);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);

        console.log(`Loaded JSON data type: ${typeof data}`);
        console.log(`Is Array: ${Array.isArray(data)}`);
        console.log(`Length: ${data.length}`);

        if (data.length > 0) {
            console.log('First item:', JSON.stringify(data[0], null, 2));
        }

        // Use native collection to bypass mongoose schema potential issues
        const collection = mongoose.connection.collection('bookings');

        console.log('Clearing collection...');
        await collection.deleteMany({});

        console.log(`Inserting ${data.length} items...`);
        const result = await collection.insertMany(data);

        console.log('Insertion result:', result);

        const count = await collection.countDocuments();
        console.log(`Total documents in 'bookings' after insert: ${count}`);

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

debugRestoreBookings();
