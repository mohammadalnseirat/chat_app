import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    const connecting = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connecting to MongoDB", connecting.connection.host);
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
    process.exit(1);
  }
};
