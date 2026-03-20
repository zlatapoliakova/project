import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Upload, ArrowLeft, Trash2, ExternalLink, 
  Edit3, Check, Camera, Share2 
} from "lucide-react";

function MinimalTemplate({ initialData, id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const [resume, setResume] = useState(() => {
    const allPortfolios = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const existing = allPortfolios.find(item => String(item.id) === String(id));
    if (existing) return existing.data;

    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const savedAvatar = localStorage.getItem("userAvatar") || "";
    
    const profileProjects = allPortfolios
      .filter(item => item.type === "projects")
      .map(item => ({
        id: item.id,
        title: item.data.title,
        description: item.data.description,
        image: item.data.image,
        link: item.data.link,
        category: item.data.category || ""
      }));

    return {
      name: `${savedProfile.name || ""} ${savedProfile.surname || ""}`.trim() || "Your Name",
      profession: savedProfile.profession || "Your Profession",
      bio: savedProfile.about || "Creative designer and developer.",
      avatar: savedAvatar || "",
      projects: profileProjects, 
      experiences: [],
    };
  });

  const [isEditing, setIsEditing] = useState(readOnly ? false : (id ? false : true));
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", image: "", category: "" });
  const [newExperience, setNewExperience] = useState({ position: "", years: "", description: "" });

  const saveResume = () => {
    const saved = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const currentId = id || Date.now();
    
    const portfolioObject = {
      id: currentId,
      type: "portfolio",
      template: "minimal",
      data: resume,
      projects: resume.projects
    };

    const updated = saved.some(p => String(p.id) === String(currentId))
      ? saved.map(p => String(p.id) === String(currentId) ? portfolioObject : p)
      : [...saved, portfolioObject];

    localStorage.setItem("myPortfolios", JSON.stringify(updated));
    setIsEditing(false);
    if (!id) navigate(`/portfolio-editor/${currentId}`);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/view-portfolio/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {id && !isEditing && (
          <button onClick={copyShareLink} className="bg-white text-indigo-600 border border-indigo-100 px-5 py-2 rounded-full flex items-center gap-2 shadow-xl hover:bg-indigo-50 transition-all font-bold">
            <Share2 size={18} /> Share
          </button>
        )}
        {!readOnly && (
          <>
            <button onClick={() => navigate("/profile")} className="bg-white shadow-xl p-3 rounded-full border"><ArrowLeft size={20} /></button>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl"><Edit3 size={18} /> Edit</button>
            ) : (
              <button onClick={saveResume} className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl"><Check size={18} /> Save</button>
            )}
          </>
        )}
      </div>

      <div className="max-w-5xl mx-auto bg-white p-10 mt-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-12">
          <label className={`w-32 h-32 mb-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative group ${isEditing ? 'cursor-pointer' : ''}`}>
            {resume.avatar ? <img src={resume.avatar} className="w-full h-full object-cover" /> : <Upload className="text-gray-400" />}
            {isEditing && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"><Camera size={24} className="text-white" /></div>}
            <input type="file" className="hidden" disabled={!isEditing} onChange={e => {
              const reader = new FileReader();
              reader.onloadend = () => setResume({...resume, avatar: reader.result});
              reader.readAsDataURL(e.target.files[0]);
            }} />
          </label>

          {isEditing ? (
            <div className="w-full max-w-lg text-center space-y-2">
              <input value={resume.name} onChange={e => setResume({...resume, name: e.target.value})} className="font-black text-4xl border-b-2 border-transparent text-center w-full focus:border-indigo-500 outline-none" />
              <input value={resume.profession} onChange={e => setResume({...resume, profession: e.target.value})} className="text-indigo-600 font-bold text-xl text-center w-full outline-none" />
              <textarea value={resume.bio} onChange={e => setResume({...resume, bio: e.target.value})} className="text-gray-500 text-center w-full outline-none italic resize-none" rows="3" />
            </div>
          ) : (
            <div className="text-center">
              <h1 className="font-black text-4xl mb-2">{resume.name}</h1>
              <h2 className="text-indigo-600 font-bold text-xl mb-4">{resume.profession}</h2>
              <p className="text-gray-500 max-w-2xl italic leading-relaxed mx-auto">{resume.bio}</p>
            </div>
          )}
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8 border-b-4 border-indigo-100 pb-2 inline-block">Projects</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {resume.projects.map((p) => (
              <div key={p.id} className="relative group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-xl">
                {isEditing && <button onClick={() => setResume({...resume, projects: resume.projects.filter(pr => pr.id !== p.id)})} className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-xl shadow-lg z-20 hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>}
                <div className="h-44 bg-gray-50">{p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-xs">No Cover</div>}</div>
                <div className="p-5">
                  {p.category && <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-1">{p.category}</span>}
                  <h3 className="font-bold truncate text-gray-900">{p.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mt-2">{p.description}</p>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-indigo-600 text-xs font-bold hover:underline transition-all">Visit Project <ExternalLink size={12}/></a>}
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="p-8 bg-indigo-50/40 rounded-3xl border-2 border-dashed border-indigo-100">
              <h3 className="text-indigo-900 font-bold mb-6 text-xl">Add New Project</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input placeholder="Title *" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <input placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full p-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <input placeholder="Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full p-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-3 rounded-xl border-none shadow-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                </div>
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4">
                  {newProject.image ? <img src={newProject.image} className="h-40 w-full object-cover rounded-lg" /> : <Upload size={40} className="text-gray-200 mb-2" />}
                  <label className="mt-4 cursor-pointer text-indigo-600 text-xs font-bold uppercase tracking-wider hover:underline">Upload Cover<input type="file" className="hidden" accept="image/*" onChange={e => {
                      const reader = new FileReader();
                      reader.onloadend = () => setNewProject({...newProject, image: reader.result});
                      reader.readAsDataURL(e.target.files[0]);
                    }} /></label>
                </div>
              </div>
              <button onClick={() => { 
                if(!newProject.title.trim()) return alert("Enter title");
                setResume({...resume, projects: [...resume.projects, {...newProject, id: Date.now()}]}); 
                setNewProject({title:"", description:"", link:"", image:"", category:""})
              }} className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg">Add Project to Portfolio</button>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-black mb-8 border-b-4 border-indigo-100 pb-2 inline-block">Experience</h2>
          <div className="space-y-6 mb-10">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="relative group p-6 bg-gray-50 rounded-2xl border-l-8 border-indigo-600">
                {isEditing && <button onClick={() => setResume({...resume, experiences: resume.experiences.filter(e => e.id !== exp.id)})} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>}
                <h3 className="font-black text-xl text-gray-900">{exp.position}</h3>
                <span className="text-indigo-600 font-bold block mt-1">{exp.years}</span>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="grid md:grid-cols-2 gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <input placeholder="Position" value={newExperience.position} onChange={e => setNewExperience({...newExperience, position: e.target.value})} className="p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Years" value={newExperience.years} onChange={e => setNewExperience({...newExperience, years: e.target.value})} className="p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <textarea placeholder="Description" value={newExperience.description} onChange={e => setNewExperience({...newExperience, description: e.target.value})} className="md:col-span-2 p-3 bg-gray-50 rounded-xl outline-none h-24 resize-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => { 
                if(!newExperience.position.trim()) return;
                setResume({...resume, experiences: [...resume.experiences, {...newExperience, id: Date.now()}]}); 
                setNewExperience({position:"", years:"", description:""})
              }} className="md:col-span-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors">Add Experience</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MinimalTemplate;