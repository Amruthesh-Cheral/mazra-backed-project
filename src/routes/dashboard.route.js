import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { getAdminDashboard } from '../controllers/dashboard.controller.js';

const dashboardRouter=express.Router();


dashboardRouter.get('/',verifyToken,authorizeRoles("Admin"),getAdminDashboard)

export default dashboardRouter;