import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import contactRoutes from "./routes/contact.route.js";
import channelRoutes from "./routes/channel.route.js";
import { setupSocket } from "./socket.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
//! setup static file directory:
const __dirname = path.resolve();
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles")); //! Express Static For Multer For Profile
app.use("/uploads/files", express.static("uploads/files")); //! Express Static For Multer For Files
app.use(express.json());
app.use(cookieParser());

//! Routes:
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/channels", channelRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

//! Listen To The Port:
const server = app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});

setupSocket(server);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
