"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
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
    const { upLinks, downLinks, adminLinks } = useLinks();

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
                                <div className=" w-12 h-12 flex items-center justify-center">
                                    <Image
                                        src="/LOGO - Edukai v2.svg"
                                        alt="Logo Edukai"
                                        width={24}
                                        height={24}
                                        className="w-10 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 rounded-full"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-bold text-lg text-blue-600">
                                        Edukai
                                    </span>
                                    <span className="truncate text-xs text-gray-900">
                                        Révise mieux, pas plus
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <hr className="border-t border-gray-300 my-2" />
            <SidebarContent>
                <NavMain items={upLinks} />
                {adminLinks.length > 0 && (
                    <>
                        <hr className="border-t border-gray-300 my-2" />
                        <NavSecondary
                            items={adminLinks}
                            title="Administration"
                        />
                    </>
                )}
                <NavSecondary items={downLinks} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
