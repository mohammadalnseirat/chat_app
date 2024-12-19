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
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { axiosInstance } from "@/lib/api-client";
import { toast } from "sonner";
import {
  CREATE_NEW_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/MultipleSelect";
import { RiUserForbidFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Loader } from "lucide-react";

const CreateChannel = ({ isChannelOpen, setIsChannelOpen }) => {
  const [openChannelModel, setOpenChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setselectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [isCreattingChannel, setIsCreattingChannel] = useState(false);
  const { selectChatType, selectChatData, addChannel } = useAppStore();

  //! useEffect To Get All Contacts:
  useEffect(() => {
    const getAllContacts = async () => {
      try {
        const response = await axiosInstance.get(GET_ALL_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.contacts) {
          setAllContacts(response.data.contacts);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log("Error getting all contacts in createChannel");
      }
    };
    getAllContacts();
  }, []);

  //! Create a new channel:
  const createNewChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        setIsCreattingChannel(true);
        setChannelName("");
        setselectedContacts([]);
        const response = await axiosInstance.post(
          CREATE_NEW_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          toast.success(`Channel ${channelName} Created Successfully!`);
          setChannelName("");
          setOpenChannelModel(false);
          setIsChannelOpen(false);
          setselectedContacts([]);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsCreattingChannel(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-semibold text-gray-300 text-md hover:text-gray-50 transition-all duration-300"
              onClick={() => setOpenChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-purple-600 text-white border-none">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openChannelModel || isChannelOpen}
        onOpenChange={setOpenChannelModel || setIsChannelOpen}
      >
        <DialogContent className=" w-[300px] md:w-[400px] md:h-[400px] flex flex-col border-purple-800 text-gray-100 bg-[#1c1d25] ">
          <DialogHeader>
            <DialogTitle className="text-center  text-purple-500 font-semibold">
              Please Fill Up The Details For New Channel?
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Enter Channel Name..."
              className="p-6 rounded-lg bg-gray-700 border-none focus:outline-none "
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg text-gray-50 py-2 border-none bg-gray-600"
              defaultOptions={allContacts}
              placeholder="search contacts..."
              value={selectedContacts}
              onChange={setselectedContacts}
              emptyIndicator={
                <p className="text-lg text-center leading-10 text-gray-600 flex items-center justify-center">
                  No contacts found
                  <RiUserForbidFill className="ml-2 text-red-500" />
                </p>
              }
            />
          </div>
          <Button
            disabled={
              isCreattingChannel ||
              selectedContacts.length === 0 ||
              channelName === ""
            }
            onClick={createNewChannel}
            className="w-full bg-purple-700 hover:bg-red-700  transition-all duration-200 "
          >
            {isCreattingChannel ? (
              <div className="flex items-center gap-2">
                <span>Creating Channel...</span>
                <Loader className="w-5 h-5 animate-spin text-gray-100" />
              </div>
            ) : (
              "Create Channel"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
