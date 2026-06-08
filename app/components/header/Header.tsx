import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import {
  setSearch,
  fetchContentListAsync,
  fetchContentHistoryAsync,
} from "@store/slices/contentSlice";
import { RootState } from "@store/store";

const SearchBar = () => {
  const dispatch = useDispatch<any>();
  const pathname = usePathname();

  const search = useSelector((state: RootState) => state.content.search);
  const contentHistories = useSelector((state: RootState) => state.content.contentHistories);

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    dispatch(fetchContentHistoryAsync());
  }, [dispatch]);

  const onSubmit = () => {
    if (!search.trim()) return;
    dispatch(fetchContentListAsync(search));
    dispatch(fetchContentHistoryAsync());
    setShowHistory(false);
  };

  return (
    <header className="flex flex-col h-40 items-center justify-center p-4 relative bg-dark-blue">
      {pathname !== "/auth/change-password" && pathname !== "/auth/profile" && (
        <div className="w-full my-4 max-w-xl relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
            className="w-full px-4 py-2 pr-10 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <Search
            onClick={onSubmit}
            className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />

          {showHistory && contentHistories.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-white text-black rounded-md shadow-md z-10 max-h-40 overflow-y-auto">
              {contentHistories.map((item, index) => (
                <li
                  key={index}
                  onMouseDown={() => {
                    dispatch(setSearch(item.query));
                    dispatch(fetchContentListAsync(item.query));
                    setShowHistory(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.query}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default SearchBar;
