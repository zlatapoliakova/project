import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Globe, User as UserIcon, LogOut, ChevronRight } from "lucide-react";
import AddProjectButton from "../buttons/AddProjectButton";
import Searchbar from "./Searchbar";

function Header() {
  const { user, isAuth, logout, loading, lang, toggleLanguage, t } = useAuth();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id || user?._id;
  const isMyProfilePage = location.pathname === `/profile/${userId}`;
  const shouldShowAddButton = location.pathname === "/" || isMyProfilePage;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuth || !userId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/auth/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const fullAvatar = data.avatar 
            ? (data.avatar.startsWith('http') || data.avatar.startsWith('data:') 
                ? data.avatar 
                : `http://localhost:5000${data.avatar}`)
            : null;
          setUserData({ ...data, avatar: fullAvatar });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [userId, isAuth]);

  if (loading || !t) return <header className="h-[72px] bg-white border-b border-gray-100 shadow-sm" />;

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmText = lang === 'ua' ? "Ви впевнені?" : "Are you sure?";
    if (window.confirm(confirmText)) {
      logout();
      setMenuOpen(false);
      navigate("/");
    }
  };

  const displayName = userData?.name 
    ? `${userData.name} ${userData.surname || ""}`.trim() 
    : (userData?.userName || "User");

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100 px-8 py-4 flex justify-between items-center z-[100]">
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-black text-indigo-600 cursor-pointer tracking-tighter" onClick={() => navigate("/")}>
          Portify<span className="text-gray-900">.</span>
        </h1>
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
          <NavLink to="/" end className={({isActive}) => isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}>
            {t.header.home}
          </NavLink>
          <NavLink to="/templates" className={({isActive}) => isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}>
            {t.header.templates}
          </NavLink>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <Searchbar />
      </div>

      <div className="flex items-center gap-6">
        {isAuth ? (
          <>
            {shouldShowAddButton && <AddProjectButton userId={userId} onSave={() => window.location.reload()} />}
            <div className="relative flex items-center gap-3 py-1" 
                 onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setMenuOpen(true); }}
                 onMouseLeave={() => { timeoutRef.current = setTimeout(() => setMenuOpen(false), 300); }}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none">{displayName}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{userData?.profession || t.header.member}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 overflow-hidden cursor-pointer border-2 border-white shadow-sm ring-1 ring-gray-100 transition-transform hover:scale-105"
                   onClick={() => navigate(`/profile/${userId}`)}>
                {userData?.avatar ? <img src={userData.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-sm uppercase">{displayName.charAt(0)}</div>}
              </div>
              {menuOpen && (
                <div className="absolute right-0 top-full pt-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden p-1.5 backdrop-blur-xl">
                    <button onClick={() => { navigate(`/profile/${userId}`); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-gray-700 text-sm font-bold rounded-xl transition-all">
                      <UserIcon size={16} className="text-gray-400" /> {t.header.myProfile}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleLanguage(); }} className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-indigo-50 text-gray-700 text-sm font-bold rounded-xl transition-all">
                      <div className="flex items-center gap-3"><Globe size={16} className="text-gray-400" /> <span>{t.header.language}</span></div>
                      <div className="flex items-center gap-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">{lang === 'en' ? 'UA' : 'EN'} <ChevronRight size={10} /></div>
                    </button>
                    <div className="h-px bg-gray-50 my-1 mx-2" />
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 text-sm font-black rounded-xl transition-all">
                      <LogOut size={16} className="text-red-400" /> {t.header.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* Кнопка зміни мови для неавторизованого користувача */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-all group"
              title={t.header.language}
            >
              <Globe size={18} className="group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-indigo-600">
                {lang === 'en' ? 'UA' : 'EN'}
              </span>
            </button>

            <div className="h-6 w-px bg-gray-100 mx-1" />

            <Link to="/login" className="px-5 py-2.5 text-gray-500 font-bold text-sm hover:text-indigo-600 transition-colors">
              {t.header.login}
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg">
              {t.header.register}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;