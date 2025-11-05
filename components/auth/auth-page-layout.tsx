import { Card, CardContent } from "@/components/ui/card";
import { EdukaiHeader } from "./edukai-header";

interface AuthPageLayoutProps {
    readonly children: React.ReactNode;
}

export function AuthPageLayout({ children }: Readonly<AuthPageLayoutProps>) {
    return (
        <div className="flex items-center justify-center p-2 sm:p-4 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <EdukaiHeader />
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
