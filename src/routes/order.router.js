import { directBuy, getAllOrders, getMyOrders, placeOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import express from "express"

const orderRouter=express.Router()

orderRouter.post('/', verifyToken, placeOrder);            // Cart checkout
orderRouter.post('/direct', verifyToken, directBuy);       // Direct Buy
orderRouter.get('/my', verifyToken, getMyOrders);          // User orders with pagination
orderRouter.get('/', verifyToken, authorizeRoles("Admin"), getAllOrders);
orderRouter.patch('/:id/status',verifyToken,authorizeRoles("Admin"),updateOrderStatus)


export default orderRouter;
