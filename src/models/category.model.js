import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  description: { type: String, required: true },
  image: {
  url: { type: String},
  public_id: { type: String }
},
  video:{
  url: { type: String},
  public_id: { type: String }
},
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
