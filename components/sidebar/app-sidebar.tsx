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
  
  const isCollapsed = state === "collapsed";

  // Met à jour le lien sélectionné si l'URL change
  useEffect(() => {
    setSelectedLink(pathname);
  }, [pathname]);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-0 shadow-xl overflow-hidden"
    >
      {/* Header with Logo */}
      <SidebarHeader className={`${isCollapsed ? 'p-3' : 'p-6'} flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <Image
              src="/EdukaiLogo.svg"
              alt="Logo Edukai"
              width={isCollapsed ? 24 : 32}
              height={isCollapsed ? 24 : 32}
              className="filter brightness-0 invert"
            />
          </div>
          {/* Brand Name - only show when expanded */}
          {!isCollapsed && (
            <div className="text-center mt-3">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edukai
              </h1>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`${isCollapsed ? 'px-0' : 'px-4'}`}>
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={`space-y-2 ${isCollapsed ? 'px-0' : ''}`}>
              {upLinks.map(({ href, label, Icon }) => (
                <SidebarMenuItem key={href} className={isCollapsed ? 'flex justify-center' : ''}>
                  <SidebarMenuButton asChild className="p-0 w-full">
                    <Link
                      href={href}
                      className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 ${
                        selectedLink === href
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                          : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                      }`}
                      title={isCollapsed ? label : undefined}
                    >
                      <Icon 
                        className={`${isCollapsed ? 'w-6 h-6' : 'w-6 h-6'} transition-all duration-200 ${
                          selectedLink === href 
                            ? "text-white" 
                            : "text-blue-600 group-hover:text-indigo-600"
                        }`} 
                      />
                      {!isCollapsed && (
                        <span className={`font-semibold text-base transition-all duration-200 ${
                          selectedLink === href 
                            ? "text-white" 
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}>
                          {label}
                        </span>
                      )}
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
            <SidebarMenu className={`space-y-2 ${isCollapsed ? 'px-0' : ''}`}>
              {downLinks.map(({ href, label, Icon }) => (
                <SidebarMenuItem key={href} className={isCollapsed ? 'flex justify-center' : ''}>
                  <SidebarMenuButton asChild className="p-0 w-full">
                    <Link
                      href={href}
                      className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 ${
                        selectedLink === href
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                          : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                      }`}
                      title={isCollapsed ? label : undefined}
                    >
                      <Icon 
                        className={`${isCollapsed ? 'w-6 h-6' : 'w-6 h-6'} transition-all duration-200 ${
                          selectedLink === href 
                            ? "text-white" 
                            : "text-blue-600 group-hover:text-indigo-600"
                        }`} 
                      />
                      {!isCollapsed && (
                        <span className={`font-semibold text-base transition-all duration-200 ${
                          selectedLink === href 
                            ? "text-white" 
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}>
                          {label}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      {/* User Profile Footer */}
      <SidebarFooter className={`space-y-2 ${isCollapsed ? 'px-0' : 'px-0'} pb-8 w-full ml-auto`}>
        <NavUser />
      </SidebarFooter>
      </SidebarContent>

    </Sidebar>
  );
}
