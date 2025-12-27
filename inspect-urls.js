
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
        const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));

        const services = await Service.find({}).lean();

        console.log('\n--- Image URL Inspection ---');
        services.forEach((s) => {
            if (s.services && Array.isArray(s.services)) {
                s.services.forEach(sub => {
                    if (sub.image) {
                        console.log(`[${sub.name}]: ${sub.image}`);
                    }
                });
            } else if (s.image) {
                console.log(`[${s.name}]: ${s.image}`);
            }
        });
        console.log('----------------------------\n');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

inspect();
