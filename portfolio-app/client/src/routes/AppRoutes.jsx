import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Templates from "../pages/Templates";
import Auth from "../pages/Auth";
import Profile from "../pages/Profile";
import PortfolioEditor from "../pages/PortfolioEditor";
import PortfolioViewer from "../components/PortfolioViewer";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/templates" element={<Templates />} />

      <Route path="/portfolio-editor" element={<PortfolioEditor />} />
      <Route path="/portfolio-editor/:id" element={<PortfolioEditor />} />
      
      <Route path="/view-portfolio/:id" element={<PortfolioViewer />} />

      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
    </Routes>
  );
}

export default AppRoutes;