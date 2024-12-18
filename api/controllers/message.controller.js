import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { mkdirSync, renameSync } from "fs";

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

//! 2-Function To Send File Message:
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded. Please Upload A File."));
    }
    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    //! rename the file:
    renameSync(req.file.path, fileName);

    //? send the respone back to the server:
    res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.log("Error uploading file", error.message);
    next(error);
  }
};
