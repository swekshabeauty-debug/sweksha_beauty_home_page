const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

function readJson(filename) {
    try {
        const filePath = path.join(__dirname, 'src', 'data', filename);
        let data = fs.readFileSync(filePath, 'utf8');
        // Strip BOM if present
        if (data.charCodeAt(0) === 0xFEFF) {
            data = data.slice(1);
        }
        return JSON.parse(data);
    } catch (e) {
        console.warn(`⚠️ Could not read ${filename}:`, e.message);
        return [];
    }
}

async function updateOffers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Identify the collection for offers. 
        // In lib/db.ts, I previously treated Offers as dynamic. 
        // Let's use a specific "Offer" model to keep it clean.
        const OfferModel = mongoose.models.Offer || mongoose.model('Offer', new mongoose.Schema({}, { strict: false }));

        const offers = readJson('offers.json');
        console.log(`Found ${offers.length} offers in JSON file.`);

        console.log('Clearing existing offers...');
        await OfferModel.deleteMany({});

        if (offers.length > 0) {
            console.log('Inserting new offers...');
            await OfferModel.insertMany(offers);
            console.log(`✅ Successfully inserted ${offers.length} offers.`);
        } else {
            console.log('⚠️ No offers found to insert.');
        }

    } catch (e) {
        console.error('Update failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

updateOffers();
