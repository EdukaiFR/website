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
      <div className="w-full hidden lg:flex items-center justify-start gap-3 outfit-regular text-medium-white">
        {tabs.map((tab) => (
          <Button
            key={tab.tab}
            onClick={() => handleTabChange(tab.tab)}
            className={`transition-all ${
              selectedTab === tab.tab
                ? "bg-[#3678FF] text-white hover:bg-[#3678FF]/80"
                : "bg-[#E3E3E7] bg-opacity-15 text-[#1A202C] text-opacity-75 hover:bg-[#1A202C]/10 text-medium-black"
            } px-5 rounded-full text-sm`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Mobile or smaller screen */}
      <ScrollArea className="lg:hidden w-full max-w-[19rem] whitespace-nowrap">
        <div className="py-2 w-full flex items-center justify-start gap-3 outfit-regular text-medium-white">
          {tabs.map((tab) => (
            <Button
              key={tab.tab}
              onClick={() => handleTabChange(tab.tab)}
              className={`transition-all ${
                selectedTab === tab.tab
                  ? "bg-[#3678FF] text-white hover:bg-[#3678FF]/80"
                  : "bg-[#E3E3E7] bg-opacity-15 text-[#1A202C] text-opacity-75 hover:bg-[#1A202C]/10 text-medium-black"
              } px-5 rounded-full text-sm`}
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
