import { useAppStore } from "@/store";
import { HOST_URL } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

//? custom context:
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST_URL, {
        withCredentials: true,
        query: {
          userId: userInfo._id,
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to the socket server");
      });

      //! Function called to receive message event:
      const handleReceiveMessage = (message) => {
        const {
          selectChatType,
          selectChatData,
          addMessages,
          addContactsInContactList,
        } = useAppStore.getState();
        if (
          selectChatType !== undefined &&
          (selectChatData._id === message.sender._id ||
            selectChatData._id === message.recipient._id)
        ) {
          // console.log("Received message:", message);
          addMessages(message);
        }
        addContactsInContactList(message);
      };

      // ! Function called to  Receive Channel Message event:
      const handleReceiveChannelMessage = (message) => {
        const {
          selectChatType,
          selectChatData,
          addMessages,
          addChannelInChannelList,
        } = useAppStore.getState();
        if (
          selectChatType !== undefined &&
          selectChatData._id === message.channelId
        ) {
          addMessages(message);
        }
        addChannelInChannelList(message);
      };
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);
      // ? Disconnect from the socket server when the component is unmounted:
      return () => {
        socket.current.disconnect();
        console.log("Disconnected from the socket server");
      };
    }
  }, [userInfo]);
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
