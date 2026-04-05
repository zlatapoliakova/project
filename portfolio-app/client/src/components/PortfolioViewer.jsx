import { useEffect, useState } from "react";
import { useParams, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import MinimalTemplate from "../templates/MinimalTemplate";
import GridTemplate from "../templates/GridTemplate";
import DarkTemplate from "../templates/DarkTemplate";
import { AlertCircle, ArrowLeft } from "lucide-react";

function PortfolioViewer() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuth, loading: authLoading } = useAuth(); 
  
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/portfolios/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);
          document.title = `${data.title || "Portfolio"} | Portify`;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPortfolio();
    
    return () => { document.title = "Portify"; };
  }, [id]);

  if (authLoading || loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-indigo-600"></div>
          <div className="absolute font-black text-[10px] text-indigo-600 uppercase tracking-tighter">Live</div>
        </div>
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          Loading Showcase...
        </p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center max-w-md">
          <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Portfolio Not Found</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            The link might be broken or the portfolio has been set to private by the owner.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const templateType = portfolio.template?.toLowerCase();
  
  const props = { 
    initialData: portfolio, 
    id, 
    readOnly: true 
  };

  switch (templateType) {
    case "grid":
      return <GridTemplate {...props} />;
    case "dark":
      return <DarkTemplate {...props} />;
    case "minimal":
    default:
      return <MinimalTemplate {...props} />;
  }
}

export default PortfolioViewer;
