
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String }, // Storing as string to match current usage, could migrate to Date
    image: String,
    service: String,
    active: Boolean,
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
