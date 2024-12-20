import { useAppStore } from "@/store";
import NewDm from "./NewDm";
import ProfileInfo from "./ProfileInfo";
import { useEffect } from "react";
import { axiosInstance } from "@/lib/api-client";
import {
  GET_CONTACTS_DM_ROUTE,
  GET_USERS_CHANNEL_ROUTE,
} from "@/utils/constants";
import ContactList from "@/components/ContactList";
import CreateChannel from "./CreateChannel";

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();
  //? useEffect to get All Contacts from the database:
  useEffect(() => {
    const getAllContacts = async () => {
      try {
        const response = await axiosInstance.get(GET_CONTACTS_DM_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.contacts) {
          console.log(response.data.contacts);
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.log(error);
        // setDirectMessagesContacts([]);
      }
    };

    getAllContacts();
  }, [setDirectMessagesContacts, setChannels]);
  useEffect(() => {
    const getAllChannels = async () => {
      try {
        const response = await axiosInstance.get(GET_USERS_CHANNEL_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllChannels();
  }, [setChannels]);
  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-r-purple-500">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold italic">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest font-semibold pl-5 text-sm text-opacity-90 hover:text-purple-600 cursor-pointer transition-colors duration-300">
      {text}
    </h6>
  );
};
