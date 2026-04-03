import { Briefcase, Trash2, ExternalLink, Layout } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function PortfolioCard({ portfolio, onClick, onDelete }) {
  const { t } = useAuth();
  const rawAvatar = portfolio.data?.avatar;
  
  const userAvatar = rawAvatar 
    ? (rawAvatar.startsWith('http') || rawAvatar.startsWith('data:') 
        ? rawAvatar 
        : `http://localhost:5000${rawAvatar}`)
    : null;

  const portfolioId = portfolio._id || portfolio.id;

  if (!t) return null;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div 
        className="h-48 bg-gray-100 relative cursor-pointer overflow-hidden" 
        onClick={onClick}
      >
        {userAvatar ? (
          <img 
            src={userAvatar} 
            alt={portfolio.title || t.portfolioCard.untitled} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
            <Layout size={48} className="opacity-40" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-[2px] z-10">
          {t.portfolioCard.openEditor}
        </div>
        
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm">
            {portfolio.template || "Minimal"}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="max-w-[80%]">
            <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {portfolio.title || t.portfolioCard.untitled}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {t.portfolioCard.templateLabel} <span className="capitalize">{portfolio.template || "Standard"}</span>
            </p>
          </div>
          
          <button 
            type="button"
            title={t.portfolioCard.deleteTitle}
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete && portfolioId) onDelete(portfolioId); 
            }} 
            className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="bg-indigo-50 p-1.5 rounded-lg">
              <Briefcase size={14} />
            </div>
            <span className="text-xs font-bold truncate max-w-[120px]">
              {portfolio.data?.profession || t.portfolioCard.defaultType}
            </span>
          </div>

          <button 
            onClick={onClick}
            className="flex items-center gap-1 text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            {t.portfolioCard.editBtn} <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioCard;