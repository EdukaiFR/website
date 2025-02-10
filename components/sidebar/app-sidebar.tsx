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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { useLinks } from "./links";

export function AppSidebar() {
  const router = useRouter();
  const { upLinks, downLinks } = useLinks();
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);

  return (
    <Sidebar collapsible="icon" className="bg-[hsl(var(--sidebar-background))]">
      <SidebarHeader>
        <div className="flex justify-center py-4">
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
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--sidebar-accent))]"
                      >
                        <Icon className="w-6 h-6 text-[hsl(var(--sidebar-foreground))]" />
                        <span className="text-medium text-[hsl(var(--sidebar-foreground))] text-base">
                          {label}
                        </span>
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
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--sidebar-accent))]"
                      >
                        <Icon className="w-6 h-6 text-[hsl(var(--sidebar-foreground))]" />
                        <span className="text-medium text-[hsl(var(--sidebar-foreground))] text-base">
                          {label}
                        </span>
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
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
