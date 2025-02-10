"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook pour obtenir l'URL actuelle
import { useEffect, useState } from "react";
import { useLinks } from "./links";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { upLinks, downLinks } = useLinks();
  const pathname = usePathname(); // Récupère l'URL actuelle
  const [selectedLink, setSelectedLink] = useState<string>(pathname || "/");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Met à jour le lien sélectionné si l'URL change
  useEffect(() => {
    setSelectedLink(pathname);
  }, [pathname]);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[hsl(var(--sidebar-background))]"
      // Détecte les changements de mode
    >
      <SidebarHeader>
        <div className="flex justify-center items-center py-4 gap-4">
          <Image
            src="/EdukaiLogo.svg"
            alt="Logo Edukai"
            width={55}
            height={51.56}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Up Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="">
              <div className="flex flex-col gap-4 ml-auto mr-auto">
                {upLinks.map(({ href, label, Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 p-2 rounded-md text-[#2D6BCF] transition-all ${
                          selectedLink === href && "sidebar-link-selected"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-medium text-base">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Down Links */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex flex-col gap-4 ml-auto mr-auto">
                {downLinks.map(({ href, label, Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 p-2 rounded-md text-[#2D6BCF] transition-all ${
                          selectedLink === href && "sidebar-link-selected"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-medium text-base">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex justify-center py-4">
        {/* <ModeToggle /> */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
