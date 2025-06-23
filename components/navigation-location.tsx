"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    Home,
    ChevronRight,
    BookOpen,
    Sparkles,
    Users,
    Bell,
    Settings,
    LifeBuoy,
} from "lucide-react";

export function HeaderBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(segment => segment);
    const [courseTitle, setCourseTitle] = useState<string>("");

    // Function to check if a segment looks like a MongoDB ObjectId or course ID
    const isCourseId = (segment: string): boolean => {
        // Check if segment matches MongoDB ObjectId pattern (24 hex characters)
        const mongoIdPattern = /^[a-f\d]{24}$/i;
        // Check if segment matches other common ID patterns
        const generalIdPattern = /^[a-f\d]{12,}$/i;
        return mongoIdPattern.test(segment) || generalIdPattern.test(segment);
    };

    // Function to get icon for breadcrumb item
    const getIconForSegment = (segment: string, isLast: boolean = false) => {
        const iconMap: { [key: string]: React.ElementType } = {
            library: BookOpen,
            bibliothèque: BookOpen,
            generate: Sparkles,
            générer: Sparkles,
            "club-edukai": Users,
            notifications: Bell,
            settings: Settings,
            paramètres: Settings,
            support: LifeBuoy,
            assistance: LifeBuoy,
        };

        const IconComponent = iconMap[segment.toLowerCase()];

        if (IconComponent) {
            return <IconComponent className="w-4 h-4" />;
        }

        // For course pages (last segment with course ID)
        if (isLast && segments[segments.length - 2] === "library") {
            return <BookOpen className="w-4 h-4" />;
        }

        return null;
    };

    // Function to extract course title from page
    const extractCourseTitleFromPage = (): string => {
        // Wait for DOM to be ready
        if (typeof document === "undefined") return "";

        // Try multiple selectors to find the course title
        const selectors = [
            "h1", // Main heading
            '[class*="title"]', // Any element with title in class name
            '[class*="course"]', // Any element with course in class name
            "header h1", // H1 in header
            'header [class*="title"]', // Title elements in header
            ".course-title", // Specific course title class
        ];

        for (const selector of selectors) {
            const elements = Array.from(document.querySelectorAll(selector));

            for (const element of elements) {
                const text = element.textContent?.trim();
                if (
                    text &&
                    text !== "Edukai" &&
                    text !== "Course" &&
                    text !== "Document" &&
                    text.length > 5 &&
                    !text.includes("localhost") &&
                    // Check if it looks like a course title (not just navigation)
                    !text.includes("Bibliothèque") &&
                    !text.includes("Accueil")
                ) {
                    console.log(
                        "Found course title:",
                        text,
                        "using selector:",
                        selector
                    );
                    return text;
                }
            }
        }

        // Try to find text in any element that looks like a course title
        const allElements = Array.from(document.querySelectorAll("*"));
        for (const element of allElements) {
            // Only check elements that are visible and have text content
            if (element.children.length === 0) {
                // Text nodes only
                const text = element.textContent?.trim();
                if (
                    text &&
                    text.length > 10 &&
                    text.length < 100 &&
                    !text.includes("Edukai") &&
                    !text.includes("Bibliothèque") &&
                    // Look for common course title patterns
                    (text.includes("Les ") ||
                        text.includes("Le ") ||
                        text.includes("La ") ||
                        text.includes("équations") ||
                        text.includes("Guerre") ||
                        text.includes("Histoire") ||
                        text.includes("Mathématiques"))
                ) {
                    console.log("Found course title by pattern:", text);
                    return text;
                }
            }
        }

        return "";
    };

    // Effect to get course title when on a course page
    useEffect(() => {
        const hasLibrarySegment = segments.includes("library");
        const courseIdSegment = segments.find(
            (segment, index) =>
                hasLibrarySegment &&
                segments[index - 1] === "library" &&
                isCourseId(segment)
        );

        if (courseIdSegment) {
            // Try multiple times with increasing delays to catch dynamic content
            const attemptExtraction = (attempt: number = 0) => {
                const title = extractCourseTitleFromPage();
                if (title) {
                    setCourseTitle(title);
                } else if (attempt < 5) {
                    // Try again with longer delay
                    setTimeout(
                        () => attemptExtraction(attempt + 1),
                        200 * (attempt + 1)
                    );
                }
            };

            // Start extraction attempts
            attemptExtraction();
        } else {
            setCourseTitle("");
        }
    }, [pathname, segments]);

    return (
        <header className="flex h-14 shrink-0 items-center gap-0 lg:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-3 px-4 w-full min-w-0">
                {/* Sidebar Trigger - Always visible on larger screens, hidden on mobile when sidebar is open as overlay */}
                <SidebarTrigger className="mt-0.5 -ml-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex-shrink-0 md:flex" />

                <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-4 text-gray-400 bg-gray-400 rounded-full"
                />

                {/* Modern Breadcrumb Container - Responsive with icon-only on small screens */}
                <div className="flex items-center rounded-xl py-2 flex-1 min-w-0 animate-in fade-in-0 slide-in-from-top-1 duration-300">
                    {/* Home Icon - Always visible */}
                    <div className="flex items-center gap-2 text-blue-600 flex-shrink-0">
                        <div className="p-1.5 bg-blue-100 rounded-lg group hover:bg-blue-200 transition-colors">
                            <Home className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Breadcrumb Navigation - Responsive */}
                    <Breadcrumb className="ml-2 lg:ml-3 min-w-0 flex-1">
                        <BreadcrumbList className="gap-1 flex-nowrap overflow-hidden">
                            {/* Dynamic Segments */}
                            {segments.map((segment, index) => {
                                const isLast = index === segments.length - 1;
                                const href =
                                    "/" +
                                    segments.slice(0, index + 1).join("/");
                                const formattedSegment =
                                    segment.charAt(0).toUpperCase() +
                                    segment.slice(1);

                                // Check if this is a course ID and we have a course title
                                const isLibraryPage =
                                    segments[index - 1] === "library";
                                const shouldUseCourseTitle =
                                    isLibraryPage &&
                                    isCourseId(segment) &&
                                    courseTitle;

                                const label = shouldUseCourseTitle
                                    ? courseTitle
                                    : formattedSegment;

                                const icon = getIconForSegment(segment, isLast);

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbSeparator className="mx-1 flex-shrink-0">
                                            <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem className="min-w-0 flex-shrink-0">
                                            {isLast ? (
                                                <BreadcrumbPage className="flex items-center gap-1.5 lg:gap-2 text-gray-900 font-medium min-w-0">
                                                    {icon && (
                                                        <span className="text-blue-600 flex-shrink-0">
                                                            {icon}
                                                        </span>
                                                    )}
                                                    {/* Show text only on larger screens, icon-only on mobile */}
                                                    <span
                                                        className="hidden sm:inline text-xs lg:text-sm truncate min-w-0"
                                                        title={label}
                                                    >
                                                        {label}
                                                    </span>
                                                    {/* Show icon if no icon exists and we're on mobile */}
                                                    {!icon && (
                                                        <span className="sm:hidden text-blue-600 flex-shrink-0">
                                                            <BookOpen className="w-4 h-4" />
                                                        </span>
                                                    )}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink
                                                    href={href}
                                                    className="flex items-center gap-1.5 lg:gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 px-1.5 lg:px-2 py-1 rounded-lg hover:bg-blue-50 min-w-0"
                                                >
                                                    {icon && (
                                                        <span className="text-blue-600 flex-shrink-0">
                                                            {icon}
                                                        </span>
                                                    )}
                                                    {/* Show text only on larger screens, icon-only on mobile */}
                                                    <span
                                                        className="hidden sm:inline text-xs lg:text-sm font-medium truncate min-w-0"
                                                        title={label}
                                                    >
                                                        {label}
                                                    </span>
                                                    {/* Show icon if no icon exists and we're on mobile */}
                                                    {!icon && (
                                                        <span className="sm:hidden text-blue-600 flex-shrink-0">
                                                            <BookOpen className="w-4 h-4" />
                                                        </span>
                                                    )}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Right side spacer for balance */}
                <div className="hidden lg:block w-16 flex-shrink-0"></div>
            </div>
        </header>
    );
}
