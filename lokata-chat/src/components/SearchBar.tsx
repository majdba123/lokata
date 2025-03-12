
import { Search, Menu } from "lucide-react";
const SearchBar = () => {
    return (
        <>
            <div className="flex items-center space-x-2 p-2 bg-white   w-full max-w-md">
                {/* Menu Icon */}
                <button className="p-2">
                    <Menu className="w-5 h-5 text-gray-500" />
                </button>

                {/* Search Input */}
                <div className="relative flex items-center flex-1">
                    <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </>
    )
}

export default SearchBar