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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook pour obtenir l'URL actuelle
import { useEffect, useState } from "react";
import { useLinks } from "../../hooks/use-links";
import { NavUser } from "./nav-user";

// Custom beautiful tooltip component for sidebar
const SidebarTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent 
      side="right" 
      align="center"
      className="bg-white/95 backdrop-blur-sm border border-blue-100 text-gray-800 shadow-xl rounded-xl px-4 py-2.5 text-sm font-medium max-w-48 z-50"
      sideOffset={12}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        <span>{content}</span>
      </div>
    </TooltipContent>
  </Tooltip>
);

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
      <SidebarHeader className={`${isCollapsed ? 'p-2' : 'p-6'} flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          {isCollapsed ? (
            <SidebarTooltip content="Edukai">
              <div className={`relative ${isCollapsed ? 'p-2' : 'p-3'} bg-gradient-to-r from-blue-600 to-indigo-600 ${isCollapsed ? 'rounded-lg' : 'rounded-2xl'} shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200`}>
                <Image
                  src="/EdukaiLogo.svg"
                  alt="Logo Edukai"
                  width={isCollapsed ? 20 : 32}
                  height={isCollapsed ? 20 : 32}
                  className="filter brightness-0 invert"
                />
              </div>
            </SidebarTooltip>
          ) : (
            <div className={`relative ${isCollapsed ? 'p-2' : 'p-3'} bg-gradient-to-r from-blue-600 to-indigo-600 ${isCollapsed ? 'rounded-lg' : 'rounded-2xl'} shadow-lg`}>
              <Image
                src="/EdukaiLogo.svg"
                alt="Logo Edukai"
                width={isCollapsed ? 20 : 32}
                height={isCollapsed ? 20 : 32}
                className="filter brightness-0 invert"
              />
            </div>
          )}
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
                  {isCollapsed ? (
                    <SidebarTooltip content={label}>
                      <SidebarMenuButton asChild className="p-0 w-full">
                        <Link
                          href={href}
                          className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 ${
                            selectedLink === href
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                              : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                          }`}
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
                    </SidebarTooltip>
                  ) : (
                    <SidebarMenuButton asChild className="p-0 w-full">
                      <Link
                        href={href}
                        className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 ${
                          selectedLink === href
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                            : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                        }`}
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
                  )}
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
                  {isCollapsed ? (
                    <SidebarTooltip content={label}>
                      <SidebarMenuButton asChild className="p-0 w-full">
                        <Link
                          href={href}
                          className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 ${
                            selectedLink === href
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                              : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                          }`}
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
                    </SidebarTooltip>
                  ) : (
                    <SidebarMenuButton asChild className="p-0 w-full">
                      <Link
                        href={href}
                        className={`group flex items-center gap-3 ${isCollapsed ? 'p-2 justify-center mx-auto w-fit' : 'p-3'} rounded-xl transition-all duration-200 ${
                          selectedLink === href
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                            : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.01] backdrop-blur-sm"
                        }`}
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
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className={`${isCollapsed ? 'px-0' : 'px-4'} pb-6`}>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
