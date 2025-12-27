
import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: String, // Changed to String to match data
    duration: String,
    description: String, // Changed to String to match data
    services: [String], // Added
    tag: String, // Added
    active: Boolean, // Added
    image: String,
    popular: Boolean,
}, { strict: false });

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
