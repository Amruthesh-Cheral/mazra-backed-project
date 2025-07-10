import express from 'express';
import {  google, resendVerificationEmail, signin, signup, verifyEmail } from '../controllers/auth.controller.js';

const authRouter = express.Router();
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/resend-verify-email-otp', resendVerificationEmail);
authRouter.post('/google', google);

export default authRouter;
