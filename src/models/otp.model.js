import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    index: true 
  },
  // phone: { 
  //   type: String, 
  //   required: true,
  //   index: true 
  // },
  otp: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['email-verification', 'password-reset'], 
    default: 'email-verification' 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: '1m' } // Auto-delete after 1 minute past expiration
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5 // Maximum attempts allowed
  },
  used: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for faster queries
otpSchema.index({ email: 1, type: 1 });

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;