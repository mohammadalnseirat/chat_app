import User from "../models/user.model.js";
import { createTokenAndSetCookies } from "../utils/createTokenAndSetCookies.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

//! 1-Function Sign Up:
export const signUpUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "Please provide email and password"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Email already exists"));
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return next(
        errorHandler(
          400,
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
      );
    }
    // create a new User:
    const newUser = new User({
      email,
      password,
    });

    if (newUser) {
      //? generate token:
      createTokenAndSetCookies(newUser.email, newUser._id, res);
      await newUser.save();
      res.status(201).json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          profileSetup: newUser.profileSetup,
        },
      });
    } else {
      return next(errorHandler(500, "Failed to create user"));
    }
  } catch (error) {
    console.log("Error signing up user", error.message);
    next(error);
  }
};

//! 2-Function Login:
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "Please Provide all required fields."));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Invalid Credentials."));
    }
    //! check if password is correct:
    const isMatchPassword = bcryptjs.compareSync(password, user.password);
    if (!isMatchPassword) {
      return next(errorHandler(401, "Email or Password is incorrect."));
    }
    if (user) {
      createTokenAndSetCookies(user.email, user._id, res);
      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          profileSetup: user.profileSetup,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          color: user.color,
        },
      });
    } else {
      return next(errorHandler(401, "Failed to login user."));
    }
  } catch (error) {
    console.log("Error logging in user", error.message);
    next(error);
  }
};

//! 3-Function LogOut:
export const logOutUser = async (req, res, next) => {
  try {
    res.clearCookie("jwt-token");
    res.status(200).json({
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.log("Error logging out user", error.message);
    next(error);
  }
};

//! 4-Function Get User Info:
export const getUserInfoData = async (req, res, next) => {
  try {
    // console.log(req.userId)
    const userInfoData = await User.findById(req.userId);
    if (!userInfoData) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json({
      _id: userInfoData._id,
      email: userInfoData.email,
      profileSetup: userInfoData.profileSetup,
      firstName: userInfoData.firstName,
      lastName: userInfoData.lastName,
      image: userInfoData.image,
      color: userInfoData.color,
    });
  } catch (error) {
    console.log("Error getting user info", error.message);
    next(error);
  }
};
