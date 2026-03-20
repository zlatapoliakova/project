import { useState } from "react";
import { X, LayoutTemplate } from "lucide-react";
import AddProjectModal from "./AddProjectModal";

function CreateProjectModal({ onClose, onSave }) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  if (showQuickAdd) {
    return (
      <AddProjectModal 
        onClose={onClose} 
        onSave={onSave}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
          <X size={28} />
        </button>
        <h2 className="text-3xl font-bold text-center mb-10">Add New Work</h2>
        <div className="grid grid-cols-2 gap-8">
          <div
            onClick={() => setShowQuickAdd(true)}
            className="border-2 border-gray-100 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition text-center"
          >
            <LayoutTemplate size={48} className="text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg">Add Project</h3>
            <p className="text-xs text-gray-500 mt-2">Upload image and basic info</p>
          </div>
          <div
            onClick={() => (window.location.href = "/templates")}
            className="border-2 border-gray-100 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition text-center"
          >
            <LayoutTemplate size={48} className="text-gray-400 mb-4" />
            <h3 className="font-bold text-lg">Portfolio Page</h3>
            <p className="text-xs text-gray-500 mt-2">Build a detailed page</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectModal;