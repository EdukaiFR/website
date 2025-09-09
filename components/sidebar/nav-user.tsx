"use client";

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
import { useSession } from "@/hooks/useSession";
import { useUserProfile } from "@/contexts/UserContext";
import { getImageDisplaySrc } from "@/lib/image-utils";
import { ChevronsUpDown, LogOut, Settings, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser() {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const router = useRouter();
    const { logout } = useSession();
    const { userProfile, loading } = useUserProfile();

    if (loading) {
        // Loading skeleton
        return (
            <SidebarMenu className="px-2">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className={`group flex items-center transition-all duration-200 bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50 backdrop-blur-sm h-auto ${
                            isCollapsed
                                ? "justify-center p-2.5 w-8 h-8"
                                : "gap-3 px-3 py-2.5 rounded-xl"
                        }`}
                        disabled
                    >
                        <div
                            className={`flex-shrink-0 animate-pulse bg-gray-300 rounded-full ${
                                isCollapsed ? "w-8 h-8" : "w-5 h-5"
                            }`}
                        />
                        {!isCollapsed && (
                            <div className="flex flex-col space-y-1 flex-1">
                                <div className="h-4 bg-gray-300 rounded animate-pulse" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                            </div>
                        )}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    if (!userProfile) {
        return null;
    }

    // Use new user data structure
    const displayName =
        userProfile.firstName && userProfile.lastName
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : userProfile.username || userProfile.email || "User";

    const initials = displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Show educational info if available
    const educationInfo =
        userProfile.grade || userProfile.levelOfStudy
            ? `${userProfile.grade || ""} ${userProfile.levelOfStudy || ""}`.trim()
            : userProfile.institution || "";

    const handleSignOut = async () => {
        await logout();
        router.push("/auth");
    };

    return (
        <SidebarMenu className="px-2">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={`group flex items-center transition-all duration-200 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-white hover:to-gray-50 hover:shadow-md hover:shadow-gray-200/50 border border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm h-auto ${
                                isCollapsed
                                    ? "justify-center p-2.5 w-8 h-8"
                                    : "gap-3 px-3 py-2.5 rounded-xl"
                            }`}
                        >
                            {/* Avatar with real profile picture */}
                            <div
                                className={`relative flex-shrink-0 flex items-center justify-center ${
                                    isCollapsed ? "w-auto h-auto" : "w-5 h-5"
                                }`}
                            >
                                <Avatar
                                    className={`ring-1 ring-white shadow-sm ${
                                        isCollapsed
                                            ? "h-8 w-8 ring-2"
                                            : "h-5 w-5"
                                    }`}
                                >
                                    <AvatarImage
                                        src={getImageDisplaySrc(
                                            userProfile.profilePic
                                        )}
                                        alt={displayName}
                                    />
                                    <AvatarFallback
                                        className={`bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-semibold ${
                                            isCollapsed
                                                ? "text-sm"
                                                : "text-[10px]"
                                        }`}
                                    >
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`absolute -top-0.5 -right-0.5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border border-white shadow-sm ${
                                        isCollapsed
                                            ? "w-3 h-3 border-2"
                                            : "w-2 h-2"
                                    }`}
                                ></div>
                            </div>

                            {/* User info with username - hidden when collapsed */}
                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="truncate text-sm font-semibold text-gray-800">
                                        {displayName}
                                    </span>
                                    <span className="truncate text-xs text-gray-600">
                                        {userProfile.username
                                            ? `@${userProfile.username}`
                                            : userProfile.email}
                                    </span>
                                </div>
                            )}

                            {/* Chevron - hidden when collapsed */}
                            {!isCollapsed && (
                                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                            )}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={getImageDisplaySrc(
                                            userProfile.profilePic
                                        )}
                                        alt={displayName}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {displayName}
                                    </span>
                                    <span className="truncate text-xs text-gray-600">
                                        {userProfile.username
                                            ? `@${userProfile.username}`
                                            : userProfile.email}
                                    </span>
                                    {educationInfo && (
                                        <span className="truncate text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                                            <GraduationCap className="w-3 h-3" />
                                            {educationInfo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Settings className="w-4 h-4" />
                                    Paramètres
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
