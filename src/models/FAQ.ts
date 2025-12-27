
import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: String,
});

export default mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
