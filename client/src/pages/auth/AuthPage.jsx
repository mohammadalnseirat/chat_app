import Victory from "@/assets/victory.svg";
import Login from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api-client";
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from "@/utils/constants";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  //? handle Login:
  const validateSignIn = () => {
    if (!email.length) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!password.length || password.length < 8) {
      toast.error("Please enter a valid password.");
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    setLoadingSignIn(true);
    try {
      if (validateSignIn()) {
        const response = await axiosInstance.post(
          SIGN_IN_ROUTE,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response.data.user);
        if (response.data.user._id) {
          // ? update the state of the user:
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
        //! clear the state:
        setEmail("");
        setPassword("");
        toast.success("User Logged in successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoadingSignIn(false);
    }
  };

  //? handle Sign Up:
  const validateSignUp = () => {
    if (!email.length) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!password.length || password.length < 8) {
      toast.error("Please enter a valid password.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };
  const handleSignUp = async () => {
    setLoadingSignUp(true);
    try {
      if (validateSignUp()) {
        const response = await axiosInstance.post(
          SIGN_UP_ROUTE,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          //? update the state of the user:
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        //! clear the state:
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        toast.success("Account created successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoadingSignUp(false);
    }
  };
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-gray-50 border-2  border-gray-200 text-opacity-90 shadow-2xl rounded-3xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] grid xl:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-10 ">
          <div className="flex flex-col items-center justify-center px-4">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl capitalize text-purple-800 font-mono">
                welcome
              </h1>
              <img src={Victory} alt="victory-image" className="h-[100px]" />
            </div>
            <p className="text-center font-medium text-sm sm:text-md">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-gray-600 border-b-2  rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-gray-600 border-b-2  rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3  transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col mt-10 gap-5" value="login">
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6 border border-purple-500"
                />
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6 border border-purple-500"
                />
                <Button
                  disabled={loadingSignIn}
                  onClick={handleLogin}
                  className="p-6 rounded-full bg-purple-600 hover:bg-red-700"
                >
                  {loadingSignIn ? (
                    <div className="flex items-center gap-2">
                      <span>Logging In...</span>
                      <Loader
                        color="white"
                        size={20}
                        className="animate-spin"
                      />
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-2 -mt-4" value="signup">
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6 border border-purple-500"
                />
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6 border border-purple-500"
                />
                <Input
                  type="password"
                  placeholder="Confirm your password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full p-6 border border-purple-500"
                />
                <Button
                  disabled={loadingSignUp}
                  onClick={handleSignUp}
                  className="p-6 rounded-full bg-purple-600 hover:bg-red-700"
                >
                  {loadingSignUp ? (
                    <div className="flex items-center gap-2">
                      <span>Signning Up...</span>
                      <Loader
                        color="white"
                        size={20}
                        className="animate-spin"
                      />
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <img src={Login} alt="login-image" className="h-[450px]" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
