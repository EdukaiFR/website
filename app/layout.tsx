import { HeaderBreadcrumb } from "@/components/navigation-location";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers"; // Pour récupérer les cookies server-side
import "./globals.css";

export const metadata: Metadata = {
  title: "Edukai",
  description: "Kaiboard is a dashboard for your daily tasks and notes.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Récupération de l'état de la sidebar depuis les cookies
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en">
      <body className="w-full min-h-screen font-satoshi">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Passage de l'état de la sidebar depuis le cookie */}
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
        </ThemeProvider>
      </body>
    </html>
  );
}
