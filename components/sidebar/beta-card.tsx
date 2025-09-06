"use client";

import { X, ArrowUpRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function BetaCard() {
    const [isVisible, setIsVisible] = useState(true);
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    if (!isVisible || isCollapsed) {
        return null;
    }

    return (
        <div className="mx-2 mb-2 relative">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-xl p-4 border border-blue-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full p-1 hover:bg-gray-100/80"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Beta Badge with sparkle */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300/50 mb-3">
                    <Sparkles className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 text-xs font-semibold">Beta</span>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-4">
                    <h3 className="text-gray-900 font-semibold text-sm leading-tight">
                        Version Beta d&apos;Edukai
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                        Vous testez la version beta. Vos retours nous aident à améliorer l&apos;expérience !
                    </p>
                </div>

                {/* CTA Button */}
                <button className="group flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md w-full">
                    <span className="text-white text-xs font-medium">
                        Donner un retour
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </button>
            </div>
        </div>
    );
}