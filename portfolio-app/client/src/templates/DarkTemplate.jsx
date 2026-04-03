import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Upload, ArrowLeft, Trash2, Edit3, Check, Camera, 
  Share2, Plus, GraduationCap, Briefcase, ExternalLink 
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function DarkTemplate({ initialData, id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { user, t } = useAuth();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const userId = user?.id || user?._id || null;
  const isOwner = !!(userId && initialData && (userId === (initialData.owner?._id || initialData.owner)));

  const [resume, setResume] = useState({
    name: "Name",
    surname: "Surname",
    profession: "Creative Expert",
    bio: "",
    avatar: "",
    projects: [],
    experiences: [],
    education: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newExp, setNewExp] = useState({ title: "", year: "", desc: "" });
  const [newEdu, setNewEdu] = useState({ school: "", year: "", degree: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", image: "", category: "", file: null });

  useEffect(() => {
    if (initialData) {
      setResume({
        name: initialData.data?.name || "Name",
        surname: initialData.data?.surname || "Surname",
        profession: initialData.data?.profession || "",
        bio: initialData.data?.bio || "",
        avatar: initialData.data?.avatar || "",
        projects: initialData.projects || [],
        experiences: initialData.data?.experiences || [],
        education: initialData.data?.education || [],
      });
    }
  }, [initialData]);

  const handleShare = () => {
    const viewUrl = `${window.location.origin}/view-portfolio/${id}`;
    navigator.clipboard.writeText(viewUrl);
    alert(t.darkTemplate.shareSuccess);
  };

  const handleAddProjectToDB = async () => {
    if (!newProject.title.trim()) return alert(t.darkTemplate.titleError);
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
      const res = await fetch("http://localhost:5000/api/projects/add", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const savedProject = await res.json();
        setResume(prev => ({ ...prev, projects: [...prev.projects, savedProject] }));
        setNewProject({ title: "", description: "", link: "", image: "", category: "", file: null });
        alert(t.darkTemplate.addSuccess);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const saveResume = async () => {
    setLoading(true);
    const payload = {
      title: `${resume.name} ${resume.surname}`,
      data: resume,
      projects: resume.projects.map(p => p._id || p.id)
    };

    try {
      const response = await fetch(`http://localhost:5000/api/portfolios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditing(false);
        alert(t.darkTemplate.saveSuccess);
      }
    } catch (error) { console.error("Save error:", error); } finally { setLoading(false); }
  };

  const getFullImg = (path) => {
    if (!path) return "";
    return path.startsWith('http') || path.startsWith('data:') ? path : `http://localhost:5000${path}`;
  };

  if (!t) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500">
      
      {isOwner && !readOnly && (
        <div className="fixed top-6 right-6 z-50 flex gap-3 print:hidden">
          <button onClick={() => navigate(`/profile/${userId}`)} className="bg-gray-800 p-3 rounded-full border border-gray-700 hover:bg-gray-700 transition">
            <ArrowLeft size={20} />
          </button>
          <button onClick={handleShare} className="bg-gray-800 p-3 rounded-full border border-gray-700 text-indigo-400 hover:bg-gray-700 transition">
            <Share2 size={20} />
          </button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 font-bold shadow-xl hover:scale-105 transition">
              <Edit3 size={18} /> {t.darkTemplate.edit}
            </button>
          ) : (
            <button onClick={saveResume} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-indigo-700 shadow-lg transition">
              <Check size={18} /> {loading ? t.darkTemplate.saving : t.darkTemplate.saveChanges}
            </button>
          )}
        </div>
      )}

      <header className="max-w-5xl mx-auto pt-24 pb-16 px-8 text-center">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="w-full h-full rounded-full border-4 border-indigo-500/30 overflow-hidden bg-gray-800 flex items-center justify-center">
            {resume.avatar ? <img src={getFullImg(resume.avatar)} alt="User" className="w-full h-full object-cover" /> : <Camera size={48} className="text-gray-700" />}
          </div>
          {isEditing && (
            <label className="absolute bottom-1 right-1 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-500 transition shadow-lg">
              <Upload size={18} />
              <input type="file" className="hidden" accept="image/*" onChange={e => {
                const reader = new FileReader();
                reader.onloadend = () => setResume({...resume, avatar: reader.result});
                reader.readAsDataURL(e.target.files[0]);
              }} />
            </label>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6 max-w-2xl mx-auto text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 ml-1">{t.darkTemplate.firstName}</label>
                <input value={resume.name} onChange={e => setResume({...resume, name: e.target.value})} className="bg-gray-900 border-b border-gray-800 p-3 outline-none focus:border-indigo-500 text-xl" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 ml-1">{t.darkTemplate.lastName}</label>
                <input value={resume.surname} onChange={e => setResume({...resume, surname: e.target.value})} className="bg-gray-900 border-b border-gray-800 p-3 outline-none focus:border-indigo-500 text-xl" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 ml-1">{t.darkTemplate.profession}</label>
              <input value={resume.profession} onChange={e => setResume({...resume, profession: e.target.value})} className="bg-gray-900 border-b border-gray-800 p-3 outline-none focus:border-indigo-500 text-indigo-400" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 ml-1">{t.darkTemplate.bio}</label>
              <textarea value={resume.bio} onChange={e => setResume({...resume, bio: e.target.value})} className="bg-gray-900 border border-gray-800 rounded-xl p-4 outline-none focus:border-indigo-500 h-24 resize-none italic" />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-black mb-2 tracking-tight uppercase">{resume.name} {resume.surname}</h1>
            <p className="text-xl text-indigo-400 font-bold mb-6 tracking-widest uppercase">{resume.profession}</p>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed italic">"{resume.bio}"</p>
          </>
        )}
      </header>

      <section className="max-w-7xl mx-auto py-20 px-8 grid md:grid-cols-2 gap-16 border-t border-gray-900">
        <div className="space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter"><Briefcase className="text-indigo-500"/> {t.darkTemplate.experience}</h3>
          <div className="space-y-6">
            {resume.experiences.map((exp, idx) => (
              <div key={idx} className="relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 group">
                <h4 className="text-xl font-bold">{exp.title}</h4>
                <p className="text-indigo-400 text-sm mb-3">{exp.year}</p>
                <p className="text-gray-500 text-sm">{exp.desc}</p>
                {isEditing && <button onClick={() => setResume({...resume, experiences: resume.experiences.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18}/></button>}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="p-6 bg-gray-900 rounded-2xl space-y-4 border border-indigo-500/20">
              <input placeholder={t.darkTemplate.placeholders.pos} value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="bg-transparent border-b border-gray-800 p-2 outline-none w-full focus:border-indigo-500" />
              <input placeholder={t.darkTemplate.placeholders.year} value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} className="bg-transparent border-b border-gray-800 p-2 outline-none w-full focus:border-indigo-500" />
              <button onClick={() => { if(!newExp.title) return; setResume({...resume, experiences: [...resume.experiences, newExp]}); setNewExp({title:"", year:"", desc:""})}} className="w-full bg-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
                <Plus size={18}/> {t.darkTemplate.addExperience}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter"><GraduationCap className="text-indigo-500"/> {t.darkTemplate.education}</h3>
          <div className="space-y-6">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 group">
                <h4 className="text-xl font-bold">{edu.school}</h4>
                <p className="text-indigo-400 text-sm mb-1">{edu.year}</p>
                <p className="text-gray-500 text-sm">{edu.degree}</p>
                {isEditing && <button onClick={() => setResume({...resume, education: resume.education.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18}/></button>}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="p-6 bg-gray-900 rounded-2xl space-y-4 border border-indigo-500/20">
              <input placeholder={t.darkTemplate.placeholders.uni} value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} className="bg-transparent border-b border-gray-800 p-2 outline-none w-full focus:border-indigo-500" />
              <input placeholder={t.darkTemplate.placeholders.degree} value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} className="bg-transparent border-b border-gray-800 p-2 outline-none w-full focus:border-indigo-500" />
              <button onClick={() => { if(!newEdu.school) return; setResume({...resume, education: [...resume.education, newEdu]}); setNewEdu({school:"", year:"", degree:""})}} className="w-full bg-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
                <Plus size={18}/> {t.darkTemplate.addEducation}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-8 border-t border-gray-900">
        <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter text-indigo-500">{t.darkTemplate.selectedProjects}</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {resume.projects.map((p, idx) => (
            <div 
              key={p._id || idx} 
              onClick={() => {
                if (!isEditing && p.link) {
                  const url = p.link.startsWith('http') ? p.link : `https://${p.link}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
              className={`group relative bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden hover:border-indigo-500 transition-all duration-500 ${!isEditing && p.link ? 'cursor-pointer' : ''}`}
            >
              {isEditing && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setResume({...resume, projects: resume.projects.filter((_, i) => i !== idx)});
                  }} 
                  className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="h-60 bg-gray-800 relative overflow-hidden">
                {p.image ? (
                  <img src={getFullImg(p.image)} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">{t.darkTemplate.noImage}</div>
                )}
                {!isEditing && p.link && (
                  <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink size={32} className="text-white" />
                  </div>
                )}
              </div>
              <div className="p-8">
                <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[3px] mb-2 block">{p.category}</span>
                <h3 className="text-2xl font-bold">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {isEditing && isOwner && (
          <div className="p-10 bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-800">
            <h3 className="text-2xl font-black mb-10 text-center uppercase tracking-widest text-white">{t.darkTemplate.newProject}</h3>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 block mb-2">{t.darkTemplate.projectTitle}</label>
                  <input placeholder={t.darkTemplate.placeholders.projName} value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-gray-900 border-b border-gray-800 p-4 outline-none w-full focus:border-indigo-500 rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 block mb-2">{t.darkTemplate.projectUrl}</label>
                  <input placeholder="https://..." value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="bg-gray-900 border-b border-gray-800 p-4 outline-none w-full focus:border-indigo-500 rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 block mb-2">{t.darkTemplate.projectDesc}</label>
                  <textarea placeholder={t.darkTemplate.placeholders.desc} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="bg-gray-900 border border-gray-800 p-4 w-full h-24 outline-none focus:border-indigo-500 rounded-xl resize-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-indigo-400 mb-2">{t.darkTemplate.projectCover}</label>
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-3xl border-2 border-dashed border-gray-800 p-8 relative min-h-[300px]">
                  {newProject.image ? (
                    <div className="relative w-full h-full">
                      <img src={newProject.image} className="h-full w-full object-cover rounded-2xl" alt="Preview" />
                      <button onClick={() => setNewProject({...newProject, image: "", file: null})} className="absolute top-4 right-4 bg-red-500 p-2 rounded-full shadow-2xl"><Trash2 size={16}/></button>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="text-gray-800 mb-4" />
                      <p className="text-gray-500 text-sm">{t.darkTemplate.clickUpload}</p>
                    </>
                  )}
                  <label className="mt-6 cursor-pointer bg-white text-black px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95">
                    {newProject.image ? t.darkTemplate.changeImage : t.darkTemplate.uploadImage}
                    <input type="file" className="hidden" accept="image/*" onChange={e => {
                      const file = e.target.files[0];
                      if (file) setNewProject({...newProject, file, image: URL.createObjectURL(file)});
                    }} />
                  </label>
                </div>
              </div>
            </div>
            <button onClick={handleAddProjectToDB} disabled={loading} className="mt-12 w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase tracking-[4px] hover:bg-indigo-700 shadow-2xl transition disabled:bg-gray-800">
              {loading ? t.darkTemplate.processing : t.darkTemplate.createSync}
            </button>
          </div>
        )}
      </section>

      <footer className="py-20 text-center border-t border-gray-900">
        <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">
          © {new Date().getFullYear()} {resume.name} {resume.surname}. {t.darkTemplate.allRightsReserved}
        </p>
      </footer>
    </div>
  );
}