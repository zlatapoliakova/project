import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function AddProjectModal({ onClose, onSave }) {
  const [project, setProject] = useState({
    title: "",
    link: "",
    image: "",
    category: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProject({ ...project, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSaveClick = () => {
    if (!project.title.trim()) {
      alert("Please enter a project title");
      return;
    }

    if (onSave && typeof onSave === "function") {
      onSave(project); 
      onClose();
    } else {
      console.error("Critical Error: onSave is missing in AddProjectModal!", { onSave });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Project Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-xl bg-gray-50">
            {project.image ? (
              <img src={project.image} className="w-full h-40 object-cover rounded-lg mb-3 shadow-md" alt="Preview" />
            ) : (
              <div className="w-full h-40 flex flex-col items-center justify-center text-gray-400">
                <Upload size={32} className="mb-2" />
                <p className="text-xs">Image Preview</p>
              </div>
            )}
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors">
              Select Cover
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-3">
            <input name="title" placeholder="Project Title *" value={project.title} onChange={handleChange} className="w-full border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="link" placeholder="Project Link (URL)" value={project.link} onChange={handleChange} className="w-full border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="category" placeholder="Category" value={project.category} onChange={handleChange} className="w-full border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <textarea name="description" placeholder="Description" value={project.description} onChange={handleChange} rows={3} className="w-full border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <button
            onClick={handleSaveClick}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg mt-4 transition-all shadow-lg active:scale-[0.98]"
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
}