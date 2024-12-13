import MessageContainer from "./MessageContainer";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <MessageHeader />
      <MessageContainer />
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
