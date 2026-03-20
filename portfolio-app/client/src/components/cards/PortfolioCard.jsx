import { Briefcase, Trash2, ExternalLink } from "lucide-react";

function PortfolioCard({ portfolio, onClick, onDelete }) {
  const projectsCount = portfolio.projects?.length || portfolio.data?.projects?.length || 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div 
        className="h-48 bg-gray-100 relative cursor-pointer overflow-hidden" 
        onClick={onClick}
      >
        {portfolio.data?.avatar ? (
          <img 
            src={portfolio.data.avatar} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt="Preview" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-indigo-50">
            <Briefcase size={40} className="opacity-20" />
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm">
            {portfolio.template || "Minimal"}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {portfolio.data?.name || "Untitled Portfolio"}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {portfolio.data?.profession || "Designer"}
            </p>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(portfolio.id);
            }} 
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="bg-indigo-50 p-1.5 rounded-lg">
              <Briefcase size={14} />
            </div>
            <span className="text-xs font-bold">
              {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          <button 
            onClick={onClick}
            className="flex items-center gap-1 text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Edit <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioCard;