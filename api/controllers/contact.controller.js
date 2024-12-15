import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

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
