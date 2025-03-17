import {  MessageSquare } from "lucide-react";

export default function AboveForm(params) {
    const {h1tagcontent, ptagcontent} = params.content;

    return (
        <div className="text-center mb-8 ">
            <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10
                                flex items-center justify-center
                                group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">
                    {h1tagcontent}
                </h1>
                <p className="text-base-content/60">
                    {ptagcontent}
                </p>
            </div>
        </div>
    )
}