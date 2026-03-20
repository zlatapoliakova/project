import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function EditProjectModal({ project, onClose, onSave }) {

  const [form, setForm] = useState({
    title: project.data.title,
    description: project.data.description,
    image: project.data.image,
    link: project.data.link,
    category: project.data.category,
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
      setForm({ ...form, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedProject = {
      ...project,
      data: form,
    };

    onSave(updatedProject);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl"
      >
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">

          <div className="flex flex-col items-center border-2 border-dashed p-4 rounded-lg bg-gray-50">
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">
                <Upload size={30} />
              </div>
            )}

            <label className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer text-sm">
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Project title"
          />

          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Project link"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Category"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Description"
          />

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}