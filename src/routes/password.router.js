import express from 'express';
import { 
  forgotPassword, 
//   verifyPasswordResetOTP, 
  resetPassword 
} from '../controllers/password.controller.js';

const passRouter = express.Router();

passRouter.post('/forgot-password', forgotPassword);
// passRouter.post('/verify-reset-otp',verifyPasswordResetOTP);
passRouter.post('/reset-password', resetPassword);

export default passRouter;