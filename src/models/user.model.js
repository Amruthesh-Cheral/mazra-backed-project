import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // phone: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
  verifyStatus: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  avatar: {
  url: { type: String, required: true, default: '../public/avatar.jpg' },
  public_id: { type: String }
},
  provider: { type: String, enum: ['normal', 'google'], default: 'normal' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;