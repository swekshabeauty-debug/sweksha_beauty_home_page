
import mongoose from 'mongoose';

const SubServiceSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: mongoose.Schema.Types.Mixed, // Can be string or number in JSON
    duration: String,
    description: String,
    active: Boolean,
    image: String,
});

const ServiceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Changed from title to name
    services: [SubServiceSchema],
}, { strict: false }); // Allow loose schema just in case

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
