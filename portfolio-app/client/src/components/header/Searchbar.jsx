import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase } from "lucide-react";

function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Тимчасові дані для пошуку
  const mockDesigners = [
    { id: 1, name: "Олександр Коваль", profession: "UI/UX Designer", projects: 12, avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Марія Петренко", profession: "Graphic Designer", projects: 8, avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Дмитро Сидорчук", profession: "Web Designer", projects: 15, avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Анна Бєлова", profession: "Product Designer", projects: 21, avatar: "https://i.pravatar.cc/150?u=4" },
  ];

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = mockDesigners.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.profession.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 max-w-md mx-8 relative hidden lg:block" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search designers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {results.length > 0 ? (
              results.map((designer) => (
                <div
                  key={designer.id}
                  onClick={() => {
                    navigate(`/user/${designer.id}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors group"
                >
                  <img src={designer.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-gray-100" />
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {designer.name}
                    </h4>
                    <p className="text-xs text-gray-500">{designer.profession}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    <Briefcase size={10} />
                    {designer.projects}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">Нікого не знайдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Searchbar;