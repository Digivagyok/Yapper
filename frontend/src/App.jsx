import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignUpPage";
import {Loader} from "lucide-react";
import { axiosInstance } from "./lib/axios";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const { authUser, isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
