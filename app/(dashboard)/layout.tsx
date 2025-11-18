import { HeaderBreadcrumb } from "@/components/navigation-location";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import type { Metadata } from "next";
import { cookies } from "next/headers"; // Pour récupérer les cookies server-side
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "Edukai",
    description: "Révise mieux, pas plus.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    // Récupération de l'état de la sidebar depuis les cookies
    const cookieStore = cookies();
    const sidebarState = cookieStore.get("sidebar:state")?.value;
    // Default to true (expanded) on first load, respect saved preference
    const defaultOpen = sidebarState ? sidebarState === "true" : true;

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <AuthGuard redirectTo="/auth">
                <SidebarProvider defaultOpen={defaultOpen}>
                    <AppSidebar />
                    <SidebarInset>
                        <HeaderBreadcrumb />
                        <Separator className="" />
                        <div className="flex flex-1 flex-col gap-4 p-0">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </AuthGuard>
        </ThemeProvider>
    );
}
