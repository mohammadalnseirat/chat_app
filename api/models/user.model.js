import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    color: {
      type: Number,
      required: false,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//? hash the password:
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = bcryptjs.genSaltSync(10);
    this.password = bcryptjs.hashSync(this.password, salt);
    next();
  } catch (error) {
    console.log("Error while hashing password", error.message);
    next(error);
  }
});



const User = mongoose.model("User", userSchema);
export default User;
