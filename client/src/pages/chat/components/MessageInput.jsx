import { useSocketContext } from "@/context/SocketContext";
import { axiosInstance } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageInput = () => {
  const {
    selectChatType,
    userInfo,
    selectChatData,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocketContext();
  const emojeRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [emojePickerOpen, setEmojePickerOpen] = useState(false);
  const isLoading = false;
  //? useEffect to handle Close emoje picker:
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (emojeRef.current && !emojeRef.current.contains(e.target)) {
        setEmojePickerOpen(false);
      }
    };

    //? add to the document:
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      //? remove from the document:
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  //! Function handleAddEmoje:
  const handleAddEmoje = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  //! Function sendMessage:
  const handleSendMessage = async () => {
    if (selectChatType === "contact") {
      //? emit the event send message:
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });

      //? clear the input field:
      setMessage("");
    }
  };

  //? handleAttachmentFile:
  const handleAttachmentFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ? handleFileAttachmentChange:
  const handleFileAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        setFileUploadProgress(0);
        const response = await axiosInstance.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            // const { loaded, total } = data;
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (response.status === 200 && response.data.filePath) {
          setIsUploading(false);
          setFileUploadProgress(0);
          toast.success("File uploaded successfully.");
          if (selectChatType === "contact") {
            //? emit the event send message:
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      setFileUploadProgress(0);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="h-[10vh] flex items-center justify-center bg-[#1c1d25] px-8 mb-5 gap-2">
      <div className="flex flex-1 rounded-md items-center gap-4 bg-[#2a2b33] border border-green-600 pr-5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type your message here..."
          className="flex-1 bg-transparent rounded-md p-5 focus:border-none focus:outline-none"
        />
        <button
          onClick={handleAttachmentFileClick}
          className="text-green-600 focus:border-none  focus:outline-none transition-all duration-300 "
        >
          <GrAttachment className="text-[24px]" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileAttachmentChange}
        />
        <div className="realtive">
          <button
            onClick={() => setEmojePickerOpen(!emojePickerOpen)}
            className="text-cyan-600 focus:border-none  focus:outline-none transition-all duration-300 "
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-20 right-0" ref={emojeRef}>
            <EmojiPicker
              theme="dark"
              open={emojePickerOpen}
              onEmojiClick={handleAddEmoje}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        disabled={isLoading}
        onClick={handleSendMessage}
        className="bg-green-600 hover:bg-green-700 text-gray-50 rounded-full  p-5 flex items-center justify-center text-center transition-all duration-300"
      >
        {isLoading ? (
          <Loader className="text-2xl animate-bounce" />
        ) : (
          <IoSend className="text-2xl" />
        )}
      </button>
    </div>
  );
};

export default MessageInput;
