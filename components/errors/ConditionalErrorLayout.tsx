"use client";

import { isAuthenticated } from "@/lib/auth-utils";
import ErrorLayout from "./ErrorLayout";
import { HeaderBreadcrumb } from "@/components/navigation-location";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ConditionalErrorLayoutProps {
    children: React.ReactNode;
    bgGradient?: string;
}

export default function ConditionalErrorLayout({
    children,
    bgGradient = "from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800",
}: ConditionalErrorLayoutProps) {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication on client-side after hydration
        setIsUserAuthenticated(isAuthenticated());
        setIsLoading(false);
    }, []);

    // Show loading state during hydration to prevent flash
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If user is not authenticated, use the original ErrorLayout
    if (!isUserAuthenticated) {
        return <ErrorLayout bgGradient={bgGradient}>{children}</ErrorLayout>;
    }

    // If user is authenticated, use dashboard layout structure
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset>
                    <HeaderBreadcrumb />
                    <Separator />
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {/* Error content adapted for dashboard layout */}
                        <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-8rem)]">
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
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
