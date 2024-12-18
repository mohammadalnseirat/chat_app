import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import { animationDataDefaultOptions, getColor } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/api-client";
import { HOST_URL, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDm = ({ isOpen, setIsOpen }) => {
  const { setSelectChatData, setSelectChatType } = useAppStore();
  const [openContactModel, setOpenContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const searchContacts = async (searchTerm) => {
    try {
      // setSearchedContacts([]);
      if (searchTerm.length > 0) {
        const response = await axiosInstance.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setSearchedContacts([]);
    }
  };

  //? handle select contact:
  const handleSelectNewContact = (contact) => {
    setOpenContactModel(false);
    setSelectChatType("contact");
    setSelectChatData(contact);
    setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-semibold text-gray-300 text-md hover:text-gray-50 transition-all duration-300"
              onClick={() => setOpenContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-purple-600 text-white border-none">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openContactModel || isOpen}
        onOpenChange={setOpenContactModel || setIsOpen}
      >
        <DialogContent className=" w-[300px] md:w-[400px] md:h-[400px] flex flex-col border-purple-800 text-gray-100 bg-[#1c1d25] ">
          <DialogHeader>
            <DialogTitle className="text-center  text-purple-500 font-semibold">
              Please Select A New Contact?
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="search for a new contact..."
              className="p-6 rounded-lg bg-gray-700 border-none focus:outline-none "
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {/* Scroll Area */}

          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    onClick={() => handleSelectNewContact(contact)}
                    key={contact._id}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="w-12 h-12  rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST_URL}/${contact.image}`}
                            alt={contact.email}
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12  text-md border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : `${contact.email}`}
                      </span>
                      <span className="text-xs text-purple-500">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length === 0 && (
            <div className="flex-1  md:flex mt-5 flex-col items-center justify-center bg-[#1c1d25] transition-all duration-1000">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDataDefaultOptions}
              />
              <div className="flex flex-col gap-5 items-center mt-5 text-md md:text-xl lg:text-2xl text-center transition-all duration-300">
                <h3 className="font-mono">
                  Hi<span className="text-purple-500">!</span> Search New{" "}
                  <span className="text-cyan-500">Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
