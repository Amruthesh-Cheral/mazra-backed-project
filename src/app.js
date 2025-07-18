import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import errorHandler from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';
import authRouter from './routes/auth.router.js';
import passRouter from './routes/password.router.js';
import productRouter from './routes/product.router.js';
import cookieParser from 'cookie-parser';
import cartRouter from './routes/cart.router.js';
import userRouter from './routes/user.router.js';
import orderRouter from './routes/order.router.js';
import wishlistRouter from './routes/wishlist.router.js';
import serviceRouter from './routes/service.router.js';
import blogRouter from './routes/blog.router.js';
import dashboardRouter from './routes/dashboard.route.js';

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/password', passRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api/service', serviceRouter);
app.use('/api/blog', blogRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 Handler (if no route matches)
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// Centralized error handler (must be last!)
app.use(errorHandler);

export default app;