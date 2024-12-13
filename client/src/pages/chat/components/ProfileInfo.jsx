import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axiosInstance } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST_URL, SIGN_OUT_ROUTE } from "@/utils/constants";
import { Loader } from "lucide-react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [isLaoding, setIsLaoding] = useState(false);

  //! handle Log Out:
  const handleLogOut = async () => {
    try {
      setIsLaoding(true);
      const response = await axiosInstance.post(
        SIGN_OUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUserInfo(null);
        toast.success(response.data.message);
        navigate("/auth");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLaoding(false);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-4 w-full bg-gray-900 border-t-2 border-purple-500">
      <div className="flex items-center justify-between gap-4">
        <div className="w-10 h-10 relative">
          <Avatar className="w-10 h-10  rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST_URL}/${userInfo.image}`}
                alt={userInfo.email}
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-10 w-10  text-md border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="truncate text-md">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : `${userInfo.email}`}
        </div>
        <div className="flex  justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={() => navigate("/profile")}>
                <FiEdit2 className="text-green-500 font-semibold text-xl" />
              </TooltipTrigger>
              <TooltipContent className="bg-green-500 border-none text-gray-50">
                Edit Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={handleLogOut}>
                {isLaoding ? (
                  <Loader className="text-red-500 text-xl" />
                ) : (
                  <IoPowerSharp className="text-red-500  font-semibold text-xl" />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-red-500 border-none text-gray-50">
                Log Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
