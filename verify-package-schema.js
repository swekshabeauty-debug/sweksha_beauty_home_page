const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Replicate the UPDATED schema
const PackageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: String,
    duration: String,
    description: String,
    services: [String],
    tag: String,
    active: Boolean,
    image: String,
    popular: Boolean,
}, { strict: false }); // Test with strict false

// Use a random model name to avoid "OverwriteModelError"
const PackageModel = mongoose.models.PackageTestStrict || mongoose.model('PackageTestStrict', PackageSchema, 'packages');

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        const packages = await PackageModel.find({}).lean();
        console.log('Packages found:', packages.length);
        if (packages.length > 0) {
            console.log('First package content:', JSON.stringify(packages[0], null, 2));

            if (packages[0].id) {
                console.log('SUCCESS: id is present.');
            } else {
                console.error('FAIL: id is missing!');
            }
        } else {
            console.warn('No packages found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
