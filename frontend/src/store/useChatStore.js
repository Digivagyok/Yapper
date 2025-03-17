import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get("/messages/users");
            set({users: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();

        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, response.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    //TODO optimize this
    setSelectedUser: (selectedUser) => set({selectedUser}),
}))