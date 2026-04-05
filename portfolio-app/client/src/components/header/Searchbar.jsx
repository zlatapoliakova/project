import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X as CloseIcon, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Searchbar() {
  const { t } = useAuth();
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
          if (res.ok) {
            const data = await res.json();
            setResults(data);
          }
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
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const getFullImg = (path) => {
    if (!path) return null;
    return (path.startsWith('http') || path.startsWith('data:')) 
      ? path 
      : `http://localhost:5000${path}`;
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  if (!t) return null;

  return (
    <div className="flex-1 w-full relative" ref={searchRef}>
      <div className="relative group">
        <Search 
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isOpen ? 'text-indigo-500' : 'text-gray-400'}`} 
          size={18} 
        />
        <input
          type="text"
          placeholder={t.search.placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-gray-100 border border-transparent rounded-2xl py-2.5 pl-11 pr-10 text-sm font-medium focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none min-w-0"
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-3 w-full min-w-0 bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden z-[100]">
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {searching ? (
              <div className="p-6 text-center">
                <div className="inline-block w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.search.searching}</p>
              </div>
            ) : results.length > 0 ? (
              results.map((designer) => (
                <div
                  key={designer._id}
                  onClick={() => {
                    navigate(`/profile/${designer._id}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-indigo-50 rounded-2xl cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {designer.avatar ? (
                      <img src={getFullImg(designer.avatar)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black bg-indigo-50 text-sm">
                        {designer.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black text-gray-900 truncate">
                      {designer.name 
                        ? `${designer.name} ${designer.surname || ""}`.trim() 
                        : designer.userName}
                    </h4>
                    <p className="text-[11px] font-bold text-indigo-500 uppercase">
                      {designer.profession || t.search.defaultProfession}
                    </p>
                  </div>

                  <ArrowRight size={14} className="text-indigo-400" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-gray-400">{t.search.noResults}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Searchbar;
