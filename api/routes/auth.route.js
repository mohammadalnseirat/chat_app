import express from "express";
import {
  getUserInfoData,
  loginUser,
  logOutUser,
  signUpUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sign-up", signUpUser);
router.post("/sign-in", loginUser);
router.post("/log-out", logOutUser);
router.get("/get-user-info", verifyToken, getUserInfoData);

export default router;
