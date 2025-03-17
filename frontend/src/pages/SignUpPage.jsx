import { useState } from "react"
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useAuthStore from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import AboveForm from "../components/AboveForm";
import NameInput from "../components/NameInput";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return toast.error("Kötelező a teljes név!");
        }

        if (!formData.email.trim()) {
            return toast.error("Kötelező az email!");
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return toast.error("Nem megfelelő email!");
        }

        if (!formData.password.trim()) {
            return toast.error("Kötelező a jelszó!");
        }

        if (formData.password.length < 6) {
            return toast.error("A jelszónak legalább 6 karakter hosszúnak kell lennie!");
        }

        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const success = validateForm();

        if (success === true) {
            signup(formData);
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
        <div className="h-screen grid pt-20">
            {/*LEFT SIDE*/}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* LOGO */}
                    <AboveForm content={
                        {
                            h1tagcontent: "Fiók létrehozása",
                            ptagcontent: "Kezdj el csevegni a fiókoddal"
                        }
                    } />

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* NÉV */}
                        <NameInput formData={formData} handleChange={handleChange} />

                        {/* EMAIL */}
                        <EmailInput formData={formData} handleChange={handleChange} />

                        {/* JELSZÓ */}
                        <PasswordInput formData={formData} handleChange={handleChange} showPassword={showPassword} handlePasswordShow={handlePasswordShow} />

                        {/* LÉTREHOZÁS */}
                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Betöltés ...
                                </>
                            ) : (
                                "Fiók létrehozása"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Már van fiókod?
                            <br />
                            <Link to="/login" className="link link-primary">
                                Jelentkezz be
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};