import { axiosInstance } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST_URL } from "@/utils/constants";
import moment from "moment";
import { useRef, useEffect } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoArrowDownCircleSharp } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectChatData,
    selectChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

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

    if (selectChatData._id) {
      if (selectChatType === "contact") {
        getMessages();
      }
    }
  }, [selectChatData, selectChatType, setSelectedChatMessages]);
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
    const response = await axiosInstance.get(`${HOST_URL}/${url}`, {
      responseType: "blob",
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  };

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
              <div className="cursor-pointer">
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
  return (
    <div className="overflow-y-auto  flex-1 scrollbar-hidden p-4 px-8 w-full md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
