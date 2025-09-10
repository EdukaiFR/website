/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

interface ErrorLayoutProps {
    children: React.ReactNode;
    bgGradient?: string;
}

export default function ErrorLayout({
    children,
    bgGradient = "from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800",
}: ErrorLayoutProps) {
    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${bgGradient} p-4`}
        >
            <div className="text-center max-w-md mx-auto">
                {/* Logo pingouin avec animation de rotation douce */}
                <div className="mb-8 flex justify-center">
                    <div className="animate-rotate-gentle">
                        <Image
                            src="/EdukaiLogo.svg"
                            alt="Edukai Logo"
                            width={120}
                            height={120}
                            className="drop-shadow-lg"
                        />
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}
