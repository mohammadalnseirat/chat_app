import { RiCloseFill } from "react-icons/ri";
const MessageHeader = () => {
  return (
    <div className="h-[10vh] flex items-center justify-between border-b-2 border-purple-500 px-20">
      <div className="flex gap-5 items-center">
        <div className="flex items-center justify-center gap-3"></div>
        <div className="flex items-center justify-center gap-5">
          <button className="text-gray-50 focus:border-none hover:text-red-700 focus:outline-none focus:text-red-700 transition-all duration-300 ">
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
