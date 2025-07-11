import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  getUsersByVerification,
  toggleBlockUser,
  updateUserProfile,
} from "../controllers/user.controller";
import upload from "../middlewares/multer.middleware";

const userRouter = express.Router();

userRouter.get("/", verifyToken, authorizeRoles("Admin"), getAllUsers);
userRouter.get(
  "/filter",
  verifyToken,
  authorizeRoles("Admin"),
  getUsersByVerification
);
userRouter.get('/profile', verifyToken, getUserProfile);
userRouter.delete("/:id", verifyToken, authorizeRoles("Admin"), deleteUser);
userRouter.patch(
  "/:id/block",
  verifyToken,
  authorizeRoles("Admin"),
  toggleBlockUser
);


userRouter.put(
  '/profile/update',
  verifyToken,
  upload.single('avatar'),
  updateUserProfile
);