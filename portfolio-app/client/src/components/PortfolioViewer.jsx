import { useEffect, useState } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import MinimalTemplate from "../templates/MinimalTemplate";
import GridTemplate from "../templates/GridTemplate";
import DarkTemplate from "../templates/DarkTemplate";

function PortfolioViewer() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuth, loading: authLoading } = useAuth(); 
  
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/portfolios/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setPortfolio(data);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPortfolio();
  }, [id]);

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!portfolio) {
    return (
      <div className="h-screen flex items-center justify-center italic text-gray-500">
        Portfolio not found
      </div>
    );
  }

  const templateType = portfolio.template?.toLowerCase();
  const props = { initialData: portfolio, id, readOnly: true };

  switch (templateType) {
    case "grid":
      return <GridTemplate {...props} />;
    case "dark":
      return <DarkTemplate {...props} />;
    default:
      return <MinimalTemplate {...props} />;
  }
}

export default PortfolioViewer;