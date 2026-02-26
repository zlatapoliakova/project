import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AddProject from "../pages/AddProject";
import Portfolio from "../pages/Portfolio";
import Templates from "../pages/Templates";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add-project" element={<AddProject />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/templates" element={<Templates />} />
    </Routes>
  );
}

export default AppRoutes;