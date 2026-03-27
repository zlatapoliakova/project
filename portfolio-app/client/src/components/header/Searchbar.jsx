import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User as UserIcon, Briefcase } from "lucide-react";

function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true);
        try {
          const res = await fetch(`http://localhost:5000/api/auth/search/designers?q=${query}`);
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFullImg = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:5000${path}`;
  };

  return (
    <div className="flex-1 max-w-md mx-8 relative hidden lg:block" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search designers or professions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[100]">
          <div className="p-2">
            {searching ? (
              <div className="p-4 text-center text-sm text-gray-400 italic">Searching...</div>
            ) : results.length > 0 ? (
              results.map((designer) => (
                <div
                  key={designer._id}
                  onClick={() => {
                    navigate(`/profile/${designer._id}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {designer.avatar ? (
                      <img src={getFullImg(designer.avatar)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-400 font-bold bg-indigo-50">
                        {designer.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-gray-900 truncate">
                      {designer.name ? `${designer.name} ${designer.surname}` : designer.userName}
                    </h4>
                    <div className="flex items-center gap-1.5">
                        <p className="text-xs text-gray-500 truncate">{designer.profession || "Designer"}</p>
                    </div>
                  </div>
                  <div className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Briefcase size={14} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">No designers found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Searchbar;