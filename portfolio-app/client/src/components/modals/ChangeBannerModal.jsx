import { useState } from "react";

function ChangeBannerModal({ banner, setBanner, blurBanner, setBlurBanner, onClose, onSave }) {
  const [preview, setPreview] = useState(banner);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setBanner(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-xl w-[420px] space-y-6"
      >
        <h3 className="text-xl font-bold">Change Background</h3>

        <div className="h-40 rounded-lg overflow-hidden bg-gray-200">
          {preview ? (
            <img
              src={preview}
              className={`w-full h-full object-cover ${
                blurBanner ? "blur-md scale-110" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image selected
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={blurBanner}
            onChange={(e) => setBlurBanner(e.target.checked)}
          />
          Blur background
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeBannerModal;