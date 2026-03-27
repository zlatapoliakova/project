import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Templates from "../pages/Templates";
import Auth from "../pages/Auth";
import PortfolioEditor from "../pages/PortfolioEditor";
import PortfolioViewer from "../components/PortfolioViewer";

function AppRoutes() {
  const { isAuth, user, loading } = useAuth(); 
  const userId = user?.id || user?._id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      
      <Route path="/profile/:id" element={<Profile />} />
      
      <Route 
        path="/profile" 
        element={isAuth ? <Navigate to={`/profile/${userId}`} /> : <Navigate to="/login" />} 
      /> 
      
      <Route path="/templates" element={<Templates />} />
      
      <Route 
        path="/portfolio-editor" 
        element={isAuth ? <PortfolioEditor /> : <Navigate to="/login" />} 
      />
      <Route path="/portfolio-editor/:id" element={<PortfolioEditor />} />
      
      <Route path="/view-portfolio/:id" element={<PortfolioViewer />} />

      <Route 
        path="/login" 
        element={isAuth ? <Navigate to={`/profile/${userId}`} /> : <Auth mode="login" />} 
      />
      <Route 
        path="/register" 
        element={isAuth ? <Navigate to={`/profile/${userId}`} /> : <Auth mode="register" />} 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;