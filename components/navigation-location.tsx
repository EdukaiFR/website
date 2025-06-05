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
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useLinks } from "../hooks/use-links";

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment);
  const { upLinks, downLinks } = useLinks();
  const [courseTitle, setCourseTitle] = useState<string>("");

  // Function to check if a segment looks like a MongoDB ObjectId or course ID
  const isCourseId = (segment: string): boolean => {
    // Check if segment matches MongoDB ObjectId pattern (24 hex characters)
    const mongoIdPattern = /^[a-f\d]{24}$/i;
    // Check if segment matches other common ID patterns
    const generalIdPattern = /^[a-f\d]{12,}$/i;
    return mongoIdPattern.test(segment) || generalIdPattern.test(segment);
  };

  // Function to extract course title from page
  const extractCourseTitleFromPage = (): string => {
    // Wait for DOM to be ready
    if (typeof document === 'undefined') return "";

    // Try multiple selectors to find the course title
    const selectors = [
      'h1', // Main heading
      '[class*="title"]', // Any element with title in class name
      '[class*="course"]', // Any element with course in class name
      'header h1', // H1 in header
      'header [class*="title"]', // Title elements in header
      '.course-title', // Specific course title class
    ];

    for (const selector of selectors) {
      const elements = Array.from(document.querySelectorAll(selector));
      
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && 
            text !== "Edukai" && 
            text !== "Course" && 
            text !== "Document" &&
            text.length > 5 &&
            !text.includes("localhost") &&
            // Check if it looks like a course title (not just navigation)
            !text.includes("Bibliothèque") &&
            !text.includes("Accueil")) {
          console.log('Found course title:', text, 'using selector:', selector);
          return text;
        }
      }
    }

    // Try to find text in any element that looks like a course title
    const allElements = Array.from(document.querySelectorAll('*'));
    for (const element of allElements) {
      // Only check elements that are visible and have text content
      if (element.children.length === 0) { // Text nodes only
        const text = element.textContent?.trim();
        if (text && 
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
             text.includes("Mathématiques"))) {
          console.log('Found course title by pattern:', text);
          return text;
        }
      }
    }

    return "";
  };

  // Effect to get course title when on a course page
  useEffect(() => {
    const hasLibrarySegment = segments.includes("library");
    const courseIdSegment = segments.find((segment, index) => 
      hasLibrarySegment && segments[index - 1] === "library" && isCourseId(segment)
    );

    if (courseIdSegment) {
      // Try multiple times with increasing delays to catch dynamic content
      const attemptExtraction = (attempt: number = 0) => {
        const title = extractCourseTitleFromPage();
        if (title) {
          setCourseTitle(title);
        } else if (attempt < 5) {
          // Try again with longer delay
          setTimeout(() => attemptExtraction(attempt + 1), 200 * (attempt + 1));
        }
      };

      // Start extraction attempts
      attemptExtraction();
    } else {
      setCourseTitle("");
    }
  }, [pathname, segments]);

  function convertFormattedSegmentIntoLabelFromLinks(formattedSegment: string) {
    const { upLinks, downLinks } = useLinks();
    const allLinks = [...upLinks, ...downLinks];
    const matchingLink = allLinks.find(
      (link) => link.href.toLowerCase() === `/${formattedSegment.toLowerCase()}`
    );
    return matchingLink ? matchingLink.label : formattedSegment;
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-0 lg:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="mt-0.5 -ml-1 text-medium-muted hover:text-[#3678FF]" />

        {/* Breadcrumbs dynamiques */}
        <Breadcrumb className="">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden lg:block text-md text-medium-muted hover:text-medium">
              <BreadcrumbLink href="/">Edukai</BreadcrumbLink>
            </BreadcrumbItem>

            {/* Affichage des segments */}
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = "/" + segments.slice(0, index + 1).join("/");
              const formattedSegment =
                segment.charAt(0).toUpperCase() + segment.slice(1);
              
              // Check if this is a course ID and we have a course title
              const isLibraryPage = segments[index - 1] === "library";
              const shouldUseCourseTitle = isLibraryPage && isCourseId(segment) && courseTitle;
              
              const label = shouldUseCourseTitle 
                ? courseTitle 
                : convertFormattedSegmentIntoLabelFromLinks(formattedSegment);

              return (
                <React.Fragment key={href}>
                  {index === 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-xs lg:text-md text-medium cursor-not-allowed max-w-[200px] truncate">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className="hidden lg:flex cursor-pointer text-xs lg:text-md text-medium-muted hover:text-medium max-w-[200px] truncate"
                      >
                        {label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-medium mt-0.5 hidden lg:flex" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
