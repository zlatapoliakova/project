import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Edit3, Camera, Trash2, MapPin, 
  Upload, Share2, Check, GraduationCap, Briefcase 
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function GridTemplate({ initialData, id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const userId = user?.id || user?._id || null;
  const isOwner = !!(userId && initialData && (userId === (initialData.owner?._id || initialData.owner)));

  const [portfolio, setPortfolio] = useState({
    name: "Name",
    surname: "Surname",
    profession: "Visual Designer",
    about: "Creative professional focused on modern solutions.",
    location: "Ukraine",
    avatar: "",
    experiences: [],
    education: [],
    projects: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newExp, setNewExp] = useState({ title: "", year: "", desc: "" });
  const [newEdu, setNewEdu] = useState({ school: "", year: "", degree: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", image: "", category: "", file: null });

  useEffect(() => {
    if (initialData || user) {
      setPortfolio({
        name: initialData?.data?.name || user?.name || user?.userName?.split(' ')[0] || "Name",
        surname: initialData?.data?.surname || user?.surname || user?.userName?.split(' ')[1] || "Surname",
        profession: initialData?.data?.profession || user?.profession || "Visual Designer",
        about: initialData?.data?.about || user?.bio || "Creative professional.",
        location: initialData?.data?.location || user?.location || "Ukraine",
        avatar: initialData?.data?.avatar || user?.avatar || "",
        experiences: (initialData?.data?.experiences && initialData.data.experiences.length > 0)
          ? initialData.data.experiences
          : (user?.experiences || []),
        education: (initialData?.data?.education && initialData.data.education.length > 0)
          ? initialData.data.education
          : (user?.education || []),
        projects: initialData?.projects || [],
      });
    }
  }, [initialData, user]);

  const handleShare = () => {
    const viewUrl = `${window.location.origin}/view-portfolio/${id}`;
    navigator.clipboard.writeText(viewUrl);
    alert("Публічне посилання скопійовано!");
  };

  const handleAddProjectToDB = async () => {
    if (!newProject.title.trim()) return alert("Введіть назву проєкту");
    setLoading(true);
    const formData = new FormData();
    formData.append("owner", userId);
    formData.append("title", newProject.title);
    formData.append("description", newProject.description);
    formData.append("category", newProject.category);
    formData.append("link", newProject.link);
    formData.append("type", "projects"); 
    if (newProject.file) formData.append("image", newProject.file);

    try {
      const res = await fetch("http://localhost:5000/api/projects/add", { method: "POST", body: formData });
      if (res.ok) {
        const saved = await res.json();
        setPortfolio(prev => ({ ...prev, projects: [...prev.projects, saved] }));
        setNewProject({ title: "", description: "", link: "", image: "", category: "", file: null });
        alert("Проєкт додано!");
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      title: `${portfolio.name} ${portfolio.surname}`,
      data: portfolio,
      projects: portfolio.projects.map(p => p._id || p.id)
    };
    try {
      const response = await fetch(`http://localhost:5000/api/portfolios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) { setIsEditing(false); alert("Зміни збережено!"); }
    } catch (error) { console.error("Save error:", error); } finally { setLoading(false); }
  };

  const getFullImg = (path) => {
    if (!path) return "";
    return path.startsWith('http') || path.startsWith('data:') ? path : `http://localhost:5000${path}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      {isOwner && !readOnly && (
        <div className="fixed top-6 right-6 z-50 flex gap-3 print:hidden">
          <button onClick={() => navigate(`/profile/${userId}`)} className="bg-white shadow-xl p-3 rounded-full border hover:bg-gray-50 transition"><ArrowLeft size={20} /></button>
          <button onClick={handleShare} className="bg-white shadow-xl p-3 rounded-full border hover:bg-gray-50 transition text-indigo-600"><Share2 size={20} /></button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl font-bold hover:scale-105 transition"><Edit3 size={18} /> Edit</button>
          ) : (
            <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl hover:bg-green-700 font-bold transition"><Check size={18} /> Save Changes</button>
          )}
        </div>
      )}

      <section className="grid md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center p-12 lg:p-24 bg-gray-50">
          <div className="max-w-xl">
            {isEditing ? (
              <div className="space-y-6 text-left text-black">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-black uppercase text-gray-400">First Name</label><input value={portfolio.name} onChange={e => setPortfolio({...portfolio, name: e.target.value})} className="text-2xl font-black w-full border-b outline-none uppercase" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-400">Last Name</label><input value={portfolio.surname} onChange={e => setPortfolio({...portfolio, surname: e.target.value})} className="text-2xl font-black w-full border-b outline-none uppercase" /></div>
                </div>
                <div><label className="text-[10px] font-black uppercase text-gray-400">Profession</label><input value={portfolio.profession} onChange={e => setPortfolio({...portfolio, profession: e.target.value})} className="text-xl font-bold text-indigo-600 w-full border-b outline-none uppercase" /></div>
                <textarea value={portfolio.about} onChange={e => setPortfolio({...portfolio, about: e.target.value})} rows="4" className="w-full text-lg text-gray-500 bg-white border p-4 rounded-xl outline-none" />
              </div>
            ) : (
              <>
                <h1 className="text-6xl lg:text-7xl font-black mb-2 uppercase tracking-tighter text-black">{portfolio.name} {portfolio.surname}</h1>
                <h2 className="text-2xl lg:text-3xl font-bold text-indigo-600 mb-8 uppercase opacity-80">{portfolio.profession}</h2>
                <p className="text-xl text-gray-500 leading-relaxed font-light mb-10">{portfolio.about}</p>
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm tracking-widest"><MapPin size={16} /> {portfolio.location}</div>
              </>
            )}
          </div>
        </div>
        <div className="relative h-[60vh] md:h-auto overflow-hidden bg-gray-200">
           {portfolio.avatar ? <img src={getFullImg(portfolio.avatar)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Avatar" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><Upload size={48} /></div>}
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
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-lg border-l-4 border-indigo-400 pl-4 flex items-center gap-2"><Briefcase size={20}/> Experience</h3>
            <div className="space-y-6">
              {portfolio.experiences.map((exp, idx) => (
                <div key={idx} className="group relative border-b border-white/10 pb-4">
                  <h4 className="text-2xl font-bold">{exp.title || exp.position}</h4>
                  <p className="text-indigo-400 text-sm font-bold mb-2">{exp.year || exp.years}</p>
                  <p className="text-gray-400 text-sm">{exp.desc || exp.description}</p>
                  {isEditing && <button onClick={() => setPortfolio({...portfolio, experiences: portfolio.experiences.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                <input placeholder="Position" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <button onClick={() => { if(!newExp.title) return; setPortfolio({...portfolio, experiences: [...portfolio.experiences, newExp]}); setNewExp({title:"", year:"", desc:""})}} className="w-full bg-indigo-500 py-2 rounded-lg font-bold">Add Experience</button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-lg border-l-4 border-indigo-400 pl-4 flex items-center gap-2"><GraduationCap size={22}/> Education</h3>
            <div className="space-y-6">
              {portfolio.education.map((edu, idx) => (
                <div key={idx} className="group relative border-b border-white/10 pb-4">
                  <h4 className="text-2xl font-bold">{edu.school || edu.institution}</h4>
                  <p className="text-indigo-400 text-sm font-bold mb-1">{edu.year}</p>
                  <p className="text-gray-400 text-sm">{edu.degree}</p>
                  {isEditing && <button onClick={() => setPortfolio({...portfolio, education: portfolio.education.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                <input placeholder="University" value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <button onClick={() => { if(!newEdu.school) return; setPortfolio({...portfolio, education: [...portfolio.education, newEdu]}); setNewEdu({school:"", year:"", degree:""})}} className="w-full bg-indigo-500 py-2 rounded-lg font-bold">Add Education</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-32 px-8">
        <h2 className="text-7xl font-black uppercase mb-16 tracking-tighter text-black text-center">Selected Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-20">
          {portfolio.projects.map((p, idx) => (
            <div key={idx} className="relative aspect-square group cursor-pointer overflow-hidden border border-gray-100">
              {p.image && <img src={getFullImg(p.image)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 group-hover:scale-110" alt={p.title} />}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                <p className="text-indigo-400 font-bold text-xs uppercase mb-2">{p.category}</p>
                <h3 className="text-white text-2xl font-bold">{p.title}</h3>
                {isEditing && <button onClick={(e) => { e.stopPropagation(); setPortfolio({...portfolio, projects: portfolio.projects.filter((_, i) => i !== idx)})}} className="mt-4 text-red-500 flex items-center gap-1 text-xs font-bold uppercase"><Trash2 size={14}/> Remove</button>}
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-20 text-black">
            <h3 className="text-2xl font-black mb-8 text-center uppercase tracking-tighter">Add New Project</h3>
            <div className="grid md:grid-cols-2 gap-10 text-left">
              <div className="space-y-5">
                <input placeholder="Title *" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-4 rounded-xl border outline-none bg-white" />
                <input placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full p-4 rounded-xl border outline-none bg-white" />
                <input placeholder="Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full p-4 rounded-xl border outline-none bg-white" />
                <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-4 rounded-xl border h-24 outline-none resize-none bg-white" />
              </div>
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-100 p-6 min-h-[250px]">
                {newProject.image ? <img src={newProject.image} className="h-40 w-full object-cover rounded-xl" /> : <Upload size={40} className="text-gray-200 mb-2" />}
                <label className="cursor-pointer bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-gray-800 transition mt-2">
                  Upload Cover
                  <input type="file" className="hidden" accept="image/*" onChange={e => {
                    const file = e.target.files[0];
                    if (file) setNewProject({...newProject, file, image: URL.createObjectURL(file)});
                  }} />
                </label>
              </div>
            </div>
            <button onClick={handleAddProjectToDB} disabled={loading} className="mt-10 w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition disabled:bg-gray-400">
              {loading ? "Creating..." : "Save Project & Add to Grid"}
            </button>
          </div>
        )}
      </section>

      <footer className="py-20 text-center bg-gray-50 border-t border-gray-100">
        <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} {portfolio.name} {portfolio.surname}</p>
      </footer>
    </div>
  );
}