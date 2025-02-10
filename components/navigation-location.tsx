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
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import React from "react";

export function HeaderBreadcrumb() {
  const pathname = usePathname(); // Obtenir le chemin actuel
  const segments = pathname.split("/").filter((segment) => segment); // Divise le chemin en segments

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Breadcrumbs dynamiques */}
        <Breadcrumb>
          <BreadcrumbList>
            {/* Premier élément : "Platform" */}
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Platform</BreadcrumbLink>
            </BreadcrumbItem>

            {/* Affichage des segments */}
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = "/" + segments.slice(0, index + 1).join("/");
              const formattedSegment =
                segment.charAt(0).toUpperCase() + segment.slice(1);

              return (
                <React.Fragment key={href}>
                  {/* Ajouter un séparateur avant le premier segment si c'est un nombre */}
                  {index === 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="cursor-pointer">
                        {formattedSegment}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {/* Séparateur placé en dehors de <li>, sauf pour le dernier élément */}
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
