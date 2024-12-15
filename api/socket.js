import { Server as socketServer } from "socket.io";

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

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected with ${userId} with socketId:${socket.id}`);
    } else {
      console.log("No userId found in the connection");
    }

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
