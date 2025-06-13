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
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook pour obtenir l'URL actuelle
import { useEffect, useState } from "react";
import { useLinks } from "../../hooks/use-links";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { upLinks, downLinks } = useLinks();
  const pathname = usePathname(); // Récupère l'URL actuelle
  const [selectedLink, setSelectedLink] = useState<string>(pathname || "/");
  const { state } = useSidebar();

  // Met à jour le lien sélectionné si l'URL change
  useEffect(() => {
    setSelectedLink(pathname);
  }, [pathname]);

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-0 shadow-xl overflow-hidden"
      >
        {/* Header with Logo */}
        <SidebarHeader className="p-4 lg:p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:rounded-lg">
              <Image
                src="/EdukaiLogo.svg"
                alt="Logo Edukai"
                width={32}
                height={32}
                className="filter brightness-0 invert group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5"
              />
            </div>
            {/* Brand Name - hidden when collapsed */}
            <div className="text-center mt-3 group-data-[collapsible=icon]:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edukai
              </h1>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 group-data-[collapsible=icon]:px-2">
          {/* Navigation Links */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {upLinks.map(({ href, label, Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      className="p-0 w-full group-data-[collapsible=icon]:justify-center"
                      tooltip={label}
                    >
                      <Link
                        href={href}
                        className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-fit ${
                          selectedLink === href
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                            : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-all duration-200 ${
                            selectedLink === href
                              ? "text-white"
                              : "text-blue-600 group-hover:text-indigo-600"
                          }`}
                        />
                        <span
                          className={`font-semibold text-base transition-all duration-200 group-data-[collapsible=icon]:hidden ${
                            selectedLink === href
                              ? "text-white"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Bottom Navigation Links */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {downLinks.map(({ href, label, Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      className="p-0 w-full group-data-[collapsible=icon]:justify-center"
                      tooltip={label}
                    >
                      <Link
                        href={href}
                        className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-fit ${
                          selectedLink === href
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                            : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-all duration-200 ${
                            selectedLink === href
                              ? "text-white"
                              : "text-blue-600 group-hover:text-indigo-600"
                          }`}
                        />
                        <span
                          className={`font-semibold text-base transition-all duration-200 group-data-[collapsible=icon]:hidden ${
                            selectedLink === href
                              ? "text-white"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile Footer */}
        <SidebarFooter className="px-4 pb-6 group-data-[collapsible=icon]:px-2">
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
