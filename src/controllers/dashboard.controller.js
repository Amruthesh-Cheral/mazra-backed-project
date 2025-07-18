import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Blog from '../models/blog.model.js';
import catchAsync from '../middlewares/catchAsync.js';

export const getAdminDashboard = catchAsync(async (req, res) => {
  // 1. Top Cards
  const [totalOrders, totalUsers, totalProducts, totalBlogs] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments(),
    Product.countDocuments(),
    Blog.countDocuments(),
  ]);

  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
  ]);

  const pendingEmailVerifications = await User.countDocuments({ verifyStatus: false });

  const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name stock');

  // 2. Recent Orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'username')
    .select('orderId user createdAt paymentMethod paymentStatus orderStatus');

  // 3. Sales Summary - Monthly Sales
  const monthlySalesRaw = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
          $lte: new Date(),
        }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: "$totalAmount" }
      }
    },
    {
      $project: {
        month: '$_id',
        sales: '$totalSales',
        _id: 0
      }
    },
    { $sort: { month: 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySales = monthNames.map((name, index) => {
    const match = monthlySalesRaw.find(item => item.month === index + 1);
    return {
      month: name,
      sales: match ? match.sales : 0
    };
  });

  // 4. New Users
  const latestUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('username email createdAt');

  // 5. Product Summary
  const bestSellingProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        name: "$product.name",
        totalSold: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  const recentlyAddedProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name createdAt');

  res.status(200).json({
    stats: {
      totalOrders,
      totalUsers,
      totalProducts,
      totalBlogs,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      pendingEmailVerifications,
      lowStockAlerts: lowStockProducts
    },
    recentOrders,
    salesSummary: monthlySales,
    latestUsers,
    productSummary: {
      bestSellingProducts,
      recentlyAddedProducts,
    }
  });
});
