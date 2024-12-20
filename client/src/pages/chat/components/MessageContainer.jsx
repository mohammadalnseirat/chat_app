import { axiosInstance } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES_ROUTE,
  HOST_URL,
} from "@/utils/constants";
import moment from "moment";
import { useRef, useEffect, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoArrowDownCircleSharp, IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { toast } from "sonner";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    userInfo,
    selectChatData,
    selectChatType,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownLoading,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  //! useEffect To Get All Messages:
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axiosInstance.post(
          `${GET_ALL_MESSAGES_ROUTE}`,
          { _id: selectChatData._id },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    //? Finction To Get All Messages For Channel:
    const getChannelMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `${GET_CHANNEL_MESSAGES_ROUTE}/${selectChatData._id}`,
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    if (selectChatData._id) {
      if (selectChatType === "contact") {
        getMessages();
      }
      if (selectChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectChatData, selectChatType, setSelectedChatMessages]);

  //? useEffect To Scroll Down Automatically:
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="font-semibold text-green-500 my-2 text-center">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectChatType === "contact" && renderDmMessage(message)}
          {selectChatType === "channel" && renderDmChannelMessage(message)}
        </div>
      );
    });
  };
  //////////////////////////////////////////////////////////////
  //! Function To Check if a message file is image or file:
  const checkFileImage = (filePath) => {
    // regex pattern:
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmb|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  //! Function To DownLoad File:
  const downloadFile = async (url) => {
    setIsDownLoading(true);
    setFileDownloadProgress(0);
    const response = await axiosInstance.get(`${HOST_URL}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        const percentageCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentageCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownLoading(false);
    setFileDownloadProgress(0);
  };

  //! Function To Render Message For User:
  const renderDmMessage = (message) => {
    return (
      <div
        className={`${
          message.sender === selectChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectChatData._id
                ? "bg-gray-800 text-gray-50  border-gray-700"
                : "bg-green-500 text-gray-50  border-green-700"
            } border p-4 my-1 rounded inline-block max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectChatData._id
                ? "bg-gray-800 text-gray-50  border-gray-700"
                : "bg-gray-800 text-gray-50  border-gray-600"
            } border p-4 my-1 rounded inline-block max-w-[50%] break-words`}
          >
            {checkFileImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST_URL}/${message.fileUrl}`}
                  alt="image-file"
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 ">
                <span className="text-3xl text-green-500 p-3 bg-gray-900 rounded-full">
                  <MdFolderZip />
                </span>
                <span className="truncate">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="text-2xl text-gray-50 p-3 bg-gray-900 rounded-full  transition-all duration-300 cursor-pointer group"
                >
                  <IoArrowDownCircleSharp className="group-hover:animate-bounce group-hover:text-red-600" />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  //! Function To Render Message For Channel:
  const renderDmChannelMessage = (message) => {
    console.log(message);
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-green-500 text-gray-50  border-green-700"
                : "bg-cyan-800 text-gray-50  border-gray-700"
            } border p-4 my-1 ml-9 rounded inline-block max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-gray-800 text-gray-50  border-gray-700"
                : "bg-gray-800 text-gray-50  border-gray-600"
            } border p-4 my-1 rounded inline-block max-w-[50%] break-words`}
          >
            {checkFileImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST_URL}/${message.fileUrl}`}
                  alt="image-file"
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 ">
                <span className="text-3xl text-green-500 p-3 bg-gray-900 rounded-full">
                  <MdFolderZip />
                </span>
                <span className="truncate">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="text-2xl text-gray-50 p-3 bg-gray-900 rounded-full  transition-all duration-300 cursor-pointer group"
                >
                  <IoArrowDownCircleSharp className="group-hover:animate-bounce group-hover:text-red-600" />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo._id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="w-8 h-8 overflow-hidden rounded-full">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST_URL}/${message.sender.image}`}
                  alt="user-profile-image"
                  className="w-full h-full object-cover bg-black rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase w-8 h-8 flex items-center justify-center rounded-full text-lg ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-300">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-gray-500 italic">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1 italic">
            {moment(message.timestamp).format("LT")}
          </p>
        )}
      </div>
    );
  };

  //? Main Part Of The Code:
  return (
    <div className="overflow-y-auto  flex-1 scrollbar-hidden p-4 px-8 w-full md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-10 backdrop-blur-xl">
          <div className="mt-10">
            <img
              src={`${HOST_URL}/${imageURL}`}
              alt="image-Url"
              className="w-full h-[80vh] bg-cover "
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
              className="text-3xl group text-red-500 p-2 bg-gray-900 rounded-full"
            >
              <IoCloseSharp className="group-hover:animate-spin" />
            </button>
            <button
              onClick={() => downloadFile(imageURL)}
              className="text-2xl text-gray-50 p-2 bg-gray-900 rounded-full  transition-all duration-300 cursor-pointer group"
            >
              <IoArrowDownCircleSharp className="group-hover:animate-bounce group-hover:text-red-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
