import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../middlewares/catchAsync.js';


export const addToWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, 'Product not found'));

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [productId] });
  } else {
    const alreadyInWishlist = wishlist.products.includes(productId);
    if (alreadyInWishlist) {
      return res.status(200).json({
        success: true,
        message: 'Product already in wishlist',
      });
    }
    wishlist.products.push(productId);
    wishlist.updatedAt = Date.now();
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: wishlist,
  });
});



export const getWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: 'products',
    select: 'name price discountedPrice stock images slug category',
  });

  if (!wishlist || wishlist.products.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: 'Your wishlist is empty',
    });
  }

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});



export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) return next(new ApiError(404, 'Wishlist not found'));

  const index = wishlist.products.indexOf(productId);
  if (index === -1) return next(new ApiError(404, 'Product not in wishlist'));

  wishlist.products.splice(index, 1);
  wishlist.updatedAt = Date.now();
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: wishlist,
  });
});



export const clearWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist || wishlist.products.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'Wishlist already empty',
      data: [],
    });
  }

  wishlist.products = [];
  wishlist.updatedAt = Date.now();
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared successfully',
    data: wishlist,
  });
});



export const toggleWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, 'Product not found'));

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    // If wishlist doesn't exist, create and add product
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });
    return res.status(200).json({
      success: true,
      action: 'added',
      message: 'Product added to wishlist',
      data: wishlist,
    });
  }

  const index = wishlist.products.indexOf(productId);

  if (index > -1) {
    // Already in wishlist => remove it
    wishlist.products.splice(index, 1);
    await wishlist.save();
    return res.status(200).json({
      success: true,
      action: 'removed',
      message: 'Product removed from wishlist',
      data: wishlist,
    });
  } else {
    // Not in wishlist => add it
    wishlist.products.push(productId);
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    return res.status(200).json({
      success: true,
      action: 'added',
      message: 'Product added to wishlist',
      data: wishlist,
    });
  }
});