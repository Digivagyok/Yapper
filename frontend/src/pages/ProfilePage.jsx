import { useState } from "react";
import EmailInput, { ReadOnlyEmail } from "../components/EmailInput";
import NameInput, { ReadOnlyName } from "../components/NameInput";
import useAuthStore from "../store/useAuthStore";

import { Camera } from "lucide-react";

export default function ProfilePage() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({profilePic: base64Image});
        };
    };

    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">
                            Profil
                        </h1>
                        <p className="mt-2">
                            A profilod adatai
                        </p>
                    </div>

                    {/* képfeltöltés*/}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img src={selectedImg || authUser.profilePic || "/avatar.jpg"}
                            alt="ProfilePicture"
                            className="size-32 rounded-full object-cover border-4">
                            </img>
                            <label 
                                htmlFor="avatar-upload"
                                className={`
                                    absolute bottom-0 right-0
                                    bg-base-content hover:scale-105
                                    p-2 rounded-full cursor-pointer
                                    transition-all duration-200
                                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                                `}
                            >
                                <Camera className="size-5 text-base-200" />
                                <input 
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile} 
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Feltöltés..." : "Kattints a kamera gombra, hogy frissítsd a profilképed!"}
                        </p>
                    </div>

                    <ReadOnlyName authUser={authUser} />
                    <ReadOnlyEmail authUser={authUser} />

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">
                            Fiók információk
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>
                                    Tagság kezdete:
                                </span>
                                <span>
                                    {authUser.createdAt?.split("T")[0]}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>
                                    Fiók státusz:
                                </span>
                                <span className="text-green-500">
                                    Aktív
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};