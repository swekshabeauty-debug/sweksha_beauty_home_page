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
        if (data.charCodeAt(0) === 0xFEFF) {
            data = data.slice(1);
        }
        return JSON.parse(data);
    } catch (e) {
        console.warn(`⚠️ Could not read ${filename}:`, e.message);
        return [];
    }
}

async function updateReviews() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Using strict: false to be safe, but schema is now updated too
        const ReviewModel = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, { strict: false }));

        const reviews = readJson('reviews.json');
        console.log(`Found ${reviews.length} reviews in JSON file.`);

        console.log('Clearing existing reviews...');
        await ReviewModel.deleteMany({});

        if (reviews.length > 0) {
            console.log('Inserting new reviews...');
            await ReviewModel.insertMany(reviews);
            console.log(`✅ Successfully inserted ${reviews.length} reviews.`);
        } else {
            console.log('⚠️ No reviews found to insert.');
        }

    } catch (e) {
        console.error('Update failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

updateReviews();
