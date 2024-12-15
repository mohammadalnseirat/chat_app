import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChatContainer from "./components/EmptyChatContainer";
import ChatContainer from "./components/ChatContainer";

const ChatPage = () => {
  const navigate = useNavigate();
  const { userInfo, selectChatType } = useAppStore();

  //? useEffect for side effect:
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] overflow-hidden text-gray-100">
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
