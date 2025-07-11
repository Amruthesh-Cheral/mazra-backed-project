import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const seedAdmin = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/mazracare`);


    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return process.exit(0);
    }

    const admin = new User({
      username: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      verifyStatus:true, 
      role: 'Admin',
      provider: 'normal',
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
