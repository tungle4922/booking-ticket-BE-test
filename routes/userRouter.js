import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  login,
  loginWithToken,
  signup,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login); //Login token
userRouter.post("/loginToken", loginWithToken); //Login token
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
