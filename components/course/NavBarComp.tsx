"use client";

import { motion } from "framer-motion";

interface NavBarCompProps {
    isPrivateView: boolean;
    tabs: Array<{
        label: string;
        tab: string;
        component: React.ComponentType<Record<string, unknown>>;
    }>;
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

export default function NavBarComp({
    isPrivateView,
    tabs,
    selectedTab,
    setSelectedTab,
}: NavBarCompProps) {
    // Function to get very short labels for mobile
    const getMobileLabel = (label: string) => {
        const mobileLabels: { [key: string]: string } = {
            Aperçu: "Aperçu",
            "Fiches de révision": "Fiches",
            Examens: "Exams",
            Objectifs: "Obj.",
            Statistiques: "Stats",
            "Cours similaires": "Simil.",
            "Mes fichiers": "Fichiers",
            Fichiers: "Fichiers",
        };
        return mobileLabels[label] || label.slice(0, 6);
    };

    // Show all tabs for all users (public courses fully accessible)
    // Backend handles privacy (users see only their own exams/insights)
    const displayedTabs = tabs;

    return (
        <div className="w-full max-w-full">
            {/* Modern pill-style navigation with backdrop */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-gray-100">
                {/* Scrollable tabs container */}
                <div className="flex overflow-x-auto scrollbar-hide gap-1 w-full max-w-full">
                    {displayedTabs.map((tab, index) => {
                        const isActive = selectedTab === tab.tab;
                        return (
                            <button
                                key={tab.tab}
                                onClick={() => setSelectedTab(tab.tab)}
                                className="relative flex-shrink-0 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5
                                         font-medium text-[11px] sm:text-sm lg:text-base
                                         whitespace-nowrap min-w-0 max-w-[65px] sm:max-w-none
                                         transition-colors duration-200 z-10
                                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                         rounded-xl"
                                title={tab.label}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`panel-${tab.tab}`}
                                tabIndex={isActive ? 0 : -1}
                            >
                                {/* Animated background for active tab */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500
                                                 rounded-xl shadow-md"
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                {/* Tab label with conditional styling */}
                                <span
                                    className={`relative z-10 transition-colors duration-200 ${
                                        isActive
                                            ? "text-white font-semibold"
                                            : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    {/* Mobile: Ultra-compact labels */}
                                    <span className="block sm:hidden text-center leading-tight">
                                        {getMobileLabel(tab.label)}
                                    </span>
                                    {/* Desktop: Full labels */}
                                    <span className="hidden sm:block">
                                        {tab.label}
                                    </span>
                                </span>

                                {/* Subtle hover effect for inactive tabs */}
                                {!isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-blue-50 rounded-xl opacity-0
                                                 hover:opacity-100 transition-opacity duration-200"
                                        initial={false}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
