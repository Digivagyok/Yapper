import { Eye, EyeOff, Lock} from "lucide-react";

export default function ({ formData, handleChange, showPassword, handlePasswordShow }) {
    

    return (
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
    )
}