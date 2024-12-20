import { Server as socketServer } from "socket.io";
import Message from "./models/message.model.js";
import Channel from "./models/channel.model.js";

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

  //! 1-Function to send message:
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

  //! 2-Function To Send Channel Message:
  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    //* 1-Create a message to send:
    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
      timestamp: new Date(),
    });

    //* Find The message Data and Populate the message sender:
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "_id email firstName lastName image color")
      .exec();
    //* Push The message Data TO THE Message array in the channel:
    await Channel.findByIdAndUpdate(channelId, {
      $push: {
        messages: createMessage._id,
      },
    });

    //? Find The Channel:
    const channel = await Channel.findById(channelId).populate("members");

    //? Final Data To send the event:
    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData); // emit the message to the recipient socket id.
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData); // emit the message to the admin socket id.
      }
    }
  };

  //! 3-connection to the socket server:
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
    //? event to send channel message:
    socket.on("send-channel-message", sendChannelMessage);
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
