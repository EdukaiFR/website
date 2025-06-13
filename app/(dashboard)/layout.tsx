import { HeaderBreadcrumb } from "@/components/navigation-location";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import type { Metadata } from "next";
import { cookies } from "next/headers"; // Pour récupérer les cookies server-side
import "../globals.css";

export const metadata: Metadata = {
  title: "Edukai",
  description: "Révise mieux, pas plus.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Récupération de l'état de la sidebar depuis les cookies
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <AuthGuard redirectTo="/auth">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <SidebarInset>
            <HeaderBreadcrumb />
            <Separator className="mb-4" />
            {children}
          </SidebarInset>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
