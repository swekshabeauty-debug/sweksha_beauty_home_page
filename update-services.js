const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Helper to read JSON file
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

async function updateServices() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Create Service Model (Flexible Schema)
        // Note: We use strict: false to ensure we accept the nested 'services' array validly
        const ServiceModel = mongoose.models.Service || mongoose.model('Service', new mongoose.Schema({}, { strict: false }));

        // Read Data from JSON
        const services = readJson('services.json');
        console.log(`Found ${services.length} service categories in JSON file.`);
        if (services.length > 0) {
            console.log('First category:', services[0].id);
            if (services.length > 1) console.log('Second category:', services[1].id);
        }

        // Clear existing services
        console.log('Clearing existing services...');
        await ServiceModel.deleteMany({});

        // Drop indexes to avoid duplicate key errors on 'id' if the schema is loose
        // or ensure data is clean. Let's try dropping the index first as a quick fix if it exists.
        try {
            await ServiceModel.collection.dropIndexes();
            console.log('Dropped indexes to ensure clean slate.');
        } catch (e) {
            console.log('Index drop skipped (maybe none existed).');
        }

        // Insert new services
        if (services.length > 0) {
            console.log('Inserting new services...');
            await ServiceModel.insertMany(services);
            console.log(`✅ Successfully inserted ${services.length} service categories.`);
        } else {
            console.log('⚠️ No services found to insert.');
        }

    } catch (e) {
        console.error('Update failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

updateServices();
