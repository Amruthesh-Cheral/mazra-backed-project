import { sendPasswordResetEmail } from "../config/email.js";
import catchAsync from "../middlewares/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { comparePasswords} from "../utils/auth.js";
import { createOTPRecord, verifyOTP } from "./otp.controller.js";

// Request password reset
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, 'Email is required'));
  }

  // Don't reveal if user doesn't exist (security best practice)
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset OTP has been sent"
    });
  }

  // Generate and send OTP
  const otp = await createOTPRecord(email, 'password-reset');
  await sendPasswordResetEmail(email, otp);

  res.status(200).json({
    success: true,
    message: "If an account with that email exists, a password reset OTP has been sent"
  });
});

// Verify password reset OTP
// export const verifyPasswordResetOTP = catchAsync(async (req, res, next) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return next(new ApiError(400, 'Email and OTP are required'));
//   }

//   // Verify OTP
//   const { isValid, message } = await verifyOTP(email, otp, 'password-reset');
  
//   if (!isValid) {
//     return next(new ApiError(400, message));
//   }

//   // Return success without changing password yet
//   // The client will now show the password reset form
//   res.status(200).json({
//     success: true,
//     message: "OTP verified successfully. You may now reset your password."
//   });
// });

// Reset password after OTP verification
export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(new ApiError(400, 'Email, OTP, and new password are required'));
  }

  // Verify OTP again (in case client-side only verification was bypassed)
  const { isValid, message } = await verifyOTP(email, otp, 'password-reset');
  
  if (!isValid) {
    return next(new ApiError(400, message));
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Check if new password is different from current
  const isSamePassword = await comparePasswords(newPassword, user.password);
  if (isSamePassword) {
    return next(new ApiError(400, 'New password must be different from current password'));
  }

  // Update password
//   user.password = await hashPassword(newPassword);
  user.password = newPassword;
  await user.save();

  // Invalidate all existing sessions (optional but recommended)
  // This would require additional implementation (e.g., token blacklist)

  res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now login with your new password."
  });
});