import { useState } from "react";
import { createPortal } from "react-dom";
import { X, LayoutTemplate, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import AddProjectModal from "./AddProjectModal";

function CreateProjectModal({ userId, onClose, onSave }) {
  const { t } = useAuth();
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

  if (!t) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-5 sm:p-8 lg:p-10 w-full max-w-2xl relative animate-in zoom-in duration-300 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col items-center text-center mt-6 sm:mt-0 mb-8 sm:mb-10 px-12 sm:px-16">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{t.modals.addNew}</h2>
          <p className="hidden sm:block text-gray-500 mt-2 font-medium">{t.modals.chooseType}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          <div
            onClick={() => setShowQuickAdd(true)}
            className="group border-2 border-gray-50 rounded-[2rem] p-6 sm:p-8 lg:p-10 flex flex-col items-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-center"
          >
            <div className="bg-indigo-100 p-5 rounded-2xl text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={40} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-xl text-gray-900">{t.modals.singleProject}</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.modals.singleDesc}</p>
          </div>

          <div
            onClick={() => {
              onClose(); 
              navigate("/templates");
            }}
            className="group border-2 border-gray-100 rounded-[2rem] p-6 sm:p-8 lg:p-10 flex flex-col items-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-center"
          >
            <div className="bg-gray-100 p-5 rounded-2xl text-gray-400 mb-6 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all group-hover:scale-110">
              <LayoutTemplate size={40} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-xl text-gray-900">{t.modals.portfolioPage}</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.modals.portfolioDesc}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
}

export default CreateProjectModal;
