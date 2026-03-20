import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Save, Edit3, Camera, Trash2, MapPin, Upload, Share2 
} from "lucide-react";

export default function GridTemplate({ initialData, id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const [portfolio, setPortfolio] = useState(() => {
    const allPortfolios = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const existing = allPortfolios.find(item => String(item.id) === String(id));
    if (existing) return existing.data;

    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const savedAvatar = localStorage.getItem("userAvatar") || "";
    
    const globalProjects = allPortfolios
      .filter(item => item.type === "projects")
      .map(item => ({
        id: item.id, title: item.data.title, description: item.data.description,
        image: item.data.image, link: item.data.link, category: item.data.category || "Design"
      }));

    return {
      name: `${savedProfile.name || ""} ${savedProfile.surname || ""}`.trim() || "Your Name",
      profession: savedProfile.profession || "Visual Designer",
      about: savedProfile.about || "Creative professional focused on modern solutions.",
      location: savedProfile.location || "Ukraine",
      avatar: savedAvatar || "",
      experiences: [], education: [], projects: globalProjects,
    };
  });

  const [isEditing, setIsEditing] = useState(readOnly ? false : (id ? false : true));
  const [newExp, setNewExp] = useState({ title: "", year: "", desc: "" });
  const [newEdu, setNewEdu] = useState({ school: "", year: "", degree: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", image: "", category: "" });

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    const currentId = id || Date.now();
    
    const portfolioEntry = {
      id: currentId,
      type: "portfolio",
      template: "grid",
      data: portfolio,
      projects: portfolio.projects || [] 
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
    <div className="min-h-screen bg-white font-sans">
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {id && !isEditing && (
          <button onClick={copyShareLink} className="bg-black text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-all font-bold">
            <Share2 size={18} /> Share
          </button>
        )}
        {!readOnly && (
          <>
            <button onClick={() => navigate("/profile")} className="bg-white shadow-xl p-3 rounded-full border"><ArrowLeft size={20} /></button>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl"><Edit3 size={18} /> Edit</button>
            ) : (
              <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl hover:bg-green-700 transition"><Save size={18} /> Save</button>
            )}
          </>
        )}
      </div>

      <section className="grid md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center p-12 lg:p-24 bg-gray-50">
          <div className="max-w-xl">
            {isEditing ? (
              <div className="space-y-4">
                <input name="name" value={portfolio.name} onChange={e => setPortfolio({...portfolio, name: e.target.value})} className="text-5xl font-black w-full bg-transparent border-b-2 border-gray-200 outline-none uppercase" placeholder="Full Name" />
                <input name="profession" value={portfolio.profession} onChange={e => setPortfolio({...portfolio, profession: e.target.value})} className="text-2xl font-bold text-indigo-600 w-full bg-transparent border-b outline-none uppercase opacity-70" placeholder="Profession" />
                <textarea name="about" value={portfolio.about} onChange={e => setPortfolio({...portfolio, about: e.target.value})} rows="4" className="w-full text-lg text-gray-400 bg-transparent border p-4 rounded-xl outline-none" placeholder="About you..." />
              </div>
            ) : (
              <>
                <h1 className="text-6xl lg:text-7xl font-black mb-2 uppercase tracking-tighter leading-none">{portfolio.name}</h1>
                <h2 className="text-2xl lg:text-3xl font-bold text-indigo-600 mb-8 uppercase opacity-80">{portfolio.profession}</h2>
                <p className="text-xl text-gray-500 leading-relaxed font-light mb-10">{portfolio.about}</p>
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm tracking-widest"><MapPin size={16} /> {portfolio.location}</div>
              </>
            )}
          </div>
        </div>
        <div className="relative h-[60vh] md:h-auto overflow-hidden bg-gray-200">
          {portfolio.avatar && <img src={portfolio.avatar} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />}
          {isEditing && (
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition">
              <div className="bg-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl"><Camera size={20} /> Change Avatar</div>
              <input type="file" className="hidden" accept="image/*" onChange={e => {
                const reader = new FileReader();
                reader.onloadend = () => setPortfolio({...portfolio, avatar: reader.result});
                reader.readAsDataURL(e.target.files[0]);
              }} />
            </label>
          )}
        </div>
      </section>

      <section className="bg-black text-white py-24 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-lg border-l-4 border-indigo-400 pl-4">Experience</h3>
            <div className="space-y-6">
              {(portfolio.experiences || []).map((exp) => (
                <div key={exp.id} className="group relative border-b border-white/10 pb-4">
                  <h4 className="text-2xl font-bold">{exp.title}</h4>
                  <p className="text-indigo-400 text-sm font-bold mb-2">{exp.year}</p>
                  <p className="text-gray-400 text-sm">{exp.desc}</p>
                  {isEditing && <button onClick={() => setPortfolio({...portfolio, experiences: portfolio.experiences.filter(e => e.id !== exp.id)})} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                <input placeholder="Position" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <input placeholder="Year" value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <button onClick={() => { setPortfolio({...portfolio, experiences: [...portfolio.experiences, {...newExp, id: Date.now()}]}); setNewExp({title:"", year:"", desc:""})}} className="w-full bg-indigo-500 py-2 rounded-lg font-bold">Add Exp</button>
              </div>
            )}
          </div>
          <div className="space-y-8">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-lg border-l-4 border-indigo-400 pl-4">Education</h3>
            <div className="space-y-6">
              {(portfolio.education || []).map((edu) => (
                <div key={edu.id} className="group relative border-b border-white/10 pb-4">
                  <h4 className="text-2xl font-bold">{edu.school}</h4>
                  <p className="text-indigo-400 text-sm font-bold mb-2">{edu.year}</p>
                  <p className="text-gray-400 text-sm">{edu.degree}</p>
                  {isEditing && <button onClick={() => setPortfolio({...portfolio, education: portfolio.education.filter(e => e.id !== edu.id)})} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                <input placeholder="University" value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <input placeholder="Year" value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <button onClick={() => { setPortfolio({...portfolio, education: [...portfolio.education, {...newEdu, id: Date.now()}]}); setNewEdu({school:"", year:"", degree:""})}} className="w-full bg-indigo-500 py-2 rounded-lg font-bold">Add Edu</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-32 px-8">
        <h2 className="text-7xl font-black uppercase mb-16 tracking-tighter text-center md:text-left">Selected Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-20">
          {(portfolio.projects || []).map((p, idx) => (
            <div key={idx} onClick={() => !isEditing && p.link && window.open(p.link.startsWith('http') ? p.link : `https://${p.link}`, "_blank")} className="relative aspect-square group cursor-pointer overflow-hidden border border-gray-100">
              {p.image && <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 group-hover:scale-110" />}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                <p className="text-indigo-400 font-bold text-xs uppercase mb-2">{p.category}</p>
                <h3 className="text-white text-2xl font-bold">{p.title}</h3>
                {isEditing && <button onClick={(e) => {e.stopPropagation(); setPortfolio({...portfolio, projects: portfolio.projects.filter((_, i) => i !== idx)})}} className="mt-4 text-red-500 flex items-center gap-1 text-xs font-bold uppercase"><Trash2 size={14}/> Remove</button>}
              </div>
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Add New Project</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black outline-none" />
                <input placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black outline-none" />
                <input placeholder="Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6">
                {newProject.image ? <img src={newProject.image} className="h-40 rounded-lg object-cover" /> : <Upload size={40} className="text-gray-200" />}
                <label className="mt-4 cursor-pointer bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition">Upload Photo<input type="file" className="hidden" accept="image/*" onChange={e => {
                    const reader = new FileReader();
                    reader.onloadend = () => setNewProject({...newProject, image: reader.result});
                    reader.readAsDataURL(e.target.files[0]);
                  }} /></label>
              </div>
            </div>
            <button onClick={() => { setPortfolio({...portfolio, projects: [...portfolio.projects, {...newProject, id: Date.now()}]}); setNewProject({title:"", description:"", link:"", image:"", category:""})}} className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-black uppercase transition active:scale-[0.98]">Add Project To List</button>
          </div>
        )}
      </section>
      <footer className="py-20 text-center bg-gray-50"><p className="font-bold text-gray-400 uppercase tracking-widest text-xs">© {new Date().getFullYear()} {portfolio.name}</p></footer>
    </div>
  );
}