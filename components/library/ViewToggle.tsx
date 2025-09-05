"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Grid3X3, Table2 } from "lucide-react";

interface ViewToggleProps {
    view: "grid" | "table";
    onViewChange: (view: "grid" | "table") => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
    return (
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("grid")}
                className={cn(
                    "h-8 px-1.5 lg:px-2 xl:px-3 text-sm transition-all",
                    view === "grid"
                        ? "bg-white shadow-sm text-blue-600 hover:bg-white hover:text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
            >
                <Grid3X3 className="w-4 h-4 lg:mr-1 xl:mr-2" />
                <span className="hidden lg:inline xl:inline">Cartes</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("table")}
                className={cn(
                    "h-8 px-1.5 lg:px-2 xl:px-3 text-sm transition-all",
                    view === "table"
                        ? "bg-white shadow-sm text-blue-600 hover:bg-white hover:text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
            >
                <Table2 className="w-4 h-4 lg:mr-1 xl:mr-2" />
                <span className="hidden lg:inline xl:inline">Tableau</span>
            </Button>
        </div>
    );
};
