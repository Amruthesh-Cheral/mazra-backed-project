import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  clearWishlist,
  getUserWishlistByAdmin,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/", verifyToken, addToWishlist);
wishlistRouter.get("/", verifyToken, getWishlist);
wishlistRouter.get(
  "/:userId/wishlist",
  verifyToken,
  authorizeRoles("Admin"),
  getUserWishlistByAdmin
);
wishlistRouter.delete("/:productId", verifyToken, removeFromWishlist);
wishlistRouter.delete("/", verifyToken, clearWishlist);


export default wishlistRouter;