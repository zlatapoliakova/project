import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Edit3, Camera, Trash2, MapPin, 
  Upload, Share2, Check, GraduationCap, Briefcase 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function GridTemplate({ initialData, id: propId, readOnly = false }) {
  const navigate = useNavigate();
  const { user, t } = useAuth();
  const { id: urlId } = useParams();
  const id = propId || urlId;

  const userId = user?.id || user?._id || null;
  const isOwner = !!(userId && initialData && (userId === (initialData.owner?._id || initialData.owner)));

  const [portfolio, setPortfolio] = useState({
    name: "Name",
    surname: "Surname",
    profession: "Visual Designer",
    about: "",
    location: "Ukraine",
    avatar: "",
    experiences: [],
    education: [],
    projects: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newExp, setNewExp] = useState({ title: "", year: "" });
  const [newEdu, setNewEdu] = useState({ school: "", year: "", degree: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", image: "", category: "", file: null });

  useEffect(() => {
    if (initialData || user) {
      const sourceData = initialData?.data || {};
      const sourceUser = user || {};

      setPortfolio({
        name: sourceData.name || sourceUser.name || sourceUser.userName?.split(' ')[0] || "Name",
        surname: sourceData.surname || sourceUser.surname || sourceUser.userName?.split(' ')[1] || "Surname",
        profession: sourceData.profession || sourceUser.profession || "Visual Designer",
        about: sourceData.about || sourceData.bio || sourceUser.about || sourceUser.bio || "",
        location: sourceData.location || sourceUser.location || "Ukraine",
        avatar: sourceData.avatar || sourceUser.avatar || "",
        experiences: Array.isArray(sourceData.experiences) && sourceData.experiences.length > 0
          ? sourceData.experiences
          : (sourceUser.experiences || []),
        education: Array.isArray(sourceData.education) && sourceData.education.length > 0
          ? sourceData.education
          : (sourceUser.education || []),
        projects: initialData?.projects || [],
      });
    }
  }, [initialData, user]);

  const handleShare = () => {
    const viewUrl = `${window.location.origin}/view-portfolio/${id}`;
    navigator.clipboard.writeText(viewUrl);
    alert(t.gridTemplate.shareSuccess);
  };

  const handleAddProjectToDB = async () => {
    if (!newProject.title.trim()) return alert(t.gridTemplate.titleError);
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
        alert(t.gridTemplate.addSuccess);
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
      if (response.ok) { 
        setIsEditing(false); 
        alert(t.gridTemplate.saveSuccess); 
      }
    } catch (error) { console.error("Save error:", error); } finally { setLoading(false); }
  };

  const getFullImg = (path) => {
    if (!path) return "";
    return path.startsWith('http') || path.startsWith('data:') ? path : `http://localhost:5000${path}`;
  };

  if (!t) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      {isOwner && !readOnly && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 flex flex-wrap justify-end gap-2 sm:gap-3 print:hidden">
          <button onClick={() => navigate(`/profile/${userId}`)} className="bg-white shadow-xl p-3 rounded-full border hover:bg-gray-50 transition"><ArrowLeft size={20} /></button>
          <button onClick={handleShare} className="bg-white shadow-xl p-3 rounded-full border hover:bg-gray-50 transition text-indigo-600"><Share2 size={20} /></button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-black text-white px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 shadow-xl font-bold hover:scale-105 transition text-sm sm:text-base"><Edit3 size={18} /> {t.gridTemplate.edit}</button>
          ) : (
            <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 shadow-xl hover:bg-green-700 font-bold transition text-sm sm:text-base"><Check size={18} /> {t.gridTemplate.saveChanges}</button>
          )}
        </div>
      )}

      <section className="grid md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-24 bg-gray-50">
          <div className="max-w-xl">
            {isEditing ? (
              <div className="space-y-6 text-left text-black">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.labels.fName}</label>
                    <input value={portfolio.name} onChange={e => setPortfolio({...portfolio, name: e.target.value})} className="text-2xl font-black w-full border-b outline-none uppercase" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.labels.lName}</label>
                    <input value={portfolio.surname} onChange={e => setPortfolio({...portfolio, surname: e.target.value})} className="text-2xl font-black w-full border-b outline-none uppercase" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.labels.prof}</label>
                  <input value={portfolio.profession} onChange={e => setPortfolio({...portfolio, profession: e.target.value})} className="text-xl font-bold text-indigo-600 w-full border-b outline-none uppercase" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.labels.about}</label>
                  <textarea value={portfolio.about} onChange={e => setPortfolio({...portfolio, about: e.target.value})} rows="4" className="w-full text-lg text-gray-500 bg-white border p-4 rounded-xl outline-none" placeholder={t.gridTemplate.aboutPlaceholder} />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-2 uppercase tracking-tighter text-black break-words">{portfolio.name} {portfolio.surname}</h1>
                <h2 className="text-xl lg:text-3xl font-bold text-indigo-600 mb-6 sm:mb-8 uppercase opacity-80 break-words">{portfolio.profession}</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed font-light mb-8 sm:mb-10 break-words">{portfolio.about}</p>
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm tracking-widest"><MapPin size={16} /> {portfolio.location}</div>
              </>
            )}
          </div>
        </div>
        <div className="relative h-[60vh] md:h-auto overflow-hidden bg-gray-200">
           {portfolio.avatar ? <img src={getFullImg(portfolio.avatar)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Avatar" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><Upload size={48} /></div>}
           {isEditing && (
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-100 sm:opacity-0 sm:hover:opacity-100 transition">
              <div className="bg-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl"><Camera size={20} /> {t.gridTemplate.changeAvatar}</div>
              <input type="file" className="hidden" accept="image/*" onChange={e => {
                const reader = new FileReader();
                reader.onloadend = () => setPortfolio({...portfolio, avatar: reader.result});
                reader.readAsDataURL(e.target.files[0]);
              }} />
            </label>
          )}
        </div>
      </section>

      <section className="bg-black text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-14 lg:gap-20">
          <div className="space-y-8">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-lg border-l-4 border-indigo-400 pl-4 flex items-center gap-2"><Briefcase size={20}/> {t.gridTemplate.experience}</h3>
            <div className="space-y-6">
              {portfolio.experiences.map((exp, idx) => (
                <div key={idx} className="group relative border-b border-white/10 pb-4">
                  <h4 className="text-2xl font-bold">{exp.title || exp.position}</h4>
                  <p className="text-indigo-400 text-sm font-bold mb-2">{exp.year || exp.years}</p>
                  {isEditing && <button onClick={() => setPortfolio({...portfolio, experiences: portfolio.experiences.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
                <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                  <input placeholder={t.gridTemplate.labels.pos} value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                  <input placeholder={t.gridTemplate.labels.year || "Year"} value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <button onClick={() => { if(!newExp.title) return; setPortfolio({...portfolio, experiences: [...portfolio.experiences, newExp]}); setNewExp({title:"", year:""})}} className="w-full bg-indigo-500 py-2 rounded-lg font-bold">{t.gridTemplate.addExp}</button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-lg border-l-4 border-indigo-400 pl-4 flex items-center gap-2"><GraduationCap size={22}/> {t.gridTemplate.education}</h3>
            <div className="space-y-6">
              {portfolio.education.map((edu, idx) => (
                <div key={idx} className="group relative border-b border-white/10 pb-4">
                  <h4 className="text-2xl font-bold">{edu.school || edu.institution}</h4>
                  <p className="text-indigo-400 text-sm font-bold mb-1">{edu.year}</p>
                  <p className="text-gray-400 text-sm">{edu.degree}</p>
                  {isEditing && <button onClick={() => setPortfolio({...portfolio, education: portfolio.education.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                <input placeholder={t.gridTemplate.labels.uni} value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <input placeholder={t.gridTemplate.labels.year || "Year"} value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <input placeholder={t.gridTemplate.labels.degree || "Degree"} value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} className="w-full bg-transparent border-b border-white/20 p-2 outline-none" />
                <button onClick={() => { if(!newEdu.school) return; setPortfolio({...portfolio, education: [...portfolio.education, newEdu]}); setNewEdu({school:"", year:"", degree:""})}} className="w-full bg-indigo-500 py-2 rounded-lg font-bold">{t.gridTemplate.addEdu}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase mb-10 sm:mb-16 tracking-tighter text-black text-center">{t.gridTemplate.selectedWorks}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {portfolio.projects.map((p, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (!isEditing && p.link) {
                  const url = p.link.startsWith("http") ? p.link : `https://${p.link}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
              className={`relative aspect-square group overflow-hidden border border-gray-100 ${!isEditing && p.link ? "cursor-pointer" : ""}`}
            >
              {p.image && <img src={getFullImg(p.image)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 group-hover:scale-110" alt={p.title} />}
              <div className="absolute inset-0 bg-black/80 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                <p className="text-indigo-400 font-bold text-xs uppercase mb-2">{p.category}</p>
                <h3 className="text-white text-2xl font-bold">{p.title}</h3>
                {isEditing && <button onClick={(e) => { e.stopPropagation(); setPortfolio({...portfolio, projects: portfolio.projects.filter((_, i) => i !== idx)})}} className="mt-4 text-red-500 flex items-center gap-1 text-xs font-bold uppercase"><Trash2 size={14}/> {t.gridTemplate.remove}</button>}
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
            <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-12 sm:mt-20 text-black">
            <h3 className="text-xl sm:text-2xl font-black mb-8 text-center uppercase tracking-tighter">{t.gridTemplate.addNewProject}</h3>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-10 text-left">
              <div className="space-y-5">
                <div className="flex flex-col gap-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.projectTitle}</label>
                   <input value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-4 rounded-xl border outline-none bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.projectCategory}</label>
                   <input value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full p-4 rounded-xl border outline-none bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.projectLink}</label>
                   <input value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full p-4 rounded-xl border outline-none bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.gridTemplate.projectDesc}</label>
                   <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-4 rounded-xl border h-24 outline-none resize-none bg-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1">{t.gridTemplate.uploadCover}</label>
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-100 p-6 min-h-[220px] sm:min-h-[250px]">
                  {newProject.image ? <img src={newProject.image} className="h-32 sm:h-40 w-full object-cover rounded-xl" /> : <Upload size={40} className="text-gray-200 mb-2" />}
                  <label className="cursor-pointer bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-gray-800 transition mt-2">
                    {t.gridTemplate.uploadCover}
                    <input type="file" className="hidden" accept="image/*" onChange={e => {
                      const file = e.target.files[0];
                      if (file) setNewProject({...newProject, file, image: URL.createObjectURL(file)});
                    }} />
                  </label>
                </div>
              </div>
            </div>
            <button onClick={handleAddProjectToDB} disabled={loading} className="mt-10 w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition disabled:bg-gray-400">
              {loading ? t.gridTemplate.creating : t.gridTemplate.saveProjectBtn}
            </button>
          </div>
        )}
      </section>

      <footer className="py-20 text-center bg-gray-50 border-t border-gray-100">
        <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} {portfolio.name} {portfolio.surname}. {t.minimalTemplate.allRightsReserved}</p>
      </footer>
    </div>
  );
}
