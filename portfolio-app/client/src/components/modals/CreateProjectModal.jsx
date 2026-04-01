import { useState } from "react";
import { createPortal } from "react-dom";
import { X, LayoutTemplate, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import AddProjectModal from "./AddProjectModal";

function CreateProjectModal({ userId, onClose, onSave }) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const navigate = useNavigate(); 

  if (showQuickAdd) {
    return (
      <AddProjectModal 
        userId={userId}
        onClose={onClose} 
        onSave={onSave}
      />
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-2xl relative animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={28} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add New Work</h2>
          <p className="text-gray-500 mt-2 font-medium">Choose how you want to showcase your talent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => setShowQuickAdd(true)}
            className="group border-2 border-gray-50 rounded-[2rem] p-10 flex flex-col items-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-center"
          >
            <div className="bg-indigo-100 p-5 rounded-2xl text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={40} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-xl text-gray-900">Single Project</h3>
            <p className="text-xs text-gray-500 mt-2">Quickly upload images and link</p>
          </div>

          <div
            onClick={() => {
              onClose(); 
              navigate("/templates");
            }}
            className="group border-2 border-gray-100 rounded-[2rem] p-10 flex flex-col items-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-center"
          >
            <div className="bg-gray-100 p-5 rounded-2xl text-gray-400 mb-6 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all group-hover:scale-110">
              <LayoutTemplate size={40} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-xl text-gray-900">Portfolio Page</h3>
            <p className="text-xs text-gray-500 mt-2">Build a detailed showcase</p>
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
}

export default CreateProjectModal;