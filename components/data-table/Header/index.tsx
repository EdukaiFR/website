import SearchBar from "./SearchBar";

const TopHeader = () => {
    return (
        <div className="flex flex-row justify-between items-center px-8 pt-8">
            <SearchBar />
        </div>
    );
};

export default TopHeader;
