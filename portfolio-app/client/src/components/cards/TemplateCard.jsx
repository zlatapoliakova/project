import { useAuth } from "../../context/AuthContext";

function TemplateCard({ template, onSelect }) {
  const { t } = useAuth();

  if (!t) return null;

  const itemTranslation = t.templates.items[template.id];

  return (
    <div className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
      
      <div className="template-card-container cursor-pointer">
        
        <img
          src={template.image}
          alt={itemTranslation?.title || template.title}
          className="template-card-img"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-transform scale-90 group-hover:scale-100"
          >
            {t.templates.selectBtn}
          </button>
        </div>
      </div>

      <div className="p-5 bg-white z-20">
        <h3 className="font-bold text-lg text-gray-900">
          {itemTranslation?.title || template.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {itemTranslation?.desc || t.templates.defaultDesc}
        </p>
      </div>
    </div>
  );
}

export default TemplateCard;