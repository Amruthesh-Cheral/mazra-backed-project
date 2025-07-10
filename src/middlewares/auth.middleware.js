import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new ApiError(401, 'Unauthorized - No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // sync version

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Unauthorized - Invalid token'));
  }
};
