import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MinimalTemplate from "../templates/MinimalTemplate";
import GridTemplate from "../templates/GridTemplate";
import DarkTemplate from "../templates/DarkTemplate";

function PortfolioViewer() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const found = saved.find((p) => String(p.id) === String(id));
    setPortfolio(found);
  }, [id]);

  if (!portfolio) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 italic">Завантаження портфоліо...</p>
      </div>
    );
  }

  const templateType = portfolio.template?.toLowerCase();

  if (templateType === "grid") {
    return <GridTemplate initialData={portfolio.data} id={id} readOnly={true} />;
  }
  if (templateType === "dark") {
    return <DarkTemplate initialData={portfolio.data} id={id} readOnly={true} />;
  }

  return <MinimalTemplate initialData={portfolio.data} id={id} readOnly={true} />;
}

export default PortfolioViewer;