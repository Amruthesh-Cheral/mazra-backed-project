import { sendVerificationEmail } from "../config/email.js";
import catchAsync from "../middlewares/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { comparePasswords, generateToken } from "../utils/auth.js";
// import { emailVerificationTemplate } from "../utils/templates.js";
import { createOTPRecord, verifyOTP } from "./otp.controller.js";

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return next(new ApiError(400, "Name, email, and password are required"));
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(409, "Email already in use"));
  }

  // Create user (password automatically hashed via `pre('save')` hook)
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate and send OTP
  const otp = await createOTPRecord(email);
  // const emailVerificationTemplate= emailVerificationTemplate(user.name, otp)
  await sendVerificationEmail(email, otp);

  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
    verifyStatus: user.verifyStatus
  };

  res.status(201).json({
    success: true,
    data: userResponse,
    message: "User registered successfully. Please check your email for verification OTP.",
  });
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError(401, 'Invalid credentials'));
  }
  
  // Check if email is verified
  if (!user.verifyStatus) {
    return next(new ApiError(403, 'Please verify your email first. Check your inbox for verification instructions.'));
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const token = generateToken(user._id);
  user.password = undefined;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    provider: user.provider,
    verifyStatus: user.verifyStatus
  };
  
  res.status(200).json({
    success: true,
    token,
    data: userResponse,
  });
});


export const google = catchAsync(async (req, res, next) => {
  const { email, name, photo } = req.body;

  // 1. Check if user exists in DB
  let user = await User.findOne({ email });
  if (!user) {
    // 2. If user doesn't exist, create a new one with a random password
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Random 16-char password
    // const hashedPassword = await bcrypt.hash(generatedPassword, 12);

    user = await User.create({
      username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), // Unique username
      email,
      password: generatedPassword, // Not needed for Google auth but required by schema
      avatar: photo, // Save Google profile picture
      provider: 'google', // Track auth provider
    });
    
  }

  // 3. Generate JWT token
  const token = generateToken(user._id);

  // 4. Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // 5. Send response (excluding sensitive data)
  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    provider: user.provider,
  };

  res.status(200).json({
    success: true,
    token, // Optional: For clients that can't use cookies (e.g., mobile)
    data: userResponse,
  });
});



export const getUsers=async(req,res)=>{
    try {
        const userdata=await User.find();

        console.log(userdata);
        

        res.status(200).json({msg:"Success",userdata})

    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}



export const verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ApiError(400, 'Email and OTP are required'));
  }

  // Verify OTP
  const { isValid, message } = await verifyOTP(email, otp);
  
  if (!isValid) {
    return next(new ApiError(400, message));
  }

  // Update user as verified
  const user = await User.findOneAndUpdate(
    { email },
    { verifyStatus: true },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    verifyStatus: user.verifyStatus
  };

  res.status(200).json({
    success: true,
    data: userResponse,
    message: "Email verified successfully"
  });
});

export const resendVerificationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, 'Email is required'));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  if (user.verifyStatus) {
    return next(new ApiError(400, 'Email is already verified'));
  }

  // Generate new OTP
  const otp = await createOTPRecord(email);
  await sendVerificationEmail(email, otp);

  res.status(200).json({
    success: true,
    message: "Verification email resent successfully"
  });
});