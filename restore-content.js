
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

function readJson(filename) {
    try {
        const filePath = path.join(__dirname, 'src', 'data', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.warn(`⚠️ Could not read ${filename}:`, e.message);
        return null;
    }
}

async function restoreContent() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Settings = mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));

        const content = readJson('content.json');
        if (content) {
            console.log('Restoring content...', JSON.stringify(content, null, 2));
            await Settings.updateOne(
                { type: 'site_content' },
                { ...content, type: 'site_content' },
                { upsert: true }
            );
            console.log('✅ Content restored.');
        } else {
            console.error('❌ content.json not found or empty');
        }

        const current = await Settings.findOne({ type: 'site_content' }).lean();
        console.log('Current DB Content:', current ? 'Found' : 'Not Found');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

restoreContent();
