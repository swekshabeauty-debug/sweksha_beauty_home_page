const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Generic schema to see raw data
const ServiceModel = mongoose.models.Service || mongoose.model('Service', new mongoose.Schema({}, { strict: false }));

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const services = await ServiceModel.find({}).lean();
        console.log(`Total Service Documents: ${services.length}`);

        let totalSubServices = 0;
        services.forEach((s, i) => {
            const count = s.services ? s.services.length : 0;
            totalSubServices += count;
            console.log(`[${i}] ID: ${s.id}, Name: ${s.name}, Sub-Services: ${count}`);
        });
        console.log(`Total Sub-Services across all categories: ${totalSubServices}`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
