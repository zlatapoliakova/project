import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MinimalTemplate from "../templates/MinimalTemplate";
import GridTemplate from "../templates/GridTemplate";
import DarkTemplate from "../templates/DarkTemplate";

function PortfolioEditor() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    if (id) {
      const saved = JSON.parse(localStorage.getItem("myPortfolios")) || [];
      const found = saved.find((p) => String(p.id) === String(id));
      if (found) {
        setTemplate({ id: found.template || "minimal" });
        setPortfolioData({ ...found.data, projects: found.projects || [] });
        return;
      }
    }

    const savedTemplate = localStorage.getItem("selectedTemplate");
    const savedPortfolio = localStorage.getItem("selectedPortfolio");
    if (savedTemplate) setTemplate(JSON.parse(savedTemplate));
    if (savedPortfolio) setPortfolioData(JSON.parse(savedPortfolio));
  }, [id]);

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl">Loading template...</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-indigo-600 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const templateId = template.id?.toLowerCase() || "minimal";
  const props = { initialData: portfolioData, id: id };

  if (templateId === "minimal") return <MinimalTemplate {...props} />;
  if (templateId === "grid") return <GridTemplate {...props} />;
  if (templateId === "dark") return <DarkTemplate {...props} />;

  return <div className="p-20 text-center">Template "{templateId}" not found</div>;
}

export default PortfolioEditor;