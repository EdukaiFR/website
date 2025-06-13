"use client";

import { BadgeCheck, LogOut, Sparkles, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { authToast } from "@/lib/toast";
import { useSession } from "@/hooks/useSession";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { user, logout: sessionLogout } = useSession();

  // Get user display data
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName.charAt(0)}`
      : user?.username || "User";

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      : user?.username?.substring(0, 2).toUpperCase() || "U";

  const email = user?.email || user?.username || "";

  const logout = async () => {
    try {
      await sessionLogout();
      router.push("/auth");
    } catch (err: unknown) {
      console.error("Erreur inattendue lors de la déconnexion:", err);
    }
  };

  const goToSettings = () => {
    router.push("/settings");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm h-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-fit"
            >
              {/* Avatar - always visible */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-6 w-6 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                  <AvatarImage src="/temp/profile.svg" alt={displayName} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold group-data-[collapsible=icon]:text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User info - hidden when collapsed */}
              <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <div className="font-semibold text-base text-gray-700 group-hover:text-gray-900 truncate">
                  {displayName}
                </div>
                <div className="text-sm text-blue-600 group-hover:text-indigo-600 truncate">
                  Premium
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/temp/profile.svg" alt={displayName} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={goToSettings}>
                <Settings className="w-4 h-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles className="w-4 h-4" />
                Changer l'abonnement
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="w-4 h-4" />
                Mon compte
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="w-4 h-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
