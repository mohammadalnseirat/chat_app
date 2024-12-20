import mongoose from "mongoose";
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

//! 1-Function To Create A Channel:
export const createNewChannel = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, members } = req.body;
    if (!name || name === "" || !members || members.length === 0) {
      return next(
        errorHandler(
          400,
          "Please provide channel name and members To create a channel."
        )
      );
    }
    const admin = await User.findById(userId);
    if (!admin) {
      return next(
        errorHandler(403, "You are not authorized to create a channel.")
      );
    }
    //? Validate the Members:
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return next(
        errorHandler(
          400,
          "Some members were not found and are not valid users."
        )
      );
    }

    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return next(
        errorHandler(
          400,
          "Channel name already exists. Please choose a different one."
        )
      );
    }

    //! create a new channel:
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();
    res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log("Error creating new channel", error.message);
    next(error);
  }
};

//! 2-Function To Get All Users Channel:
export const getAllUsersChannel = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    res.status(200).json({ channels });
  } catch (error) {
    console.log("Error getting all users channel", error.message);
    next(error);
  }
};

//! 3-Function To Get Channel Messages:
export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    // ? Find The Channel and populate the message and the sender:
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "_id email firstName lastName image color",
      },
    });
    if (!channel) {
      return next(errorHandler(404, "Channel not found"));
    }
    const messages = channel.messages;
    //? send the response back to the client:
    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error getting channel messages", error.message);
    next(error);
  }
};
