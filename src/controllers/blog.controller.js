import Blog from '../models/blog.model.js';
import catchAsync from '../middlewares/catchAsync.js';
import { uploadToCloudinary } from '../utils/cloudinary.upload.js';
import ApiError from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';

export const createBlog = catchAsync(async (req, res) => {
  const { title, author, category, excerpt, content } = req.body;

  let image = {};
  if (req.file) {
    image = await uploadToCloudinary(req.file, 'blogs', 'image');
  }

  const blog = await Blog.create({ title, author, category, excerpt, content, image });
  res.status(201).json({ success: true, data: blog });
});

export const getBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: blogs });
});


export const getSingleBlog = catchAsync(async (req, res) => {
  const {id}=req.params;

  const blog = await Blog.findById(id);
  res.status(200).json({ success: true, data: blog });
});

export const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return next(new ApiError(404, 'Blog not found'));

  Object.assign(blog, req.body);
  if (req.file) {
    // optional: delete old image from Cloudinary
    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }
    blog.image = await uploadToCloudinary(req.file, 'blogs', 'image');
  }
  await blog.save();
  res.status(200).json({ success: true, data: blog });
});

export const deleteBlog = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const blog=await Blog.findById(id);
  if(!blog)return next(new ApiError(404,'Blog not found'))
  if (blog.image?.public_id) {
    await cloudinary.uploader.destroy(blog.image.public_id);
  }
  await Blog.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: 'Deleted' });
});
