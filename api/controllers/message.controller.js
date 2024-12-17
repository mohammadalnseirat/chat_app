import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

//! 1-Function To Get All messages:

export const getAllMessages = async (req, res, next) => {
  try {
    const currentUser = req.userId;
    const userToChat = req.body._id;
    if (!currentUser || !userToChat) {
      return next(errorHandler(400, "Please provide user ids."));
    }
    const messages = await Message.find({
      $or: [
        { sender: currentUser, recipient: userToChat },
        { sender: userToChat, recipient: currentUser },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log("Error getting all messages", error.message);
    next(error);
  }
};
