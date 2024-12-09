import jwt from "jsonwebtoken";
//? Function To Create Acookie:
export const createTokenAndSetCookies = (email, userId, res) => {
    const token = jwt.sign({ email, userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });
    res.cookie("jwt_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return token;
  };