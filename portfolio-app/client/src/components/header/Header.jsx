import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AddProjectButton from "../buttons/AddProjectButton";
import Searchbar from "./Searchbar";

function Header() {
  const { user, isAuth, logout, loading } = useAuth();
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
        const data = await response.json();
        
        if (response.ok) {
          const fullAvatar = data.avatar 
            ? (data.avatar.startsWith('http') ? data.avatar : `http://localhost:5000${data.avatar}`)
            : null;
            
          setUserData({ ...data, avatar: fullAvatar });
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };

    fetchUserData();
  }, [userId, isAuth]);

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Ви впевнені, що хочете вийти?")) {
      logout();
      navigate("/");
    }
  };

  const displayName = userData?.name 
    ? `${userData.name} ${userData.surname || ""}`.trim() 
    : (userData?.userName || "User");

  if (loading) return <header className="h-[72px] bg-white border-b shadow-sm" />;

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>
          Portify
        </h1>
        
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={({isActive}) => isActive ? "text-indigo-600 font-bold" : "text-gray-600 hover:text-indigo-600 font-medium"}>Home</NavLink>
          <NavLink to="/templates" className={({isActive}) => isActive ? "text-indigo-600 font-bold" : "text-gray-600 hover:text-indigo-600 font-medium"}>Templates</NavLink>
        </nav>
      </div>

      <Searchbar />

      <div className="flex items-center gap-6">
        {isAuth ? (
          <>
            {shouldShowAddButton && <AddProjectButton onSave={() => window.location.reload()} />}

            <div className="relative flex items-center gap-3" 
                 onMouseEnter={() => {if (timeoutRef.current) clearTimeout(timeoutRef.current); setMenuOpen(true)}}
                 onMouseLeave={() => timeoutRef.current = setTimeout(() => setMenuOpen(false), 300)}>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">{displayName}</p>
                <p className="text-xs text-gray-500 mt-1">{userData?.profession || "Designer"}</p>
              </div>

              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-100"
                   onClick={() => navigate(`/profile/${userId}`)}>
                {userData?.avatar ? (
                  <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold bg-indigo-50">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {menuOpen && (
                <div className="absolute right-0 top-full pt-2 w-44">
                  <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
                    <button onClick={() => {navigate(`/profile/${userId}`); setMenuOpen(false)}} className="w-full text-left block px-4 py-2 hover:bg-gray-50 text-sm">
                      My Profile
                    </button>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-semibold">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;