import crypto from 'crypto';
import OTP from '../models/otp.model.js';



// Generate a 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};


// Create and save OTP record
export const createOTPRecord = async (email, type = 'email-verification') => {
  // Delete any existing OTPs for this email and type
  await OTP.deleteMany({ email, type });
  
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  const otpRecord = await OTP.create({
    email,
    otp,
    type,
    expiresAt
  });
  
  return otpRecord.otp; // Return the plain OTP for sending
};


// Verify OTP
export const verifyOTP = async (email, otp, type = 'email-verification') => {
  const otpRecord = await OTP.findOne({ 
    email, 
    type,
    used: false,
    expiresAt: { $gt: new Date() } // Not expired
  });

  if (!otpRecord) {
    return { isValid: false, message: 'Invalid OTP or OTP has expired' };
  }

  // Increment attempts
  otpRecord.attempts += 1;
  await otpRecord.save();

  if (otpRecord.attempts > 5) {
    await OTP.deleteMany({ email, type });
    return { isValid: false, message: 'Maximum attempts reached. Please request a new OTP.' };
  }

  if (otpRecord.otp !== otp) {
    return { isValid: false, message: 'Invalid OTP' };
  }

  // Mark OTP as used
  otpRecord.used = true;
  await otpRecord.save();

  return { isValid: true, message: 'OTP verified successfully' };
};