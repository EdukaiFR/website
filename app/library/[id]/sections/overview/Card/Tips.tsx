"use client";

import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

export type TipsProps = {
  tips: string[];
};

export const Tips = ({ tips }: TipsProps) => {
  const [selectedTip, setSelectedTip] = useState<string>("");

  // At the start of this comp, choose a random tip
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);

  return (
    <div className="bg-[#FFC107] bg-opacity-20 rounded-lg p-4 flex flex-col items-start justify-between gap-3 h-full satoshi-medium ">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-lg text-[#FFC107]">Astuces</h3>
        <Lightbulb size={20} className="text-[#FFC107]" />
      </div>
      <div className="flex items-center justify-center gap-2 text-sm mb-2 ml-auto mr-auto">
        <p className="text-[rgba(26, 32, 44, 1)] opacity-85">{selectedTip}</p>
      </div>
    </div>
  );
};
