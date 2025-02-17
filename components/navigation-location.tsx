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
import React from "react";
import { useLinks } from "./sidebar/links";

export function HeaderBreadcrumb() {
  const pathname = usePathname(); // Obtenir le chemin actuel
  const segments = pathname.split("/").filter((segment) => segment); // Divise le chemin en segments
  const { upLinks, downLinks } = useLinks();

  function convertFormattedSegmentIntoLabelFromLinks(formattedSegment: string) {
    const { upLinks, downLinks } = useLinks();
    const allLinks = [...upLinks, ...downLinks];
    const matchingLink = allLinks.find(
      (link) => link.href.toLowerCase() === `/${formattedSegment.toLowerCase()}`
    );
    return matchingLink ? matchingLink.label : formattedSegment;
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="mt-0.5 -ml-1 text-medium-muted hover:text-[#3678FF]" />

        {/* Breadcrumbs dynamiques */}
        <Breadcrumb className="">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block text-md text-medium-muted hover:text-medium">
              <BreadcrumbLink href="/">Edukai</BreadcrumbLink>
            </BreadcrumbItem>

            {/* Affichage des segments */}
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = "/" + segments.slice(0, index + 1).join("/");
              const formattedSegment =
                segment.charAt(0).toUpperCase() + segment.slice(1);
              const label =
                convertFormattedSegmentIntoLabelFromLinks(formattedSegment);

              return (
                <React.Fragment key={href}>
                  {index === 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-md text-medium cursor-not-allowed">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className="cursor-pointer text-md text-medium-muted hover:text-medium"
                      >
                        {label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-medium mt-0.5" />
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
