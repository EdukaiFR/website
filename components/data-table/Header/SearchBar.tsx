import { SearchIcon } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="flex flex-row items-center h-9 rounded-lg shadow-sm">
            <div className="flex flex-row items-center rounded-r-lg border border-l-0 h-full relative">
                <SearchIcon className="w-4 h-4 ml-2 absolute text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="h-full py-0 px-3 border-none text-sm w-72 rounded-r-lg pl-8"
                />
            </div>
        </div>
    );
};

export default SearchBar;
