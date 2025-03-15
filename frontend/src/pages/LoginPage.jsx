import { useState } from "react"
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useAuthStore from "../store/useAuthStore";
import { Mail, MessageSquare, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import AboveForm from "../components/AboveForm";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

export default function LoginPage(){
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const {login, isLoggingIn} = useAuthStore();

    const validateForm = () => {
        if (!formData.email.trim()) {
            return toast.error("Kötelező az email!");
        }

        if(!/\S+@\S+\.\S+/.test(formData.email)){
            return toast.error("Nem megfelelő email!");
        }

        if (!formData.password.trim()) {
            return toast.error("Kötelező a jelszó!");
        }

        if (formData.password.length < 6){
            return toast.error("A jelszónak legalább 6 karakter hosszúnak kell lennie!");
        }

        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const success = validateForm();

        if (success === true){
            login(formData);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevState) => ({
                ...prevState,
                [name]: value
        }));
    };

    const handlePasswordShow = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            {/*LEFT SIDE*/}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* LOGO */}
                    <AboveForm content={
                        {
                            h1tagcontent: "Bejelentkezés",
                            ptagcontent: "Kezdj el csevegni a fiókoddal"
                        }
                    }/>
                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* EMAIL */}
                        <EmailInput formData={formData} handleChange={handleChange} />

                        {/* JELSZÓ */}
                        <PasswordInput formData={formData} handleChange={handleChange} showPassword={showPassword} handlePasswordShow={handlePasswordShow}/>

                        {/* LÉTREHOZÁS */}
                        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Betöltés ...
                                </>
                            ) : (
                                "Bejelentkezés"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Nincs még fiókod? 
                            <br/>
                            <Link to="/signup" className="link link-primary">
                                Profil létrehozása
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};