import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";


export default function ChatHeader() {
    const { selectedUser, setSelectedUser, setShowSideBar, showSideBar } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const closeButtonHandler = () => {
        setSelectedUser(null);
        setShowSideBar(true);
    }

    const showSideBarHandler = () => {
        setShowSideBar(!showSideBar);
    }

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">

                    {
                        showSideBar ? 
                        
                        <button onClick={showSideBarHandler}>
                            <ArrowRightIcon />
                        </button>

                        :

                        <button onClick={showSideBarHandler}>
                            <ArrowLeftIcon />
                        </button>
                    }

                    

                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.jpg"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">
                            {selectedUser.fullName}
                        </h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <button onClick={closeButtonHandler}>
                    <X />
                </button>

            </div>
        </div>
    )
}