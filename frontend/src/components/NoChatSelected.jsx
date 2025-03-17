import { MessageSquare } from "lucide-react";

export default function NoChatSelected() {
    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
            <div className="max-w-md text-center space-y-6">

                <div className="flex justify-center gap-4 mb-4">
                    <div className="relative">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center
                        justify-center animate-bounce">
                            <MessageSquare className="size-8 text-primary" />
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold">
                    Üdvözöl a Yapper!
                </h2>
                <p className="text-base-content/60">
                    Válassz egy beszélgetést az oldalsó menüből, hogy elkezdhess beszélgetni!
                </p>
            </div>
        </div>
    );
}