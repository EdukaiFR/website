import { Button } from "@/components/ui/button";

export type NavBarProps = {
  tabs: { label: string; tab: string }[];
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
};

export const NavBar = ({ setSelectedTab, tabs, selectedTab }: NavBarProps) => {
  return (
    <div className="w-full flex items-center justify-start gap-3 outfit-regular text-medium-white">
      {tabs.map((tab) => (
        <Button
          key={tab.tab}
          onClick={() => setSelectedTab(tab.tab)}
          className={`transition-all ${
            selectedTab === tab.tab
              ? "bg-[#3678FF] text-white hover:bg-[#3678FF]/80"
              : "bg-[#E3E3E7] bg-opacity-15 text-[#1A202C] text-opacity-75 hover:bg-[#1A202C]/10 text-medium-black  "
          } px-5 rounded-full text-sm`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
