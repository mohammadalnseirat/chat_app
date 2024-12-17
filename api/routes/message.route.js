import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/get-all-messages", verifyToken, getAllMessages);

export default router;
