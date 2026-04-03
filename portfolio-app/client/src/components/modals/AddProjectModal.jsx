import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Upload, Link as LinkIcon, Type, AlignLeft, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AddProjectModal({ userId, onClose, onSave }) {
  const { t } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [project, setProject] = useState({
    title: "",
    link: "",
    imagePreview: "", 
    file: null,       
    category: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "File too large (max 5MB)" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProject({ ...project, imagePreview: reader.result, file: file });
      setErrors(prev => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!project.title.trim()) newErrors.title = t.modals.validation.title;
    if (!project.file) newErrors.image = t.modals.validation.image;
    if (project.link && !/^https?:\/\/.+/.test(project.link)) {
      newErrors.link = t.modals.validation.url;
    }
    if (!userId) newErrors.global = t.modals.validation.auth;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validate()) return; 
    setLoading(true);
    const formData = new FormData();
    formData.append("owner", userId); 
    formData.append("title", project.title.trim());
    formData.append("link", project.link.trim());
    formData.append("category", project.category.trim() || t.projectCard.defaultCategory);
    formData.append("description", project.description.trim());
    formData.append("type", "projects"); 
    if (project.file) formData.append("image", project.file); 

    try {
      const response = await fetch("http://localhost:5000/api/projects/add", {
        method: "POST",
        body: formData,
      });
      const savedProject = await response.json();
      if (response.ok) {
        onSave(savedProject); 
        onClose();
      } else {
        setErrors({ global: savedProject.message || t.profile.editForm.error });
      }
    } catch (error) {
      setErrors({ global: t.templates.serverError });
    } finally {
      setLoading(false);
    }
  };

  if (!t) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative max-h-[95vh] overflow-y-auto animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.modals.addNew}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {errors.global && (
          <p className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">{errors.global}</p>
        )}

        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.image}</label>
            <div className={`relative flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer overflow-hidden ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300'}`}>
              {project.imagePreview ? (
                <img src={project.imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-400 transition-colors">
                  <Upload size={32} strokeWidth={1.5} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.modals.cover}</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            {errors.image && <p className="text-red-500 text-[10px] font-bold ml-4 mt-2">{errors.image}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.title}</label>
              <div className="relative group">
                <Type size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.title ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                <input name="title" placeholder={t.modals.titleLabel} value={project.title} onChange={handleChange} className={`w-full bg-gray-50 border border-transparent px-14 py-4 rounded-2xl outline-none text-sm font-medium transition-all ${errors.title ? 'border-red-200 bg-red-50' : 'focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5'}`} />
              </div>
              {errors.title && <p className="text-red-500 text-[10px] font-bold ml-5 mt-1">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.link}</label>
              <div className="relative group">
                <LinkIcon size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.link ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                <input name="link" placeholder={t.modals.linkLabel} value={project.link} onChange={handleChange} className={`w-full bg-gray-50 border border-transparent px-14 py-4 rounded-2xl outline-none text-sm font-medium transition-all ${errors.link ? 'border-red-200 bg-red-50' : 'focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5'}`} />
              </div>
              {errors.link && <p className="text-red-500 text-[10px] font-bold ml-5 mt-1">{errors.link}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.category}</label>
              <div className="relative group">
                <Tag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input name="category" placeholder={t.modals.catLabel} value={project.category} onChange={handleChange} className="w-full bg-gray-50 border border-transparent px-14 py-4 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.description}</label>
              <div className="relative group">
                <AlignLeft size={18} className="absolute left-5 top-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <textarea name="description" placeholder={t.modals.descLabel} value={project.description} onChange={handleChange} rows={4} className="w-full bg-gray-50 border border-transparent px-14 py-4 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none" />
              </div>
            </div>
          </div>

          <button onClick={handleSaveClick} disabled={loading} className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all shadow-lg active:scale-[0.98] ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"}`}>
            {loading ? t.common.publishing : t.modals.publish}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}