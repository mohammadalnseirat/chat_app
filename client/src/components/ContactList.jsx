import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST_URL } from "@/utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectChatData,
    setSelectChatData,
    selectChatType,
    setSelectChatType,
    setSelectedChatMessages,
  } = useAppStore();

  //? handle click to select chat:
  const handleClickToSelectChat = (contact) => {
    if (isChannel) {
      setSelectChatType("channel");
      setSelectChatData(contact);
    } else {
      setSelectChatType("contact");
      setSelectChatData(contact);
    }
    if (selectChatData && selectChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  console.log(contacts);
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`cursor-pointer px-5 mx-2  rounded-md py-2 text-teal-50 transition-all duration-300 ${
            selectChatData && selectChatData._id === contact._id
              ? selectChatType === "contact"
                ? `${getColor(contact.color)} border-none`
                : "bg-gray-800"
              : "hover:bg-gray-800"
          }`}
          onClick={() => handleClickToSelectChat(contact)}
        >
          <div className="flex items-center  justify-start gap-5 text-gray-100">
            {!isChannel && (
              <>
                <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST_URL}/${contact.image}`}
                      alt={contact.email}
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-10 w-10 text-md flex items-center justify-center rounded-full border-[1px] ${getColor(
                        contact.color
                      )}`}
                    >
                      {contact.firstName
                        ? contact.firstName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              </>
            )}
            {isChannel && (
              <div className="size-10 rounded-full flex items-center justify-center bg-gray-900">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName} {contact.lastName}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
