import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, ArrowLeft, Trash2, ExternalLink, Edit3, Check, Camera, Share2 } from "lucide-react";

export default function DarkTemplate({ id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const [resume, setResume] = useState(() => {
    const allPortfolios = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const existing = allPortfolios.find(item => String(item.id) === String(id));
    if (existing) return existing.data;

    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const savedAvatar = localStorage.getItem("userAvatar") || "";
    const globalProjects = allPortfolios
      .filter(item => item.type === "projects")
      .map(item => ({
        id: item.id, title: item.data.title, description: item.data.description,
        image: item.data.image, link: item.data.link, category: item.data.category || "Development"
      }));

    return {
      name: `${savedProfile.name || ""} ${savedProfile.surname || ""}`.trim() || "Your Name",
      profession: savedProfile.profession || "Creative Expert",
      bio: savedProfile.about || "Focusing on high-end digital solutions and dark aesthetics.",
      avatar: savedAvatar || "", projects: globalProjects, experiences: [], education: "",
    };
  });

  const [isEditing, setIsEditing] = useState(readOnly ? false : (id ? false : true));
  const [newProject, setNewProject] = useState({ title: "", link: "", image: "", category: "" });
  const [newExp, setNewExp] = useState({ position: "", years: "", description: "" });

  const saveResume = () => {
    const saved = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const currentId = id || Date.now();
    
    const portfolioEntry = {
      id: currentId,
      type: "portfolio",
      template: "dark",
      data: resume,
      projects: resume.projects || [] 
    };

    const updated = saved.some(p => String(p.id) === String(currentId))
      ? saved.map(p => String(p.id) === String(currentId) ? portfolioEntry : p)
      : [...saved, portfolioEntry];
    
    localStorage.setItem("myPortfolios", JSON.stringify(updated));
    setIsEditing(false);
    if (!id) navigate(`/portfolio-editor/${currentId}`);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/view-portfolio/${id}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500">
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {id && !isEditing && (
          <button onClick={copyShareLink} className="bg-indigo-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-xl font-bold hover:bg-indigo-700 transition-all">
            <Share2 size={18} /> Share
          </button>
        )}
        {!readOnly && (
          <>
            <button onClick={() => navigate("/profile")} className="bg-gray-800 p-3 rounded-full border border-gray-700"><ArrowLeft size={20} /></button>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 font-bold"><Edit3 size={18} /> Edit</button>
            ) : (
              <button onClick={saveResume} className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"><Check size={18} /> Save</button>
            )}
          </>
        )}
      </div>

      <header className="max-w-5xl mx-auto pt-24 pb-16 px-8 text-center">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="w-full h-full rounded-full border-4 border-indigo-500/30 overflow-hidden bg-gray-800 flex items-center justify-center">
            {resume.avatar ? <img src={resume.avatar} alt="User" className="w-full h-full object-cover" /> : <Camera size={48} className="text-gray-600" />}
          </div>
          {isEditing && <label className="absolute bottom-1 right-1 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-500 transition shadow-lg"><Upload size={18} /><input type="file" accept="image/*" className="hidden" onChange={e => {
            const reader = new FileReader();
            reader.onloadend = () => setResume({...resume, avatar: reader.result});
            reader.readAsDataURL(e.target.files[0]);
          }} /></label>}
        </div>

        {isEditing ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            <input value={resume.name} onChange={e => setResume({...resume, name: e.target.value})} className="text-4xl font-black text-center w-full bg-transparent border-b border-gray-800 focus:border-indigo-500 outline-none pb-2" />
            <input value={resume.profession} onChange={e => setResume({...resume, profession: e.target.value})} className="text-xl text-indigo-400 text-center w-full bg-transparent outline-none" />
            <textarea value={resume.bio} onChange={e => setResume({...resume, bio: e.target.value})} className="text-gray-400 text-center w-full bg-transparent outline-none italic resize-none" rows="3" />
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-black mb-2 tracking-tight uppercase">{resume.name}</h1>
            <p className="text-xl text-indigo-400 font-bold mb-6 tracking-widest uppercase">{resume.profession}</p>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed italic">"{resume.bio}"</p>
          </>
        )}
      </header>

      <section className="max-w-7xl mx-auto py-20 px-8">
        <h2 className="text-3xl font-black mb-12 flex items-center gap-4">Projects <span className="h-px flex-1 bg-gray-800"></span></h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {resume.projects.map((p) => (
            <div key={p.id} className="group relative bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-indigo-500 transition-all duration-500">
              {isEditing && <button onClick={() => setResume({...resume, projects: resume.projects.filter(proj => proj.id !== p.id)})} className="absolute top-3 right-3 z-20 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>}
              <div className="h-56 bg-gray-800 cursor-pointer overflow-hidden" onClick={() => !isEditing && p.link && window.open(p.link, '_blank')}>
                {p.image ? <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center text-gray-600">No Preview</div>}
              </div>
              <div className="p-6">
                <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[3px]">{p.category}</span>
                <h3 className="text-xl font-bold mt-1">{p.title}</h3>
                {!isEditing && <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm font-bold group-hover:text-indigo-400 transition">View Case <ExternalLink size={14}/></div>}
              </div>
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="p-8 bg-gray-900 rounded-3xl border-2 border-dashed border-gray-800">
            <h3 className="text-xl font-bold mb-6">Add Portfolio Project</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none focus:border-indigo-500" />
                <input placeholder="Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none focus:border-indigo-500" />
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-950 border border-gray-800 rounded-2xl p-4">
                {newProject.image ? <img src={newProject.image} className="h-32 rounded-lg" /> : <Upload size={32} className="text-gray-700" />}
                <label className="mt-4 cursor-pointer text-indigo-400 font-bold text-xs">Upload Photo<input type="file" className="hidden" onChange={e => {
                    const reader = new FileReader();
                    reader.onloadend = () => setNewProject({...newProject, image: reader.result});
                    reader.readAsDataURL(e.target.files[0]);
                  }} /></label>
              </div>
            </div>
            <button onClick={() => { setResume({...resume, projects: [...resume.projects, {...newProject, id: Date.now()}]}); setNewProject({title:"", link:"", image:"", category:""})}} className="mt-6 w-full bg-indigo-600 py-4 rounded-xl font-black">Add Project</button>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto py-20 px-8 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3 underline decoration-indigo-500 decoration-4 underline-offset-8">Experience</h3>
          <div className="space-y-6">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="relative group p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                {isEditing && <button onClick={() => setResume({...resume, experiences: resume.experiences.filter(e => e.id !== exp.id)})} className="absolute top-4 right-4 text-red-500 transition"><Trash2 size={18} /></button>}
                <h4 className="text-xl font-bold">{exp.position}</h4>
                <span className="text-indigo-500 text-sm font-bold">{exp.years}</span>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
              <input placeholder="Position" value={newExp.position} onChange={e => setNewExp({...newExp, position: e.target.value})} className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none" />
              <input placeholder="Years" value={newExp.years} onChange={e => setNewExp({...newExp, years: e.target.value})} className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none" />
              <button onClick={() => { setResume({...resume, experiences: [...resume.experiences, {...newExp, id: Date.now()}]}); setNewExp({position:"", years:"", description:""})}} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold">Add Exp</button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3 underline decoration-indigo-500 decoration-4 underline-offset-8">Education</h3>
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 h-full">
            {isEditing ? <textarea value={resume.education} onChange={(e) => setResume({ ...resume, education: e.target.value })} className="w-full h-40 bg-transparent border border-gray-800 p-4 rounded-xl outline-none focus:border-indigo-500 transition" /> : <p className="text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">{resume.education || "No education info."}</p>}
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-gray-900">
        <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} {resume.name}</p>
      </footer>
    </div>
  );
}