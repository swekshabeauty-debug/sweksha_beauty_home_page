
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

async function inspect() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Flexible schema to see everything
        const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));

        console.log('--- Checking Services ---');
        const services = await Service.find({}).limit(3).lean();

        if (services.length === 0) {
            console.log('No services found!');
        } else {
            services.forEach((s, i) => {
                console.log(`[${i}] Name: ${s.name || s.title}`);
                // Check for nested services (categories)
                if (s.services && Array.isArray(s.services)) {
                    console.log(`    Category with ${s.services.length} sub-services`);
                    s.services.slice(0, 3).forEach(sub => {
                        console.log(`      - ${sub.name}: Image URL = ${sub.image ? sub.image.substring(0, 50) + '...' : 'MISSING'}`);
                    });
                } else {
                    // Flat service
                    console.log(`    Image URL = ${s.image ? s.image : 'MISSING'}`);
                }
            });
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

inspect();
