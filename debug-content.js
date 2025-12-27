
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function debugContent() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Settings = mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));

        const content = await Settings.findOne({ type: 'site_content' }).lean();
        console.log('Content from DB:', JSON.stringify(content, null, 2));

        const allSettings = await Settings.find({}).lean();
        console.log('All Settings docs:', JSON.stringify(allSettings, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

debugContent();
