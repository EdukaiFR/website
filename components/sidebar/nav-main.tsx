"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    href: string;
    label: string;
    Icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1 px-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                isActive={isActive}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
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
                    flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-110
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 group-hover:text-blue-600"
                    }
                  `}
                  >
                    <item.Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`
                    font-medium truncate group-data-[collapsible=icon]:hidden
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-900"
                    }
                  `}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-white/30 rounded-r-full group-data-[collapsible=icon]:hidden" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
