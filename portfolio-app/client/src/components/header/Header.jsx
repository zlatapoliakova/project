import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Globe, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import AddProjectButton from "../buttons/AddProjectButton";
import Searchbar from "./Searchbar";

function Header() {
  const { user, isAuth, logout, loading, lang, toggleLanguage, t } = useAuth();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  if (loading || !t) return <header className="h-[64px] sm:h-[72px] bg-white border-b border-gray-100 shadow-sm" />;

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmText = lang === 'ua' ? "Ви впевнені?" : "Are you sure?";
    if (window.confirm(confirmText)) {
      logout();
      setMenuOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    }
  };

  const displayName = userData?.name 
    ? `${userData.name} ${userData.surname || ""}`.trim() 
    : (userData?.userName || "User");

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 z-[100]">
      
      <div className="flex justify-between items-center gap-3 sm:gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-4 sm:gap-8 min-w-0">
        <h1 
          className="text-xl sm:text-2xl font-black text-indigo-600 cursor-pointer tracking-tighter"
          onClick={() => navigate("/")}
        >
          Portify<span className="text-gray-900">.</span>
        </h1>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold">
          <NavLink to="/" end className={({isActive}) => isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}>
            {t.header.home}
          </NavLink>
          <NavLink to="/templates" className={({isActive}) => isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}>
            {t.header.templates}
          </NavLink>
        </nav>
      </div>

      {/* SEARCH */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <Searchbar />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        {/* MOBILE BURGER */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 order-3"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isAuth ? (
          <>
            {/* ADD BUTTON (hidden on small screens) */}
            <div className="hidden sm:block">
              {shouldShowAddButton && (
                <AddProjectButton userId={userId} onSave={() => window.location.reload()} />
              )}
            </div>

            {/* USER */}
            <div 
              className="relative flex items-center gap-2 sm:gap-3 py-1"
              onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setMenuOpen(true); }}
              onMouseLeave={() => { timeoutRef.current = setTimeout(() => setMenuOpen(false), 300); }}
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-gray-900 leading-none">{displayName}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                  {userData?.profession || t.header.member}
                </p>
              </div>

              <div 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-50 overflow-hidden cursor-pointer border-2 border-white shadow-sm ring-1 ring-gray-100 hover:scale-105 transition"
                onClick={() => navigate(`/profile/${userId}`)}
              >
                {userData?.avatar 
                  ? <img src={userData.avatar} alt="" className="w-full h-full object-cover" /> 
                  : <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-sm uppercase">
                      {displayName.charAt(0)}
                    </div>}
              </div>

              {/* DROPDOWN */}
              {menuOpen && (
                <div className="absolute right-0 top-full pt-3 w-56">
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-1.5">
                    <button onClick={() => { navigate(`/profile/${userId}`); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-sm font-bold rounded-xl">
                      <UserIcon size={16} /> {t.header.myProfile}
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); toggleLanguage(); }} className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-indigo-50 text-sm font-bold rounded-xl">
                      <div className="flex items-center gap-3">
                        <Globe size={16} /> {t.header.language}
                      </div>
                      <span className="text-xs font-black">{lang === 'en' ? 'UA' : 'EN'}</span>
                    </button>

                    <div className="h-px bg-gray-100 my-1" />

                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 text-sm font-black rounded-xl">
                      <LogOut size={16} /> {t.header.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-500">
              <Globe size={18} />
              <span className="text-xs font-black">{lang === 'en' ? 'UA' : 'EN'}</span>
            </button>

            <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-indigo-600">
              {t.header.login}
            </Link>

            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black">
              {t.header.register}
            </Link>
          </div>
        )}
      </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-md md:hidden p-4 flex flex-col gap-4">
          
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="font-bold text-gray-700">
            {t.header.home}
          </NavLink>

          <NavLink to="/templates" onClick={() => setMobileMenuOpen(false)} className="font-bold text-gray-700">
            {t.header.templates}
          </NavLink>

          <div className="block lg:hidden">
            <Searchbar />
          </div>

          {isAuth && shouldShowAddButton && (
            <div className="sm:hidden">
              <AddProjectButton userId={userId} onSave={() => window.location.reload()} />
            </div>
          )}

          {isAuth && (
            <>
              <button onClick={() => { navigate(`/profile/${userId}`); setMobileMenuOpen(false); }} className="text-left font-bold text-gray-700">
                {t.header.myProfile}
              </button>
              <button onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} className="text-left font-bold text-gray-700">
                {t.header.language}: {lang === 'en' ? 'UA' : 'EN'}
              </button>
              <button onClick={handleLogout} className="text-left font-bold text-red-500">
                {t.header.logout}
              </button>
            </>
          )}

          {!isAuth && (
            <>
              <button onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} className="text-left font-bold text-gray-700">
                {t.header.language}: {lang === 'en' ? 'UA' : 'EN'}
              </button>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-bold text-gray-700">
                {t.header.login}
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="font-bold text-gray-700">
                {t.header.register}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
