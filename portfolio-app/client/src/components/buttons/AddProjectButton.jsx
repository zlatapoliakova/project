import { useState } from "react";
import { Plus } from "lucide-react";

import CreateProjectModal from "../modals/CreateProjectModal";

function AddProjectButton({ onSave }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectSaved = (newProject) => {
    if (onSave) onSave(newProject);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-100 active:scale-95"
      >
        <Plus size={18} />
        <span className="hidden md:inline">Add Project</span>
      </button>

      {isModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleProjectSaved}
        />
      )}
    </>
  );
}

export default AddProjectButton;