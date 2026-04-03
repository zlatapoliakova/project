import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CreateProjectModal from "../modals/CreateProjectModal";

function AddProjectButton({ userId, onSave }) {
  const { t } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectSaved = (newProject) => {
    if (newProject && onSave) {
      onSave(newProject);
    }
    setIsModalOpen(false);
  };

  if (!t) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label={t.header.addWork}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-200/50 active:scale-95"
      >
        <Plus size={18} strokeWidth={2.5} />
        <span className="hidden md:inline text-sm">{t.header.addWork}</span>
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