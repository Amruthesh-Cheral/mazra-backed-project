import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { addCategory, addService, deleteCategory, deleteService, getAllCategories, getAllServices, getCategoriesByService, updateCategory, updateService } from '../controllers/service.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const serviceRouter=express.Router();





serviceRouter.post(
  '/add-service',
  verifyToken,
  authorizeRoles("Admin"),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  addService
);
serviceRouter.post(
  '/add-category',
  verifyToken,
  authorizeRoles("Admin"),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  addCategory
);



serviceRouter.get(
  '/services',
  verifyToken,
  getAllServices
);
serviceRouter.get(
  '/categories/:serviceId',
  verifyToken,
  getCategoriesByService
);
serviceRouter.get(
  '/categories',
  verifyToken,
  getAllCategories
);


// Update Service
serviceRouter.put(
  '/service/:id',
  verifyToken,
  authorizeRoles("Admin"),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  updateService
);

// Update Category
serviceRouter.put(
  '/category/:id',
  verifyToken,
  authorizeRoles("Admin"),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  updateCategory
);

// Delete Service
serviceRouter.delete(
  '/service/:id',
  verifyToken,
  authorizeRoles("Admin"),
  deleteService
);

// Delete Category
serviceRouter.delete(
  '/category/:id',
  verifyToken,
  authorizeRoles("Admin"),
  deleteCategory
);





export default serviceRouter;