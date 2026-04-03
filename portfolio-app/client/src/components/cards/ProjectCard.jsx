import { Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProjectCard({ project, onDelete, onClick }) {
  const { t } = useAuth();
  const { title, image, category, description, link } = project;
  
  const projectId = project._id || project.id;

  const imageUrl = image
    ? (image.startsWith('http') || image.startsWith('data:')
        ? image
        : `http://localhost:5000${image}`)
    : null;

  if (!t) return null;

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || t.projectCard.previewAlt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 bg-gray-50 transition-colors group-hover:bg-indigo-50">
            <ImageIcon size={40} className="opacity-20 mb-2 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
              {t.projectCard.noPreview}
            </span>
          </div>
        )}

        {onDelete && (
          <button
            type="button"
            title={t.projectCard.deleteProject}
            onClick={(e) => {
              e.stopPropagation();
              if (projectId) onDelete(projectId);
            }}
            className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600 text-gray-400 z-10"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {category || t.projectCard.defaultCategory}
          </span>
        </div>

        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 truncate">
          {title || t.projectCard.untitled}
        </h4>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
            {description}
          </p>
        )}

        {link && (
          <div className="mt-auto pt-4 border-t border-gray-50">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-600 text-xs font-bold inline-flex items-center gap-1.5 hover:text-indigo-700 transition-colors"
            >
              {t.projectCard.viewLive} <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}