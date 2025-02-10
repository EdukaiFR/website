"use client";

import { BadgeCheck, LogOut, Sparkles } from "lucide-react";

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

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const logout = async () => {
    try {
      console.log("Logging out...");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                isMobile ? "p-2" : "p-4"
              }`}
            >
              <div className="flex ml-auto mr-auto items-center justify-center gap-4">
                <Avatar className="h-8 w-8 rounded-full flex-shrink-0">
                  <AvatarImage src={"/temp/profile.svg"} alt={"Profile"} />
                  <AvatarFallback className="rounded-full">
                    {"T"}
                    {"H"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-primary">
                  <span className="truncate font-semibold">
                    {"Tristan"} {"H"}
                  </span>
                  <span className="truncate text-md font-medium opacity-75">
                    {"Freemium"}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={"/temp/profile.svg"} alt={"Profile"} />
                  <AvatarFallback className="rounded-full">
                    {"T"}
                    {"H"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {"Tristan"} {"H"}
                  </span>
                  <span className="truncate text-xs">{"Freemium"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Changer l'abonnement
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Mon compte
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* TODO: we can show this badge when we'll be able to know if the sidebar is open or not */}
        {/* <BetaBadge /> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
