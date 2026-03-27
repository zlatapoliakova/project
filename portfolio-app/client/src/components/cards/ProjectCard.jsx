import { Trash2, ExternalLink } from "lucide-react";

export default function ProjectCard({ project, onDelete, onClick }) {
  const { title, image, category, description, link, _id } = project;

  return (
    <div
      onClick={onClick}
      className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id); 
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>

      <div className="p-4">
        <h4 className="font-bold text-gray-800 truncate">
          {title || "Untitled Project"}
        </h4>

        <p className="text-xs text-indigo-600 uppercase mb-2 font-semibold">
          {category || "General"}
        </p>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-600 text-sm font-medium inline-flex items-center gap-1 hover:underline"
          >
            Visit <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}