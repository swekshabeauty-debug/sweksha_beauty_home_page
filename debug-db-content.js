
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('--- MongoDB Content Debug ---');

        const collections = ['services', 'packages', 'reviews', 'offers', 'team', 'bookings'];

        for (const name of collections) {
            // Use flexible schema to see raw data
            const Model = mongoose.model(name, new mongoose.Schema({}, { strict: false, collection: name.toLowerCase() + 's' }));
            // Note: Mongoose capitalizes model names. My script used 'Service', 'Package'. 
            // The collection names default to lowercase plural: services, packages.

            // Let's try to infer/match the collection name my models used.
            // In recover script: mongoose.model('Service'...) -> collection 'services'

            const count = await Model.countDocuments();
            console.log(`\nCollection: [${name}] - Count: ${count}`);

            if (count > 0) {
                const sample = await Model.findOne().lean();
                console.log('Sample ID:', sample.id || sample._id);
                console.log('Active:', sample.active);
                if (name === 'services' && sample.services) {
                    console.log('Sub-services count:', sample.services.length);
                    console.log('Sub-service[0] Active:', sample.services[0].active);
                }
            } else {
                console.log('⚠️ EMPTY');
            }
        }
        console.log('\n---------------------------');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

debug();
