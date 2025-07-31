import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { createBlog, deleteBlog, getBlogs, getSingleBlog, updateBlog } from '../controllers/blog.controller.js';
import upload from '../middlewares/multer.middleware.js';

const blogRouter=express.Router();


blogRouter.post('/',verifyToken,authorizeRoles("Admin"),upload.single('image'),createBlog);
blogRouter.get('/',getBlogs);
blogRouter.get('/:id',getSingleBlog);
blogRouter.put('/:id',verifyToken,authorizeRoles("Admin"),upload.single('image'),updateBlog);
blogRouter.delete('/:id',verifyToken,authorizeRoles("Admin"),deleteBlog);


export default blogRouter;