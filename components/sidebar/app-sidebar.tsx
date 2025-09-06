"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import { BetaCard } from "@/components/sidebar/beta-card";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useLinks } from "@/hooks/use-links";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { upLinks, downLinks } = useLinks();

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu className="px-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-gray-100/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2.5"
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-3 w-full"
                            >
                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    <div className="bg-blue-600 text-white flex aspect-square size-5 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-8">
                                        <Image
                                            src="/EdukaiLogo.svg"
                                            alt="Logo Edukai"
                                            width={12}
                                            height={12}
                                            className="filter brightness-0 invert group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold text-sm text-gray-800">
                                        Edukai
                                    </span>
                                    <span className="truncate text-xs text-gray-600">
                                        Révise mieux, pas plus
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={upLinks} />
                <NavSecondary items={downLinks} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <BetaCard />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
