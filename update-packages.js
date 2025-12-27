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
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.warn(`⚠️ Could not read ${filename}:`, e.message);
        return [];
    }
}

async function updatePackages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Create Package Model (Flexible Schema)
        const PackageModel = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

        // Read Data from JSON
        const packages = readJson('packages.json');
        console.log(`Found ${packages.length} packages in JSON file.`);

        // Clear existing packages
        console.log('Clearing existing packages...');
        await PackageModel.deleteMany({});

        // Insert new packages
        if (packages.length > 0) {
            console.log('Inserting new packages...');
            await PackageModel.insertMany(packages);
            console.log(`✅ Successfully inserted ${packages.length} packages.`);
        } else {
            console.log('⚠️ No packages found to insert.');
        }

    } catch (e) {
        console.error('Update failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

updatePackages();
