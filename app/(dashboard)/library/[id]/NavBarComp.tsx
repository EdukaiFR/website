interface NavBarCompProps {
  tabs: { label: string; tab: string; component: React.ComponentType<any> }[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export default function NavBarComp({
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
    };
    return mobileLabels[label] || label.slice(0, 6);
  };

  return (
    <div className="w-full max-w-full bg-white/70 backdrop-blur-sm rounded-2xl p-1 sm:p-2 shadow-sm border border-white/20 overflow-hidden">
      {/* Mobile: Horizontal scroll with very compact tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2 w-full max-w-full pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.tab}
            onClick={() => setSelectedTab(tab.tab)}
            className={`
              flex-shrink-0 px-1.5 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-2xl 
              font-medium text-[10px] sm:text-sm lg:text-base transition-all duration-200 
              whitespace-nowrap min-w-0 max-w-[60px] sm:max-w-none
              ${
                selectedTab === tab.tab
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80"
              }
            `}
            title={tab.label} // Show full label on hover
          >
            {/* Ultra-compact mobile labels, full labels on desktop */}
            <span className="block sm:hidden text-center leading-tight">
              {getMobileLabel(tab.label)}
            </span>
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
