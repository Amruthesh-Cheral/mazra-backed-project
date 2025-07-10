import express from 'express';
import { getUsers, google, resendVerificationEmail, signin, signup, verifyEmail } from '../controllers/auth.controller.js';

const authRouter = express.Router();
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/resend-verify-email-otp', resendVerificationEmail);
authRouter.post('/google', google);
authRouter.get('/get-user', getUsers);

export default authRouter;
