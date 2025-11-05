import { AuthContainer, EdukaiHeader } from "@/components/auth";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface AuthCardProps {
    mounted: boolean;
    onAuthSuccess: () => void;
    onAuthError: (error: string) => void;
}

export function AuthCard({
    mounted,
    onAuthSuccess,
    onAuthError,
}: AuthCardProps) {
    return (
        <div
            className={`flex items-center lg:order-2 order-1 min-h-screen py-12 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
            <div className="w-full flex flex-col items-center justify-center">
                <Card className="w-full max-w-md shadow-2xl border border-blue-100/50 bg-white/80 backdrop-blur-xl hover:shadow-blue-200/50 hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 sm:p-10 min-h-[600px] flex flex-col justify-center">
                        <EdukaiHeader />
                        <AuthContainer
                            initialMode="login"
                            onAuthSuccess={onAuthSuccess}
                            onAuthError={onAuthError}
                        />

                        {/* Trust Indicators */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                                <span>Données sécurisées et chiffrées</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
