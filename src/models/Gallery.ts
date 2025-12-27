
import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    category: String,
    image: { type: String, required: true },
    isInstagram: Boolean
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
