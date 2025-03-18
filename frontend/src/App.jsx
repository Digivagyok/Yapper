import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignUpPage";

import { axiosInstance } from "./lib/axios";
import useAuthStore from "./store/useAuthStore";

import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

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
    <div >
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          
          {/* <Route path="/" element={ authUser ?  <HomePage/> : <Navigate to="/login" />}/> */}
          {/* made home available for users without logging in for dev purposes */}
          {/* <Route path="/" element={<HomePage/>}/> */}
          <Route path="/" element={ authUser ?  <HomePage/> : <Navigate to="/login" />}/>
          <Route path="/signup" element={!authUser ?  <SignupPage/> : <Navigate to="/" />}/>
          <Route path="/login" element={!authUser ? <LoginPage/>  : <Navigate to="/" />}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />}/>
          
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  )
}

export default App;
