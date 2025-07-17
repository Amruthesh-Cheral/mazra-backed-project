import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String },
  image: {
    url: String,
    public_id: String,
  },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
