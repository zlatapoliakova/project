import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MinimalTemplate from "../templates/MinimalTemplate";
import GridTemplate from "../templates/GridTemplate";
import DarkTemplate from "../templates/DarkTemplate";

function PortfolioEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) return navigate("/templates");

      try {
        const response = await fetch(`http://localhost:5000/api/portfolios/${id}`);
        const data = await response.json();

        if (response.ok) {
          setPortfolioData(data);
        } else {
          navigate("/templates");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!portfolioData) return <div className="h-screen flex items-center justify-center">Portfolio not found</div>;

  const props = { initialData: portfolioData, id };

  switch (portfolioData.template?.toLowerCase()) {
    case "minimal":
      return <MinimalTemplate {...props} />;
    case "grid":
      return <GridTemplate {...props} />;
    case "dark":
      return <DarkTemplate {...props} />;
    default:
      return <div>Unknown template</div>;
  }
}

export default PortfolioEditor;