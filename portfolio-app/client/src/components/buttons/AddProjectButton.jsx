import { useState } from "react";
import { Plus } from "lucide-react";
import CreateProjectModal from "../modals/CreateProjectModal";

function AddProjectButton({ userId, onSave }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectSaved = (newProject) => {
    if (newProject && onSave) {
      onSave(newProject);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Add new project or portfolio"
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-200/50 active:scale-95"
      >
        <Plus size={18} strokeWidth={2.5} />
        <span className="hidden md:inline text-sm">Add New Work</span>
      </button>

      {isModalOpen && (
        <CreateProjectModal 
          userId={userId}
          onClose={() => setIsModalOpen(false)} 
          onSave={handleProjectSaved}
        />
      )}
    </>
  );
}

export default AddProjectButton;