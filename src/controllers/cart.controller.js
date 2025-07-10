import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../middlewares/catchAsync.js';

export const addToCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return next(new ApiError(400, 'Product ID and valid quantity are required'));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  if (product.stock < quantity) {
    return next(new ApiError(400, 'Not enough stock'));
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart if not exist
    cart = await Cart.create({
      user: userId,
      items: [{
        product: productId,
        quantity,
        priceAtAdded: product.discountedPrice || product.price,
      }],
    });
  } else {
    // Update if product already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtAdded: product.discountedPrice || product.price,
      });
    }
    cart.updatedAt = Date.now();
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Product added to cart',
    data: cart,
  });
});



export const getCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price discountedPrice stock images slug category',
  });

  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: 'Your cart is empty',
    });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});



export const removeFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new ApiError(404, 'Cart not found'));

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new ApiError(404, 'Product not found in cart'));
  }

  cart.items.splice(itemIndex, 1); // Remove item
  cart.updatedAt = Date.now();
  await cart.save();

  if (cart.items.length === 0) {
  await Cart.findByIdAndDelete(cart._id);
  return res.status(200).json({
    success: true,
    message: 'Cart is now empty and deleted',
    data: [],
  });
}

  res.status(200).json({
    success: true,
    message: 'Product removed from cart',
    data: cart,
  });
});


export const updateCartItem = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new ApiError(400, 'Quantity must be at least 1'));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  if (product.stock < quantity) {
    return next(new ApiError(400, 'Requested quantity exceeds stock'));
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new ApiError(404, 'Cart not found'));

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    return next(new ApiError(404, 'Product not in cart'));
  }

  item.quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart item quantity updated',
    data: cart,
  });
});



export const clearCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'Cart is already empty',
      data: [],
    });
  }

  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: cart,
  });
});
