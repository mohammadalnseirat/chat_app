import { Server as socketServer } from "socket.io";
import Message from "./models/message.model.js";

export const setupSocket = (server) => {
  const io = new socketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map(); // set the userid to the socket id //!{userId:socket.id}
  const disconnect = (socket) => {
    console.log(`user disconnect from socket: ${socket.id}`);
    //? remove the userId from the map:
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break; // break the loop once we found the userId to remove it from the map.
      }
    }
  };

  //! Function to send message:
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender); // get the sender id from the message.
    const recipientSocketId = userSocketMap.get(message.recipient); // get the recipient id from the message.
    // create a new message to send:
    const createdMessage = await Message.create(message);

    //? send detailed message:
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "_id email firstName lastName image color")
      .populate("recipient", "_id email firstName lastName image color");

    // ? send detailed message to recipient and sender:
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData); // emit the message to the recipient socket id. //!io.to(recipientSocketId).emit("message", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData); // emit the message to the sender socket id.
    }
  };

  //! connection to the socket server:
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected with ${userId} with socketId:${socket.id}`);
    } else {
      console.log("No userId found in the connection");
    }
    //?event to send message:
    socket.on("sendMessage", sendMessage);
    //? disconnect:
    socket.on("disconnect", () => disconnect(socket));
  });
};

// import { Server } from "socket.io";
// import express from "express";
// import http from "http";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// const userSocketMap = new Map(); // set the userid to the socket id //!{userId:socket.id}
// //! Function to dissconnection to the socket:
// const disconnect = (socket) => {
//   console.log(`user disconnect from socket: ${socket.id}`);
//   //? remove the userId from the map:
//   for (const [userId, socketId] of userSocketMap.entries()) {
//     if (socketId === socket.id) {
//       userSocketMap.delete(userId);
//       break; // break the loop once we found the userId to remove it from the map.
//     }
//   }
// };

// //!connection:
// io.on("connection", (socket) => {
//   // get the userid:
//   const userId = socket.handshake.query.userId;
//   //? set userId to the socket id:
//   if (userId) {
//     userSocketMap.set(userId, socket.id);
//     console.log(`user connected with ${userId} with socketId:${socket.id}`);
//   } else {
//     console.log("No userId found in the connection");
//   }

//   //? disconnect:
//   socket.on("disconnect", () => disconnect(socket));
// });

// export { app, io, server };
