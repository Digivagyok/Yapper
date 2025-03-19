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

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

import {THEME_COLORS} from "./constants/themes.js";

function App() {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  //console.log(onlineUsers);


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //console.log({authUser});

  // dynamic manifest change
  useEffect(() => {

    document.querySelector('html').setAttribute('data-theme', theme);

    const currentThemeColors = THEME_COLORS[theme] || THEME_COLORS.dark;

    let manifest = {
      name: "Yapper",
      short_name: "Yapper",
      icons: [
        {
          src: "/icons/web-app-manifest-48x48.png",
          sizes: "48x48",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icons/web-app-manifest-96x96.png",
          sizes: "96x96",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icons/web-app-manifest-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icons/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icons/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ],
      theme_color: "#000000",
      background_color: "#000000",
      display: "standalone",
      start_url: "/"
    };

    manifest = {
      ...manifest,
      theme_color: currentThemeColors.theme_color,
      background_color: currentThemeColors.background_color
    };

    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const manifestURL = URL.createObjectURL(blob);

    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute("href", manifestURL);
    } else {
      console.error("Manifest link not found.");
    }

    //console.log("Generated manifest URL:", manifestURL);
    //console.log("Manifest link updated:", manifestLink);
  }, [theme]);
  //

  if (isCheckingAuth && !authUser) {
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
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  )
}

export default App;
