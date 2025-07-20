import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  heading: { type: String},
  subHeading: { type: String},
  image:{
  url: { type: String},
  public_id: { type: String }
}, // URL or Cloudinary path
  video: {
  url: { type: String},
  public_id: { type: String }
},
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
