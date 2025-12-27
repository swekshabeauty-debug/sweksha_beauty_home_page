
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

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Create Models (Flexible Schema)
        const ServiceModel = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
        const PackageModel = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
        const ReviewModel = mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
        const TeamModel = mongoose.model('Team', new mongoose.Schema({}, { strict: false }));
        const FAQModel = mongoose.model('FAQ', new mongoose.Schema({}, { strict: false }));
        const GalleryModel = mongoose.model('Gallery', new mongoose.Schema({}, { strict: false }));
        const BookingModel = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
        const SettingsModel = mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));

        // Read Data from JSON files in src/data
        const services = readJson('services.json');
        const packages = readJson('packages.json');
        const reviews = readJson('reviews.json');
        const team = readJson('team.json');
        const faq = readJson('faq.json');
        const gallery = readJson('gallery.json');
        const bookings = readJson('bookings.json');
        const content = readJson('content.json');
        const settings = readJson('settings.json');

        console.log('--- Migration Summary ---');
        console.log(`Services: ${services.length}`);
        console.log(`Packages: ${packages.length}`);
        console.log(`Reviews: ${reviews.length}`);
        console.log(`Team: ${team.length}`);
        console.log(`FAQ: ${faq.length}`);
        console.log(`Gallery: ${gallery.length}`);
        console.log(`Bookings: ${bookings.length}`);
        console.log(`Content: ${content ? 'Found' : 'Missing'}`);
        console.log('-------------------------');

        // Clear existing data (to avoid duplicates or mixing with seed data)
        console.log('Cleaning up existing data...');
        await ServiceModel.deleteMany({});
        await PackageModel.deleteMany({});
        await ReviewModel.deleteMany({});
        await TeamModel.deleteMany({});
        await FAQModel.deleteMany({});
        await GalleryModel.deleteMany({});
        await BookingModel.deleteMany({});
        await SettingsModel.deleteMany({}); // Clear settings too

        // Insert new data
        if (services.length) await ServiceModel.insertMany(services);
        if (packages.length) await PackageModel.insertMany(packages);
        if (reviews.length) await ReviewModel.insertMany(reviews);
        if (team.length) await TeamModel.insertMany(team);
        if (faq.length) await FAQModel.insertMany(faq);
        if (gallery.length) await GalleryModel.insertMany(gallery);
        if (gallery.length) await GalleryModel.insertMany(gallery);
        if (bookings.length) await BookingModel.insertMany(bookings);

        // Offers (Added)
        const offers = readJson('offers.json');
        console.log(`Offers: ${offers.length}`);
        const OfferModel = mongoose.model('Offer', new mongoose.Schema({}, { strict: false }));
        await OfferModel.deleteMany({});
        if (offers.length) await OfferModel.insertMany(offers);

        // Handle single documents
        if (content && Object.keys(content).length > 0) {
            await SettingsModel.updateOne(
                { type: 'site_content' },
                { ...content, type: 'site_content' },
                { upsert: true }
            );
            console.log('Restored Content');
        }

        if (settings && Object.keys(settings).length > 0) {
            await SettingsModel.updateOne(
                { type: 'general_settings' },
                { ...settings, type: 'general_settings' },
                { upsert: true }
            );
            console.log('Restored Settings');
        }

        console.log('✅ Migration complete! Your old data has been restored.');

    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

migrate();
