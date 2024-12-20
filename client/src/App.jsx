import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppStore } from "./store";
import { lazy, Suspense, useEffect, useState } from "react";
import { axiosInstance } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import { Loader } from "lucide-react";
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

//? Private Route:
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

//? Auth Route:
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to={"/chat"} /> : children;
};
const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  //! useEffect To Fetch User Information:
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data._id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.log("Error getting user data", { error });
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    // ? Call The Function Herr:
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  //! Check for the loading:
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="size-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<></>}>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <AuthPage />
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
