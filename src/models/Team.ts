
import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: String,
    specialties: [String],
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
