import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import AddProjectButton from "../buttons/AddProjectButton";
import Searchbar from "./Searchbar"

function DashboardHeader({ avatar, userName, userProfession }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 300); 
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Ви впевнені, що хочете вийти?")) {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("userAvatar");
      navigate("/");
      window.location.reload(); 
    }
  };

  const navLinkStyles = ({ isActive }) => 
    `font-medium transition-colors relative py-1 ${
      isActive 
        ? "text-indigo-600 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-0.5 after:bg-indigo-600" 
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>
          Portify
        </h1>
        
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkStyles}>Home</NavLink>
          <NavLink to="/templates" className={navLinkStyles}>Templates</NavLink>
          <NavLink to="/profile" className={navLinkStyles}>Profile</NavLink>
        </nav>
      </div>

      <Searchbar />

      <div className="flex items-center gap-6">
        <AddProjectButton />

        <div
          className="relative flex items-center gap-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {userName && userName.trim() !== "undefined undefined" && userName.trim() !== "" 
                ? userName 
                : "User Name"}
            </p>
            <p className="text-xs text-gray-500 mt-1">{userProfession || "Designer"}</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer border border-gray-100 shadow-sm">
            {avatar ? (
              <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                {userName?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div
            className={`absolute right-0 top-full pt-2 w-44 transition-all duration-300
            ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
          >
            <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
              <button 
                onClick={handleLogout}
                className="w-full text-left block px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;