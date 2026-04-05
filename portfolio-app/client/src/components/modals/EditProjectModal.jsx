import { useState } from "react";
import { X, Upload, Link as LinkIcon, Type, AlignLeft, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function EditProjectModal({ project, onClose, onSave }) {
  const { t } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getFullImg = (path) => {
    if (!path) return "";
    return (path.startsWith('http') || path.startsWith('data:')) 
      ? path 
      : `http://localhost:5000${path}`;
  };
  
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    imagePreview: getFullImg(project?.image),
    link: project?.link || "",
    category: project?.category || "",
    file: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Max 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, imagePreview: reader.result, file: file });
      setErrors(prev => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = t.modals.validation.title;
    if (form.link && !/^https?:\/\/.+/.test(form.link)) {
      newErrors.link = t.modals.validation.url;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    const projectId = project._id || project.id;
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("link", form.link.trim());
      formData.append("category", form.category.trim() || t.projectCard.defaultCategory);
      if (form.file) formData.append("image", form.file);

      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "PUT",
        body: formData, 
      });
      const updatedData = await response.json();
      if (response.ok) {
        onSave(updatedData); 
        onClose();
      } else {
        setErrors({ global: updatedData.message || t.profile.editForm.error });
      }
    } catch (error) {
      setErrors({ global: t.templates.serverError });
    } finally {
      setLoading(false);
    }
  };

  if (!t) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[2rem] sm:rounded-3xl p-5 sm:p-8 w-full max-w-lg shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{t.modals.editProject}</h2>
            <p className="text-gray-500 text-sm">{t.modals.updateDetails}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {errors.global && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{errors.global}</div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.image}</label>
            <div className={`group relative flex flex-col items-center p-2 border-2 border-dashed rounded-3xl transition-all ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-indigo-300'}`}>
              {form.imagePreview ? (
                <div className="relative w-full h-36 sm:h-44">
                  <img src={form.imagePreview} className="w-full h-full object-cover rounded-2xl shadow-sm" alt="preview" />
                  <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold">{t.modals.replaceImg}</p>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-gray-400">
                  <Upload size={32} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">{t.modals.noCover}</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            {errors.image && <p className="text-red-500 text-[10px] font-bold ml-2 mt-1">{errors.image}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.title}</label>
              <div className="relative">
                <Type size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.title ? 'text-red-400' : 'text-gray-400'}`} />
                <input name="title" value={form.title} onChange={handleChange} className={`w-full border px-11 py-3.5 rounded-2xl outline-none text-sm font-medium transition-all ${errors.title ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'}`} placeholder={t.modals.projectTitlePlaceholder} />
              </div>
              {errors.title && <p className="text-red-500 text-[10px] font-bold ml-4 mt-1">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.link}</label>
              <div className="relative">
                <LinkIcon size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.link ? 'text-red-400' : 'text-gray-400'}`} />
                <input name="link" value={form.link} onChange={handleChange} className={`w-full border px-11 py-3.5 rounded-2xl outline-none text-sm font-medium transition-all ${errors.link ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'}`} placeholder={t.modals.projectLinkPlaceholder} />
              </div>
              {errors.link && <p className="text-red-500 text-[10px] font-bold ml-4 mt-1">{errors.link}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.category}</label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-100 bg-gray-50 px-11 py-3.5 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder={t.modals.catLabel} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.modals.labels.description}</label>
              <div className="relative">
                <AlignLeft size={16} className="absolute left-4 top-4 text-gray-400" />
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-100 bg-gray-50 px-11 py-3.5 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" placeholder={t.modals.briefDesc} />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"}`}>
            {loading ? t.common.updating : t.common.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
}
