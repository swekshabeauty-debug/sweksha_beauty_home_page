
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

async function testConnection() {
    console.log('Using connection string:', MONGODB_URI.replace(/:([^@]+)@/, ':****@')); // Hide password in logs

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Define a simple schema for testing (using the Booking model structure conceptually)
        const TestSchema = new mongoose.Schema({
            test: String,
            createdAt: { type: Date, default: Date.now }
        });

        // Use a specific collection for testing so we don't mess up real data if schema matched
        const TestModel = mongoose.models.TestConn || mongoose.model('TestConn', TestSchema);

        console.log('Creating test document...');
        const doc = await TestModel.create({ test: 'Hello MongoDB' });
        console.log('✅ Document created:', doc._id);

        console.log('Reading document...');
        const found = await TestModel.findById(doc._id);
        console.log('✅ Document found:', found.test);

        console.log('Deleting test document...');
        await TestModel.findByIdAndDelete(doc._id);
        console.log('✅ Document deleted');

        console.log('🎉 Verification passed!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

testConnection();
