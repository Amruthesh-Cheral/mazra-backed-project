import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cart.controller.js';


const cartRouter=express.Router();


cartRouter.post('/add',verifyToken,addToCart)



cartRouter.get('/',verifyToken,getCart)




cartRouter.delete('/remove/:productId', verifyToken, removeFromCart);
cartRouter.delete('/clear', verifyToken, removeFromCart);

cartRouter.put('/update/:productId', verifyToken, updateCartItem);



export default cartRouter;