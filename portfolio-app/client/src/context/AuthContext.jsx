import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { translations } from "../utils/translations";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const t = translations[lang] || translations.en;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  const toggleLanguage = () => {
    setLang((prev) => {
      const newLang = prev === "en" ? "ua" : "en";
      localStorage.setItem("lang", newLang);
      return newLang;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuth: !!user, loading, lang, toggleLanguage, t }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};