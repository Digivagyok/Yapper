import { Mail } from "lucide-react";

export default function EmailInput({ formData, handleChange }) {
    return (
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
    );
};

export function ReadOnlyEmail({ authUser }) {
    return (
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
                    value={authUser.email}
                    name="email"
                    readOnly={true}
                />
            </div>
        </div>
    )
};