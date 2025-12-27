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

async function updateFaq() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Using strict: false to be safe
        const FAQModel = mongoose.models.FAQ || mongoose.model('FAQ', new mongoose.Schema({}, { strict: false }));

        const faqs = readJson('faq.json');
        console.log(`Found ${faqs.length} FAQs in JSON file.`);

        console.log('Clearing existing FAQs...');
        await FAQModel.deleteMany({});

        // Drop indexes to avoid duplicate key errors on 'id' if needed
        try {
            await FAQModel.collection.dropIndexes();
            console.log('Dropped indexes to ensure clean slate.');
        } catch (e) {
            console.log('Index drop skipped.');
        }

        if (faqs.length > 0) {
            console.log('Inserting new FAQs...');
            await FAQModel.insertMany(faqs);
            console.log(`✅ Successfully inserted ${faqs.length} FAQs.`);
        } else {
            console.log('⚠️ No FAQs found to insert.');
        }

    } catch (e) {
        console.error('Update failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

updateFaq();
