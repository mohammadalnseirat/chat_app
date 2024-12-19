import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";

//! 1-Function To Search Contacts:
export const searchContacts = async (req, res, next) => {
  try {
    const { userId } = req;
    const { searchTerm } = req.body;

    if (!searchTerm) {
      return next(errorHandler(400, "Please enter something to search."));
    }

    //? remove special characters:(using RegExp)
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    }).select("-password");

    if (!contacts) {
      return next(errorHandler(400, "No contacts found"));
    } else {
      res.status(200).json({ contacts });
    }
  } catch (error) {
    console.log("Error getting all contacts", error.message);
    next(error);
  }
};

//! 2-Function To Get All Contacts:
export const getAllContactsForDmList = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);
    //? Get all contacts from the message model:
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: {
            $first: "$timestamp",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
        },
      },
    ]);

    //? send the response back to the client:
    res.status(200).json({ contacts });
  } catch (error) {
    console.log("Error getting all contacts", error.message);
    next(error);
  }
};

//! 3-Function To Get All Contacts:
export const getAllContacts = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName _id email"
    );

    //? Add Label to Contact:
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));

    res.status(200).json({ contacts });
  } catch (error) {
    console.log("Error getting all contacts", error.message);
    next(error);
  }
};
