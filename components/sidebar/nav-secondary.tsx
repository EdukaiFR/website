"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    href: string;
    label: string;
    Icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1 px-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  tooltip={item.label}
                  isActive={isActive}
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 
                    ${
                      isActive
                        ? "bg-gray-100 text-gray-900 border border-gray-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }
                    group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2.5
                  `}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 w-full"
                  >
                    <div
                      className={`
                      flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-105
                      ${
                        isActive
                          ? "text-gray-700"
                          : "text-gray-500 group-hover:text-gray-700"
                      }
                    `}
                    >
                      <item.Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`
                      text-sm font-medium truncate group-data-[collapsible=icon]:hidden
                      ${
                        isActive
                          ? "text-gray-900"
                          : "text-gray-600 group-hover:text-gray-800"
                      }
                    `}
                    >
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
