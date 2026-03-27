import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Upload, ArrowLeft, Trash2, ExternalLink, 
  Edit3, Check, Camera, Share2, GraduationCap, Briefcase 
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function MinimalTemplate({ initialData, id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const userId = user?.id || user?._id;
  const isOwner = userId === (initialData?.owner?._id || initialData?.owner);

  const [resume, setResume] = useState({
    name: "Name",
    surname: "Surname",
    profession: "Your Profession",
    bio: "Creative designer and developer.",
    avatar: "",
    projects: [],
    experiences: [],
    education: [],
  });

  const [isEditing, setIsEditing] = useState(readOnly ? false : (id ? false : true));
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", image: "", category: "", file: null });
  const [newExp, setNewExp] = useState({ title: "", year: "", desc: "" });
  const [newEdu, setNewEdu] = useState({ school: "", year: "", degree: "" });
  const [loading, setLoading] = useState(false);

  const getFullImg = (path) => {
    if (!path) return "";
    return path.startsWith('http') || path.startsWith('data:') ? path : `http://localhost:5000${path}`;
  };

  useEffect(() => {
    if (initialData) {
      setResume({
        name: initialData.data?.name || user?.name || "Name",
        surname: initialData.data?.surname || user?.surname || "Surname",
        profession: initialData.data?.profession || user?.profession || "",
        bio: initialData.data?.bio || user?.bio || "",
        avatar: initialData.data?.avatar || user?.avatar || "",
        projects: initialData.projects || [],
        experiences: initialData.data?.experiences || user?.experiences || [],
        education: initialData.data?.education || user?.education || [],
      });
    }
  }, [initialData, user]);

  const handleShare = () => {
    const viewUrl = `${window.location.origin}/view-portfolio/${id}`;
    navigator.clipboard.writeText(viewUrl);
    alert("Публічне посилання копійовано!");
  };

  const handleAddProjectToDB = async () => {
    if (!newProject.title.trim()) return alert("Enter project title");
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
      const resProject = await fetch("http://localhost:5000/api/projects/add", {
        method: "POST",
        body: formData,
      });

      if (resProject.ok) {
        const savedProject = await resProject.json();
        setResume(prev => ({ ...prev, projects: [...prev.projects, savedProject] }));
        setNewProject({ title: "", description: "", link: "", image: "", category: "", file: null });
        alert("Проєкт додано!");
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
        alert("Зміни збережено!");
      }
    } catch (error) { console.error("Save error:", error); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans selection:bg-indigo-100">
      
      {isOwner && !readOnly && (
        <div className="fixed top-6 right-6 z-50 flex gap-3 print:hidden">
          <button onClick={() => navigate(`/profile/${userId}`)} className="bg-white shadow-xl p-3 rounded-full border hover:bg-gray-50 transition"><ArrowLeft size={20} /></button>
          <button onClick={handleShare} className="bg-white shadow-xl p-3 rounded-full border hover:bg-gray-50 transition text-indigo-600"><Share2 size={20} /></button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl font-bold hover:scale-105 transition"><Edit3 size={18} /> Edit</button>
          ) : (
            <button onClick={saveResume} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl hover:bg-green-700 font-bold transition"><Check size={18} /> Save Changes</button>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white p-10 mt-10 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="flex flex-col items-center mb-12">
          <label className={`w-32 h-32 mb-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative group ${isEditing ? 'cursor-pointer' : ''}`}>
            {resume.avatar ? <img src={getFullImg(resume.avatar)} className="w-full h-full object-cover" alt="Avatar" /> : <Upload className="text-gray-400" />}
            {isEditing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition opacity-0 group-hover:opacity-100"><Camera size={24} className="text-white" /></div>}
            <input type="file" className="hidden" disabled={!isEditing} onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setResume({...resume, avatar: reader.result});
              reader.readAsDataURL(file);
            }} />
          </label>

          <div className="w-full max-w-2xl text-center space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                    <input value={resume.name} onChange={e => setResume({...resume, name: e.target.value})} className="w-full font-black text-2xl border-b p-2 focus:border-indigo-500 outline-none" placeholder="Name" />
                  </div>
                  <div className="text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                    <input value={resume.surname} onChange={e => setResume({...resume, surname: e.target.value})} className="w-full font-black text-2xl border-b p-2 focus:border-indigo-500 outline-none" placeholder="Surname" />
                  </div>
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Profession</label>
                  <input value={resume.profession} onChange={e => setResume({...resume, profession: e.target.value})} className="w-full text-indigo-600 font-bold text-xl border-b p-2 outline-none" placeholder="Profession" />
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Bio Summary</label>
                  <textarea value={resume.bio} onChange={e => setResume({...resume, bio: e.target.value})} className="w-full text-gray-500 border rounded-xl p-4 outline-none italic resize-none" rows="3" placeholder="Short bio..." />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="font-black text-5xl mb-2">{resume.name} {resume.surname}</h1>
                <h2 className="text-indigo-600 font-bold text-xl mb-4 uppercase tracking-widest">{resume.profession}</h2>
                <p className="text-gray-500 max-w-2xl italic mx-auto text-lg leading-relaxed">"{resume.bio}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16 border-t pt-12">
          <section>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-2 uppercase tracking-tighter"><Briefcase className="text-indigo-600"/> Experience</h2>
            <div className="space-y-6">
              {resume.experiences.map((exp, idx) => (
                <div key={idx} className="relative group pl-6 border-l-2 border-indigo-100">
                  <h3 className="font-bold text-lg">{exp.title || exp.position}</h3>
                  <span className="text-indigo-600 text-sm font-bold">{exp.year || exp.years}</span>
                  <p className="text-gray-500 text-sm mt-2">{exp.desc || exp.description}</p>
                  {isEditing && <button onClick={() => setResume({...resume, experiences: resume.experiences.filter((_, i) => i !== idx)})} className="absolute top-0 -left-3 bg-white text-red-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"><Trash2 size={14}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-3">
                <input placeholder="Job Position" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full p-2 text-sm rounded-lg border outline-none" />
                <input placeholder="Period (e.g. 2020 - 2022)" value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} className="w-full p-2 text-sm rounded-lg border outline-none" />
                <button onClick={() => { if(!newExp.title) return; setResume({...resume, experiences: [...resume.experiences, newExp]}); setNewExp({title:"", year:"", desc:""})}} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold">+ Add Experience</button>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-2 uppercase tracking-tighter"><GraduationCap className="text-indigo-600"/> Education</h2>
            <div className="space-y-6">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="relative group pl-6 border-l-2 border-indigo-100">
                  <h3 className="font-bold text-lg">{edu.school}</h3>
                  <span className="text-indigo-600 text-sm font-bold">{edu.year}</span>
                  <p className="text-gray-500 text-sm mt-1">{edu.degree}</p>
                  {isEditing && <button onClick={() => setResume({...resume, education: resume.education.filter((_, i) => i !== idx)})} className="absolute top-0 -left-3 bg-white text-red-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"><Trash2 size={14}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-3">
                <input placeholder="University / School" value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} className="w-full p-2 text-sm rounded-lg border outline-none" />
                <input placeholder="Graduation Year" value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} className="w-full p-2 text-sm rounded-lg border outline-none" />
                <button onClick={() => { if(!newEdu.school) return; setResume({...resume, education: [...resume.education, newEdu]}); setNewEdu({school:"", year:"", degree:""})}} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold">+ Add Education</button>
              </div>
            )}
          </section>
        </div>

        <section className="border-t pt-12">
          <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {resume.projects.map((p, idx) => (
              <div key={p._id || idx} onClick={() => !isEditing && p.link && window.open(p.link.startsWith('http') ? p.link : `https://${p.link}`, "_blank")} className={`group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl ${!isEditing && p.link ? 'cursor-pointer' : ''}`}>
                <div className="aspect-video bg-gray-50 relative overflow-hidden">
                  {p.image ? <img src={getFullImg(p.image)} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={p.title} /> : <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>}
                  {!isEditing && p.link && <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><ExternalLink size={32} className="text-white drop-shadow-lg" /></div>}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{p.category}</span>
                    {isEditing && <button onClick={(e) => { e.stopPropagation(); setResume({...resume, projects: resume.projects.filter((_, i) => i !== idx)})}} className="text-red-500 hover:scale-110 transition"><Trash2 size={16}/></button>}
                  </div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="p-8 bg-indigo-50/30 rounded-[32px] border-2 border-dashed border-indigo-100">
              <h3 className="text-indigo-900 font-bold mb-6 text-xl text-center uppercase tracking-widest">New Project</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Project Title *</label>
                    <input value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-indigo-500 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">URL / Link</label>
                    <input value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-indigo-500 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Description</label>
                    <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-3 rounded-xl border h-24 outline-none focus:border-indigo-500 bg-white resize-none" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1">Project Cover</label>
                  <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4 relative">
                    {newProject.image ? <img src={newProject.image} className="h-40 w-full object-cover rounded-xl" alt="Preview" /> : <Upload size={32} className="text-gray-200" />}
                    <label className="mt-4 cursor-pointer bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition">
                      {newProject.image ? "Change Image" : "Select Image"}
                      <input type="file" className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files[0];
                        if (file) setNewProject({...newProject, file, image: URL.createObjectURL(file)});
                      }} />
                    </label>
                  </div>
                </div>
              </div>
              <button onClick={handleAddProjectToDB} disabled={loading} className="mt-8 w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition active:scale-[0.98]">
                {loading ? "Processing..." : "Create Project & Add to Grid"}
              </button>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-20 text-center text-gray-400 py-10 border-t border-gray-100">
        <p className="text-[10px] font-black uppercase tracking-[4px]">© {new Date().getFullYear()} {resume.name} {resume.surname}</p>
      </footer>
    </div>
  );
}

export default MinimalTemplate;