import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChatContainer from "./components/EmptyChatContainer";
import ChatContainer from "./components/ChatContainer";

const ChatPage = () => {
  const navigate = useNavigate();
  const {
    userInfo,
    selectChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownLoadProgress,
  } = useAppStore();

  //? useEffect for side effect:
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] overflow-hidden text-gray-100">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 text-gray-50 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-xl">
          <h5 className="text-5xl font-mono italic animate-pulse text-green-500">
            Uploading File :
          </h5>
          {fileUploadProgress} %
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-40 bg-black text-gray-80 flex items-center justify-center flex-col gap-5 backdrop-blur-xl">
          <h5 className="text-5xl font-mono italic text-red-500 animate-pulse">
            Downloading File :
          </h5>
          {fileDownLoadProgress} %
        </div>
      )}

      <ContactsContainer />

      {selectChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default ChatPage;
