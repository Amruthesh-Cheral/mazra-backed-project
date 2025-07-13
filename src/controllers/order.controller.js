import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../middlewares/catchAsync.js';
import User from '../models/user.model.js';

export const placeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const {
    shippingAddress,
    paymentMethod = 'CashOnDelivery',
  } = req.body;

  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return next(new ApiError(400, 'Cart is empty'));
  }

  let totalPrice = 0;
  const orderItems = [];

  for (let item of cart.items) {
    const product = item.product;

    if (!product || product.stock < item.quantity) {
      return next(new ApiError(400, `Not enough stock for ${product?.name || 'item'}`));
    }

    // Deduct stock
    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: item.priceAtAdded,
    });

    totalPrice += item.priceAtAdded * item.quantity;
  }

  const newOrder = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    totalPrice,
    paymentMethod,
    paymentStatus: paymentMethod === 'Online' ? 'Pending' : 'Pending',
  });

  // Clear cart after order
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: newOrder,
  });
});


export const directBuy = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity, shippingAddress, paymentMethod = 'CashOnDelivery' } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return next(new ApiError(400, 'Valid product and quantity are required'));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, 'Product not found'));

  if (product.stock < quantity) {
    return next(new ApiError(400, 'Not enough stock available'));
  }

  const price = product.discountedPrice || product.price;
  const totalPrice = price * quantity;

  // Reduce stock
  product.stock -= quantity;
  await product.save();

  const newOrder = await Order.create({
    user: userId,
    orderItems: [{
      product: product._id,
      quantity,
      price,
    }],
    shippingAddress,
    totalPrice,
    paymentMethod,
    paymentStatus: paymentMethod === 'Online' ? 'Pending' : 'Pending',
  });

  res.status(201).json({
    success: true,
    message: 'Order placed directly from product page',
    data: newOrder,
  });
});



export const getMyOrders = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const total = await Order.countDocuments({ user: userId });
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalOrders: total,
    data: orders,
  });
});



export const getAllOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, search, paymentStatus, orderStatus, paymentMethod } = req.query;

  const query = {};

  // Search by username (case-insensitive)
  if (search) {
    const users = await User.find({
      username: { $regex: search, $options: 'i' },
    }).select('_id');
    query.user = { $in: users.map(u => u._id) };
  }

  // Filters
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (orderStatus) query.orderStatus = orderStatus;
  if (paymentMethod) query.paymentMethod = paymentMethod;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalOrders: total,
    data: orders,
  });
});





export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) return next(new ApiError(404, 'Order not found'));

  order.orderStatus = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order,
  });
});
