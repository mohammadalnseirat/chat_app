import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token) {
      return next(errorHandler(401, "Un-authorized, No Token Provided"));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return next(errorHandler(401, "Un-authorized, Invalid Token"));
      } else {
        req.userId = payload.userId;
        next();
      }
    });
  } catch (error) {
    console.log("Error verifying token", error.message);
    next(error);
  }
};
