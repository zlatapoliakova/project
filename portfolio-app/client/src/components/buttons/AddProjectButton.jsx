import { useState } from "react";
import { Plus } from "lucide-react";
import CreateProjectModal from "../modals/CreateProjectModal";

function AddProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data) => {
    const savedPortfolios = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    
    const newProject = { 
      id: Date.now(), 
      type: "projects", 
      data 
    };
    
    const updated = [...savedPortfolios, newProject];
    localStorage.setItem("myPortfolios", JSON.stringify(updated));

    window.dispatchEvent(new Event("portfolioUpdated"));

    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Plus size={18} />
        Add Project
      </button>

      {isModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default AddProjectButton;