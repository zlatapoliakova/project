import { useAuth } from "../../context/AuthContext";

function TemplateCard({ template, onSelect }) {
  const { t } = useAuth();

  if (!t) return null;

  const itemTranslation = t.templates.items[template.id];

  return (
    <div className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
      
      <button
        type="button"
        onClick={() => onSelect(template)}
        className="template-card-container cursor-pointer text-left"
      >
        
        <img
          src={template.image}
          alt={itemTranslation?.title || template.title}
          className="template-card-img"
        />

        <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 p-4">
          <span
            className="bg-white text-gray-900 px-5 sm:px-6 py-3 rounded-lg font-bold transition-transform scale-100 sm:scale-90 sm:group-hover:scale-100 text-sm sm:text-base text-center"
          >
            {t.templates.selectBtn}
          </span>
        </div>
      </button>

      <div className="p-4 sm:p-5 bg-white z-20">
        <h3 className="font-bold text-lg text-gray-900 break-words">
          {itemTranslation?.title || template.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 break-words">
          {itemTranslation?.desc || t.templates.defaultDesc}
        </p>
      </div>
    </div>
  );
}

export default TemplateCard;
