import catchAsync from "../middlewares/catchAsync";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const query = {
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