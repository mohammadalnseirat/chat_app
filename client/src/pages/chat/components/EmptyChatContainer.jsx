import { animationDataDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#1c1d25] transition-all duration-1000">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDataDefaultOptions}
      />
      <div className="flex flex-col gap-5 items-center mt-10 text-3xl lg:text-4xl text-center transition-all duration-300">
        <h3 className="font-mono">
          Hi<span className="text-purple-500">!</span> Welcome To{" "}
          <span>Syncronus</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
