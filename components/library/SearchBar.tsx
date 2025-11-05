import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export type SearchBarProps = {
    setSearch: (search: string) => void;
};

export const SearchBar = ({ setSearch }: SearchBarProps) => {
    return (
        <div className="relative flex items-center w-full group">
            <Search className="absolute left-4 w-5 h-5 text-blue-600 z-10 group-focus-within:text-indigo-600 transition-colors duration-200" />
            <Input
                type="text"
                placeholder="Rechercher un cours..."
                className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-xl 
                   text-gray-700 placeholder:text-gray-500 font-medium
                   focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 
                   hover:border-indigo-300 hover:bg-white
                   transition-all duration-200 shadow-sm hover:shadow-lg focus:shadow-lg
                   text-sm lg:text-base"
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        setSearch(e.currentTarget.value);
                    }
                }}
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-blue-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
};
