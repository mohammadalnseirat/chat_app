import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST_URL } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
const MessageHeader = () => {
  const { closeChat, selectChatData, selectChatType } = useAppStore();
  return (
    <div className="h-[10vh] flex items-center justify-between border-b-2 border-purple-500 px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 relative">
            {
              //? if selectChatType is contact and selectChatData has image then show image else show first letter
              selectChatType === "contact" ? (
                <Avatar className="w-12 h-12  rounded-full overflow-hidden">
                  {selectChatData.image ? (
                    <AvatarImage
                      src={`${HOST_URL}/${selectChatData.image}`}
                      alt={selectChatData.email}
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`uppercase h-12 w-12  text-md border-[1px] flex items-center justify-center rounded-full ${getColor(
                        selectChatData.color
                      )}`}
                    >
                      {selectChatData.firstName
                        ? selectChatData.firstName.split("").shift()
                        : selectChatData.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              ) : (
                <div
                  className={`size-10 rounded-full flex items-center justify-center bg-gray-800`}
                >
                  #
                </div>
              )
            }
          </div>
          <div>
            {selectChatType === "channel" && <p>{selectChatData.name}</p>}
            {selectChatType === "contact" && (
              <p>
                {selectChatData.firstName && selectChatData.lastName
                  ? `${selectChatData.firstName} ${selectChatData.lastName}`
                  : `${selectChatData.email}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-gray-50 focus:border-none hover:text-red-700 focus:outline-none focus:text-red-700 transition-all duration-300 "
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
