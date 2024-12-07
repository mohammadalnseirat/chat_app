import Victory from "@/assets/victory.svg";
import Login from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //? handle Login:
  const handleLogin = async () => {};

  //? handle Sign Up:
  const handleSignUp = async () => {};
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
            <Tabs className="w-3/4">
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
                  onClick={handleLogin}
                  className="p-6 rounded-full bg-purple-600 hover:bg-red-700"
                >
                  Login
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
                  onClick={handleSignUp}
                  className="p-6 rounded-full bg-purple-600 hover:bg-red-700"
                >
                  Sign Up
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
