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
    <SidebarMenu className="px-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-white hover:to-gray-50 hover:shadow-md hover:shadow-gray-200/50 border border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm h-auto group-data-[collapsible=icon]:p-2.5 group-data-[collapsible=icon]:justify-center"
            >
              {/* Avatar - always visible */}
              <div className="relative flex-shrink-0 w-5 h-5 flex items-center justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-auto">
                <Avatar className="h-5 w-5 ring-1 ring-white shadow-sm group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:ring-2">
                  <AvatarImage src="/temp/profile.svg" alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-[10px] font-semibold group-data-[collapsible=icon]:text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-green-400 to-green-500 rounded-full border border-white shadow-sm group-data-[collapsible=icon]:w-3 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:border-2"></div>
              </div>

              {/* User info - hidden when collapsed */}
              <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <div className="font-semibold text-sm text-gray-800 group-hover:text-gray-900 truncate">
                  {displayName}
                </div>
                <div className="text-xs font-medium text-blue-600 group-hover:text-indigo-600 truncate bg-blue-50 px-2 py-0.5 rounded-md mt-1 w-fit">
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
