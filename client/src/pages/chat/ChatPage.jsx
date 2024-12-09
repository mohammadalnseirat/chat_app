import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChatPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();

  //? useEffect for side effect:
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>ChatPage</div>;
};

export default ChatPage;
