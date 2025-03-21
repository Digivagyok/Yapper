import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

export default function MessageInput() {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file.type.startsWith("image/")){
            toast.error("Kérlek válassz egy képet!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current){
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (!text.trim() && !imagePreview){
            return;
        }

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Hiba az üzenet elküldése közven: ", error);
            toast.error("Hiba az üzenet elküldése közven");
        }

        
    };

    const handleInputText = (event) => {
        setText(event.target.value);
    };

    const handleFileButtonClick = (event) => {
        fileInputRef.current?.click();
    }

    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img src={imagePreview} alt="Előnézet"
                            className="w-20 h-20 object-cover rounded-lg
                            border border-zinc-700" />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full 
                            bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg text-base sm:text-lg"
                        placeholder="Írj üzenetet ..."
                        value={text}
                        onChange={handleInputText}
                    />

                    <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                            ${imagePreview ? "text-emerald-500" : "text-zinc-400"}
                        `}
                        onClick={handleFileButtonClick}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button 
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}