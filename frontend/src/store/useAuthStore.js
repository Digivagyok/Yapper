import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");

            set({authUser:response.data});
        } catch (error) {
            console.log("Hiba a checkAuth ban: ", error.message);
            set({authUser:null});
        } finally {
            set({isCheckingAuth: false});
        }
    }
  }));
  
  export default useAuthStore;