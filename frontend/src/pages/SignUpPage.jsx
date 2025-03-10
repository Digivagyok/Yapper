import { useState } from "react"
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useAuthStore from "../store/useAuthStore";
import { Mail, MessageSquare, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";


export default function SignupPage(){
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const {signup, isSigningUp} = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return toast.error("Kötelező a teljes név!");
        }

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
        <div>
            {/*LEFT SIDE*/}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* LOGO */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10
                                flex items-center justify-center
                                group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">
                                Fiók létrehozása
                            </h1>
                            <p className="text-base-content/60">
                                Kezdj el csevegni a fiókoddal
                            </p>
                        </div>
                    </div>
                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* NÉV */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Teljes név</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="Pop Simon"
                                    value={formData.fullName}
                                    name="fullName"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="neved@domain.hu"
                                    value={formData.email}
                                    name="email"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* JELSZÓ */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Jelszó</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="●●●●●●●●"
                                    value={formData.password}
                                    name="password"
                                    onChange={handleChange}
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={handlePasswordShow}>
                                        {showPassword ? (
                                            <EyeOff className="size-5 text-base-content/40" />
                                        ) : (
                                            <Eye className="size-5 text-base-content/40" />
                                        )}
                                </button>
                            </div>
                        </div>

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
                            <br/>
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