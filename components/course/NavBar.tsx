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

    // Update state and URL when a tab is selected
    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
        const newUrl = `${pathname}?tab=${tab}`;
        router.push(newUrl, { scroll: false });
    };

    // Synchronize with URL on load or when URL changes
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl && tabFromUrl !== selectedTab) {
            setSelectedTab(tabFromUrl);
        }
    }, [searchParams, selectedTab, setSelectedTab]);

    // Common styles for buttons (identical on mobile and desktop)
    const getButtonStyles = (isSelected: boolean) =>
        `transition-all duration-200 ${
            isSelected
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
                : "bg-white/80 text-gray-700 border border-blue-200/60 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
        } px-6 py-2 rounded-xl font-medium backdrop-blur-sm whitespace-nowrap flex-shrink-0`;

    return (
        <>
            {/* Large screen view */}
            <div className="w-full hidden lg:flex items-center justify-start gap-3">
                {tabs.map(tab => (
                    <Button
                        key={tab.tab}
                        onClick={() => handleTabChange(tab.tab)}
                        className={getButtonStyles(selectedTab === tab.tab)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Mobile view - Same button styles with horizontal scroll */}
            <div className="lg:hidden w-full">
                <ScrollArea className="w-full">
                    <div className="flex items-center gap-3 px-4 py-2 w-max">
                        {tabs.map(tab => (
                            <Button
                                key={tab.tab}
                                onClick={() => handleTabChange(tab.tab)}
                                className={getButtonStyles(
                                    selectedTab === tab.tab
                                )}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-2" />
                </ScrollArea>
            </div>
        </>
    );
};
