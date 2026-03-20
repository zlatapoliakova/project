function TemplateCard({ template, onSelect }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <button
            onClick={() => onSelect(template)}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Select Template
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg">{template.title}</h3>
        <p className="text-gray-500 text-sm mt-1">
          Ready-made portfolio layout
        </p>
      </div>
    </div>
  );
}

export default TemplateCard;