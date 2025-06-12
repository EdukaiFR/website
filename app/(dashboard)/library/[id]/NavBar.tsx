"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type NavBarProps = {
  tabs: { label: string; tab: string }[];
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
};

export const NavBar = ({ tabs, setSelectedTab, selectedTab }: NavBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Met à jour l'état et l'URL lorsqu'un onglet est sélectionné
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    const newUrl = `${pathname}?tab=${tab}`;
    router.push(newUrl, { scroll: false });
  };

  // Synchronisation avec l'URL au chargement ou lorsque l'URL change
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabFromUrl !== selectedTab) {
      setSelectedTab(tabFromUrl);
    }
  }, [searchParams, setSelectedTab]);

  return (
    <>
      {/* Large screen view */}
      <div className="w-full hidden lg:flex items-center justify-start gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab.tab}
            onClick={() => handleTabChange(tab.tab)}
            className={`transition-all duration-200 ${
              selectedTab === tab.tab
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                : "bg-white/80 text-gray-700 border border-blue-200/60 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
            } px-6 py-2 rounded-xl font-medium backdrop-blur-sm`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Mobile or smaller screen */}
      <ScrollArea className="lg:hidden w-full whitespace-nowrap">
        <div className="py-2 w-full flex items-center justify-start gap-3">
          {tabs.map((tab) => (
            <Button
              key={tab.tab}
              onClick={() => handleTabChange(tab.tab)}
              className={`transition-all duration-200 ${
                selectedTab === tab.tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                  : "bg-white/80 text-gray-700 border border-blue-200/60 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
              } px-6 py-2 rounded-xl font-medium whitespace-nowrap backdrop-blur-sm`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};
