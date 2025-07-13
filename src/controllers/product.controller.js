import cloudinary from '../config/cloudinary.js';
import catchAsync from '../middlewares/catchAsync.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import slugify from 'slugify';
import { serviceCategoryMap } from '../seeder/categoryData.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    price,
    service,
    discountPercent,
    category,
    stock,
    isFeatured,
  } = req.body;

  if (!name || !description || !price || !service || !category || !stock) {
    return next(new ApiError(400, 'Missing required product fields'));
  }

  if ( !serviceCategoryMap[service]?.includes(category)) {
  return next(new ApiError(400, 'Invalid category for selected service'));
}

  if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, 'Product images are required'));
  }

  const uploadedImages = [];

  try {
    for (const file of req.files) {
  const compressedPath = `uploads/compressed-${file.filename}`;

  await sharp(file.path)
    .resize(1024) // resize width (auto height)
    .jpeg({ quality: 70 }) // compress
    .toFile(compressedPath);

  const result = await cloudinary.uploader.upload(compressedPath, {
    folder: 'products',
  });

  uploadedImages.push({
    url: result.secure_url,
    public_id: result.public_id,
  });

  // Delete both original and compressed files
  await fs.unlink(file.path);
  await fs.unlink(compressedPath);
}
  } catch (error) {
    console.log(error);
    
    return next(new ApiError(500, 'Image upload failed'));
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPercent,
    category,
    stock,
    isFeatured,
    images: uploadedImages,
  });

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully',
  });
});



export const getAllProducts = catchAsync(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    keyword = '',
    category,
    service,
    sort = '-createdAt',
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = {
    name: { $regex: keyword, $options: 'i' }, // letter-by-letter filter
  };

  if (category) filter.category = category;
  if (service) filter.service = service;

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: products,
  });
});



export const getProductBySlug = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});




export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) return next(new ApiError(404, 'Product not found'));

  const {
    name,
    description,
    price,
    discountPercent,
    service,
    category,
    stock,
    isFeatured,
  } = req.body;

  // Handle image replacement
  const newImages = [];

  if (req.files && req.files.length > 0) {
    // Delete existing Cloudinary images
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // Upload new compressed images
    for (const file of req.files) {
      const compressedPath = `uploads/compressed-${file.filename}`;
      await sharp(file.path)
        .resize(1024)
        .jpeg({ quality: 70 })
        .toFile(compressedPath);

      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: 'products',
      });

      newImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      await fs.unlink(file.path);
      await fs.unlink(compressedPath);
    }
  }

  // Update product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discountPercent = discountPercent || product.discountPercent;
  product.service = service || product.service;
  product.category = category || product.category;
  product.stock = stock || product.stock;
  product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
  if (newImages.length > 0) product.images = newImages;

  // Update slug if name changes
  if (name) {
    product.slug = slugify(name, { lower: true, strict: true });
  }

  await product.save();

  res.status(200).json({
    success: true,
    data: product,
    message: 'Product updated successfully',
  });
});



export const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return next(new ApiError(404, 'Product not found'));

  // Delete images from Cloudinary
  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  // Delete the product from DB
  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});