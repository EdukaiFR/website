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
import { toast } from "sonner";

export function NavUser() {
  const { isMobile, state } = useSidebar();
  const router = useRouter();
  
  const isCollapsed = state === "collapsed";

  const logout = async () => {
    try {
      // Add any logout logic here (clear tokens, etc.)
    } catch (err: unknown) {
      console.error("Unexpected error during logout:", err);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      router.push("/auth");
      toast.success("Déconnexion réussie.");
    }
  };

  const goToSettings = () => {
    router.push("/settings");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className={isCollapsed ? 'flex justify-center' : ''}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm h-auto`}
            >
              {isCollapsed ? (
                // Collapsed: Just avatar with status indicator
                <div className="relative flex items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/temp/profile.svg" alt="Tristan H" />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      TH
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                // Expanded: Full user info - matching other nav items styling
                <div className="flex items-center gap-3 w-full text-left">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/temp/profile.svg" alt="Tristan H" />
                      <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                        TH
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="font-semibold text-base text-gray-700 group-hover:text-gray-900 truncate">Tristan H</div>
                    <div className="text-sm text-blue-600 group-hover:text-indigo-600 truncate">Premium</div>
                  </div>
                </div>
              )}
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
                    <AvatarImage src="/temp/profile.svg" alt="Tristan H" />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      TH
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tristan H</span>
                  <span className="truncate text-xs text-muted-foreground">
                    tristan@example.com
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
