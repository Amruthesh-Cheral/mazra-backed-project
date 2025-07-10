import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// Compare password with hashed password
export const comparePasswords = async (inputPassword, userPassword) => {
  return await bcrypt.compare(inputPassword, userPassword);
};