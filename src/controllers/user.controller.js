import cloudinary from "../config/cloudinary.js";
import catchAsync from "../middlewares/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { comparePasswords } from "../utils/auth.js";
import fs from 'fs/promises';


export const getAllUsers = catchAsync(async (req, res, next) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const query = {
    role: { $ne: 'Admin' },
    $or: [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  };

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: users,
  });
});



export const getUsersByVerification = catchAsync(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;

  if (!['verified', 'unverified'].includes(status)) {
    return next(new ApiError(400, 'Invalid status. Use "verified" or "unverified"'));
  }

  const isVerified = status === 'verified';
  console.log("isVerified",isVerified);
  
  const query = { verifyStatus: isVerified };
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: users,
  });
});



export const toggleBlockUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new ApiError(404, 'User not found'));

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    data: user,
  });
});


export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) return next(new ApiError(404, 'User not found'));

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});


export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return next(new ApiError(404, 'User not found'));

  res.status(200).json({
    success: true,
    data: user,
  });
})

export const updateUserProfile = catchAsync(async (req, res, next) => {
  const userId=req.user._id;
  const {username,oldPassword,newPassword} = req.body;
  const user = await User.findById(userId);
  if (!user) return next(new ApiError(404, 'User not found'));

  if (username) user.username = username;
  if (oldPassword && newPassword) {
    const isMatch = await comparePasswords(oldPassword,user.password);
    if (!isMatch) return next(new ApiError(400, 'Old password is incorrect'));
    if(oldPassword === newPassword) return next(new ApiError(400, 'New password cannot be the same as old password'));
    user.password = newPassword;
  }

  // Upload avatar if provided
  if (req.file) {
    // Delete old avatar from cloudinary if exists
    if (user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mazracare/avatars',
    });

    user.avatar = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    // Delete temp file
    await fs.unlink(req.file.path);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });

})