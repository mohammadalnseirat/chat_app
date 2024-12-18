import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllMessages,
  uploadFile,
} from "../controllers/message.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/files" });

router.post("/get-all-messages", verifyToken, getAllMessages);
router.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default router;
