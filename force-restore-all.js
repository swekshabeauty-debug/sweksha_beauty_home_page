
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined');
    process.exit(1);
}

// Helper to read JSON
function readJson(filename) {
    try {
        const filePath = path.join(__dirname, 'src', 'data', filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`❌ File not found: ${filename}`);
            return null;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.warn(`⚠️ Error reading ${filename}:`, e.message);
        return null;
    }
}

async function forceRestore() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Define Loose Models
        const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
        const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
        const Review = mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
        const Team = mongoose.model('Team', new mongoose.Schema({}, { strict: false }));
        const FAQ = mongoose.model('FAQ', new mongoose.Schema({}, { strict: false }));
        const Gallery = mongoose.model('Gallery', new mongoose.Schema({}, { strict: false }));
        const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
        const Offer = mongoose.model('Offer', new mongoose.Schema({}, { strict: false }));
        const Settings = mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));

        // 1. Restore Collections (Arrays)
        const collections = [
            { name: 'Service', model: Service, file: 'services.json' },
            { name: 'Package', model: Package, file: 'packages.json' },
            { name: 'Review', model: Review, file: 'reviews.json' },
            { name: 'Team', model: Team, file: 'team.json' },
            { name: 'FAQ', model: FAQ, file: 'faq.json' },
            { name: 'Gallery', model: Gallery, file: 'gallery.json' },
            { name: 'Booking', model: Booking, file: 'bookings.json' },
            { name: 'Offer', model: Offer, file: 'offers.json' },
        ];

        console.log('\n--- Restoring Collections ---');
        for (const col of collections) {
            const data = readJson(col.file);
            if (data && Array.isArray(data)) {
                await col.model.deleteMany({}); // WIPE
                if (data.length > 0) {
                    await col.model.insertMany(data);
                }
                console.log(`✅ ${col.name}: Restored ${data.length} items from ${col.file}`);
            } else {
                console.log(`⚠️ ${col.name}: Skipped (Empty or invalid file ${col.file})`);
            }
        }

        // 2. Restore Settings & Content (Single Docs in Settings Collection)
        console.log('\n--- Restoring Settings & Content ---');

        // Content
        const contentData = readJson('content.json');
        if (contentData) {
            await Settings.deleteOne({ type: 'site_content' }); // Determine specific delete to ensure clean slate? Or just update.
            // Actually updateOne with upsert is safer to keep ID if needed, but for "Force" let's just overwrite fields.
            await Settings.updateOne(
                { type: 'site_content' },
                { ...contentData, type: 'site_content' },
                { upsert: true }
            );
            console.log('✅ Site Content: Restored from content.json');
        } else {
            console.log('⚠️ Site Content: content.json missing');
        }

        // General Settings
        const settingsData = readJson('settings.json');
        if (settingsData) {
            await Settings.updateOne(
                { type: 'general_settings' },
                { ...settingsData, type: 'general_settings' },
                { upsert: true }
            );
            console.log('✅ General Settings: Restored from settings.json');
        } else {
            console.log('⚠️ General Settings: settings.json missing');
        }

        console.log('\n🎉 FORCE RESTORE COMPLETE');

    } catch (e) {
        console.error('❌ Restore failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

forceRestore();
