import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");

            set({authUser:response.data});
            get().connectSocket();
        } catch (error) {
            console.log("Hiba a checkAuth ban: ", error);
            set({authUser:null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async(data) => {
        set({isSigningUp: true});

        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({authUser: response.data});
            toast.success("A fiók sikeresen létrehozva");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});

        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({authUser: response.data});
            toast.success("Sikeres bejelentkezés");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Sikeres kijelentkezés");

            get().disconnectSocket();
        } catch(error){
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true});
        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: response.data});
            toast.success("A profil sikeresen frissítve");
        } catch (error) {
            console.log("Hiba a profil frissítésekor: ", error);
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected){
            return;
        }
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds});
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected){
            get().socket.disconnect();
        }

    }
}));

export default useAuthStore;