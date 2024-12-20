import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createNewChannel,
  getAllUsersChannel,
  getChannelMessages,
} from "../controllers/channel.controller.js";

const router = Router();

router.post("/create-channel", verifyToken, createNewChannel);
router.get("/get-users-channel", verifyToken, getAllUsersChannel);
router.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default router;
