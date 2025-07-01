"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export type TipsProps = {
    tips: string[];
};

export const Tips = ({ tips }: TipsProps) => {
    const [selectedTip, setSelectedTip] = useState<string>("");

    // At the start of this comp, choose a random tip
    useEffect(() => {
        if (tips && tips.length > 0) {
            const randomIndex = Math.floor(Math.random() * tips.length);
            setSelectedTip(tips[randomIndex]);
        }
    }, [tips]);

    if (!tips || tips.length === 0) {
        return (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60 rounded-2xl p-4 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-200">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl">
                        <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-amber-800">
                        Astuces
                    </h3>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
                    <div className="p-3 bg-amber-100 rounded-2xl">
                        <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-800 mb-1">
                            Aucune astuce disponible
                        </p>
                        <p className="text-xs text-amber-600">
                            Les astuces apparaîtront ici pour t&apos;aider dans
                            tes révisions.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60 rounded-2xl p-4 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl">
                        <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-amber-800">
                        Astuces
                    </h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-xl">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
            </div>

            {/* Tip Content */}
            <div className="flex-1 flex items-center justify-center">
                <div className="p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-amber-200/50 text-center">
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {selectedTip}
                    </p>
                </div>
            </div>
        </div>
    );
};
