import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  deleteUser,
  getAllUsers,
  getUsersByVerification,
  toggleBlockUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", verifyToken, authorizeRoles("Admin"), getAllUsers);
userRouter.get(
  "/filter",
  verifyToken,
  authorizeRoles("Admin"),
  getUsersByVerification
);
userRouter.delete("/:id", verifyToken, authorizeRoles("Admin"), deleteUser);
userRouter.patch(
  "/:id/block",
  verifyToken,
  authorizeRoles("Admin"),
  toggleBlockUser
);
