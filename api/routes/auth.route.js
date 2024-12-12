import express from "express";
import {
  deleteProfileImage,
  getUserInfoData,
  loginUser,
  logOutUser,
  signUpUser,
  updateProfile,
  uploadProfileImage,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/profiles/" });

router.post("/sign-up", signUpUser);
router.post("/sign-in", loginUser);
router.post("/log-out", logOutUser);
router.get("/get-user-info", verifyToken, getUserInfoData);
router.post("/update-profile", verifyToken, updateProfile);
router.post(
  "/upload-profile-image",
  verifyToken,
  upload.single("profile-image"),
  uploadProfileImage
);
router.delete("/remove-profile-image", verifyToken, deleteProfileImage);

export default router;
