import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST_URL,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [hoverState, setHoverState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  //! useEffect To Fetch User Information and get the data:
  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST_URL}/${userInfo.image}`);
    }
  }, [userInfo]);
  //! handle Save Changes:
  const handleSaveChanges = async () => {
    if (!firstName || !lastName) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsEditing(true);
    try {
      const response = await axiosInstance.post(
        UPDATE_PROFILE_ROUTE,
        { firstName, lastName, color: selectedColor },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        toast.success("Profile updated successfully.");
        navigate("/chat");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsEditing(false);
    }
  };

  //! handle Naviget:
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please Set up your profile first.");
    }
  };
  //! handle File Input Click:
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  //! handle ImageChange:
  const handleImageChangeAndUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const response = await axiosInstance.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image uploaded successfully.");
        }
        // update the state image:
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  //! handle Delete Image:
  const handDeleteImage = async () => {
    try {
      const response = await axiosInstance.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image deleted successfully.");
        setImage(null);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack
            className={`text-4xl md:text-5xl cursor-pointer text-purple-700`}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            onMouseEnter={() => setHoverState(true)}
            onMouseLeave={() => setHoverState(false)}
            className="relative h-full w-32 md:w-48 md:h-48 flex items-center justify-center"
          >
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt={userInfo.email}
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hoverState && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 ring-fuchsia-50 rounded-full transition-colors duration-300"
                onClick={image ? handDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-red-500 text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-gray-300 text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              name="proile-image"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChangeAndUpload}
            />
          </div>
          <div className="flex flex-col gap-5 items-center justify-center text-gray-100 min-w-32 md:min-w-64">
            <div className="w-full">
              <Input
                tpye="email"
                value={userInfo.email}
                disabled
                className="rounded-lg p-6 border border-purple-600 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <Input
                tpye="text"
                placeholder="Enter your first name..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value.trim())}
                className="rounded-lg p-6 border border-purple-600 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="Enter your last name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value.trim())}
                className="rounded-lg p-6 border border-purple-600 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-gray-200 outline-2"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full ">
          <Button
            onClick={handleSaveChanges}
            disabled={isEditing}
            className={`bg-purple-700 h-12 w-full capitalize cursor-pointer  hover:bg-purple-800 disabled:cursor-not-allowed transition-all  duration-300`}
          >
            {isEditing ? (
              <p className="flex items-center justify-center gap-2">
                Loading...{" "}
                <Loader className="w-5 h-5 animate-spin text-gray-100" />
              </p>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
