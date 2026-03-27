import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function EditProjectModal({ project, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    link: project?.link || "",
    category: project?.category || "",
    file: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result, file: file });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("link", form.link);
      formData.append("category", form.category);
      
      if (form.file) {
        formData.append("image", form.file);
      }

      const response = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
        method: "PUT",
        body: formData, 
      });

      if (response.ok) {
        const updatedProject = await response.json();
        onSave(updatedProject); 
        onClose();
      } else {
        alert("Помилка при оновленні проєкту");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Не вдалося підключитися до сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl"
      >
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full transition">
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center border-2 border-dashed p-4 rounded-lg bg-gray-50">
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                className="w-full h-40 object-cover rounded mb-3 shadow-sm"
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">
                <Upload size={30} />
              </div>
            )}

            <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded cursor-pointer text-sm font-medium transition">
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Project title"
            />

            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Project link"
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Category"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Description"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-3 rounded-xl font-bold transition-all shadow-md`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}