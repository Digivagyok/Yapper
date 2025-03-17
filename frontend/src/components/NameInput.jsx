import {User} from "lucide-react";

export default function NameInput({ formData, handleChange }) {
    return (
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
    );
}

export function ReadOnlyName({authUser}) {
    return (
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
                    value={authUser.fullName}
                    name="fullName"
                    readOnly={true}
                />
            </div>
        </div>
    );
}