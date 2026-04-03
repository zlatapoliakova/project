import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, MapPin, Briefcase, Clock, Globe, 
  Phone, Camera, PlusCircle, Save, X,
  Instagram, Linkedin, Link as LinkIcon,
  GraduationCap 
} from "lucide-react";

import { useAuth } from "../context/AuthContext"; 
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import AddProjectButton from "../components/buttons/AddProjectButton";
import PortfolioCard from "../components/cards/PortfolioCard";
import ProjectCard from "../components/cards/ProjectCard";
import EditProjectModal from "../components/modals/EditProjectModal";
import ProfileBanner from "../components/ProfileBanner";

function Profile() {
  const { id } = useParams(); 
  const { user: currentUser, t } = useAuth(); 
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const isOwner = currentUser?.id === id || currentUser?._id === id;

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [avatar, setAvatar] = useState(null);
  const [newExp, setNewExp] = useState({ title: "", year: "", desc: "" });
  const [newEdu, setNewEdu] = useState({ school: "", year: "", degree: "" });
  const [banner, setBanner] = useState(null);
  const [bannerBlur, setBannerBlur] = useState(0);
  const [portfolios, setPortfolios] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [pendingBanner, setPendingBanner] = useState(null);

  const [profile, setProfile] = useState({
    userName: "",
    name: "",
    surname: "",
    profession: "",
    location: "",
    experience: "",
    phone: "",
    website: "",
    instagram: "",
    linkedin: "",
    behance: "",
    available: true,
    bannerBlur: 0,
    experiences: [],
    education: []
  });

  const tabs = [
    { id: "all", label: t?.profile?.tabs?.all || "All" },
    { id: "portfolio", label: t?.profile?.tabs?.portfolios || "Portfolios" },
    { id: "projects", label: t?.profile?.tabs?.projects || "Projects" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, projectsRes, portfoliosRes] = await Promise.all([
          fetch(`http://localhost:5000/api/auth/${id}`),
          fetch(`http://localhost:5000/api/projects/user/${id}`),
          fetch(`http://localhost:5000/api/portfolios/user/${id}`)
        ]);

        const userData = await userRes.json();
        const projectsData = await projectsRes.json();
        const portfoliosData = await portfoliosRes.json();

        if (userRes.ok) {
          setProfile(userData);
          setBannerBlur(userData.bannerBlur || 0);
          
          const fullAvatar = userData.avatar 
            ? (userData.avatar.startsWith('http') ? userData.avatar : `http://localhost:5000${userData.avatar}`)
            : null;
          setAvatar(fullAvatar);

          const fullBanner = userData.banner 
            ? (userData.banner.startsWith('http') ? userData.banner : `http://localhost:5000${userData.banner}`)
            : null;
          setBanner(fullBanner);
        }

        if (projectsRes.ok && portfoliosRes.ok) {
          const combined = [
            ...portfoliosData.map(p => ({ ...p, type: 'portfolio' })), 
            ...projectsData.map(p => ({ ...p, type: 'projects' }))
          ];
          setPortfolios(combined);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSaveProfile = async () => {
    try {
      let updatedProfile = { ...profile };

      if (pendingBanner) {
        const bannerData = new FormData();
        bannerData.append('banner', pendingBanner);
        const res = await fetch(`http://localhost:5000/api/auth/upload-banner/${id}`, {
          method: 'POST',
          body: bannerData,
        });
        const data = await res.json();
        updatedProfile.banner = data.banner; 
      }

      if (pendingAvatar) {
        const avatarData = new FormData();
        avatarData.append('avatar', pendingAvatar);
        const res = await fetch(`http://localhost:5000/api/auth/upload-avatar/${id}`, {
          method: 'POST',
          body: avatarData,
        });
        const data = await res.json();
        updatedProfile.avatar = data.avatar;
      }

      const response = await fetch(`http://localhost:5000/api/auth/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        setProfile(updatedProfile);
        setIsEditing(false);
        setPendingBanner(null);
        setPendingAvatar(null);
        alert(t?.profile?.editForm?.success || "Profile successfully saved!");
      }
    } catch (error) {
      console.error(error);
      alert(t?.profile?.editForm?.error || "Save failed");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPendingAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPendingBanner(file);
    const previewUrl = URL.createObjectURL(file);
    setBanner(previewUrl);
  };

  const handleBlurChange = (value) => {
    const blurValue = parseFloat(value);
    setBannerBlur(blurValue);
    setProfile(prev => ({ ...prev, bannerBlur: blurValue }));
  };

  const saveBlurToDB = async () => {
    try {
      await fetch(`http://localhost:5000/api/auth/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerBlur: bannerBlur }),
      });
    } catch (error) {
      console.error("Error saving blur:", error);
    }
  };

  const filteredPortfolios = portfolios.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "portfolio") return p.type === "portfolio";
    return p.type === "projects";
  });

  const handleDelete = async (item) => {
    if (!isOwner) return;
    const itemId = item._id || item.id;
    const confirmMsg = `${t?.common?.confirmDelete || "Are you sure you want to delete this"} ${item.type === 'portfolio' ? 'portfolio' : 'project'}?`;
    if (!confirm(confirmMsg)) return;
    
    const endpoint = item.type === "portfolio" 
      ? `http://localhost:5000/api/portfolios/${itemId}`
      : `http://localhost:5000/api/projects/${itemId}`;

    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (response.ok) {
        setPortfolios(prev => prev.filter(p => (p._id || p.id) !== itemId));
      } else {
        alert(t?.profile?.editForm?.error || "Error");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">{t?.common?.loading || "Loading..."}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto p-8">
        <ProfileBanner 
          banner={banner}
          onBlurSave={saveBlurToDB}
          bannerBlur={bannerBlur}
          onBannerChange={handleBannerChange}
          onBlurChange={handleBlurChange}
          name={profile.name || profile.userName}
          readOnly={!isOwner} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-24">
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-36 h-36 bg-gray-100 rounded-full border-8 border-white shadow-xl overflow-hidden flex items-center justify-center">
                    {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="User" /> : <User size={56} className="text-gray-300" />}
                  </div>
                  {isEditing && isOwner && (
                    <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition">
                      <Camera size={18} />
                    </button>
                  )}
                  <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    {profile.name || profile.surname ? `${profile.name} ${profile.surname}` : profile.userName}
                  </h3>
                  {profile.available && (
                    <span className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2.5 animate-pulse"></span> {t?.profile?.available || "Available Now"}
                    </span>
                  )}
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex items-center text-gray-700 gap-4"><Briefcase size={20} className="text-gray-400" /><span>{profile.profession || t?.profile?.profession || "Profession"}</span></div>
                    
                    <div className="flex items-center text-gray-700 gap-4">
                        <Clock size={20} className="text-gray-400" />
                        <span className="text-sm">
                            <span className="font-bold mr-1">{t?.profile?.experience || "Experience"}:</span>
                            {profile.experiences?.length > 0 
                                ? `${profile.experiences[profile.experiences.length - 1].title} (${profile.experiences[profile.experiences.length - 1].year})`
                                : (profile.experience || t?.profile?.noExp || "No experience")}
                        </span>
                    </div>

                    {profile.education?.length > 0 && (
                      <div className="flex items-start text-gray-700 gap-4">
                        <GraduationCap size={20} className="text-gray-400 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm mb-1">{t?.profile?.education || "Education"}:</span>
                          {profile.education.map((edu, idx) => (
                            <span key={idx} className="text-sm font-medium">{edu.school} <span className="text-gray-400 font-normal">({edu.year})</span></span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center text-gray-700 gap-4"><MapPin size={20} className="text-gray-400" /><span>{profile.location || t?.profile?.location || "Location"}</span></div>
                    <div className="flex items-center text-gray-700 gap-4"><Phone size={20} className="text-gray-400" /><span>{profile.phone || t?.profile?.noPhone || "No phone"}</span></div>
                    
                    <div className="pt-4 flex flex-wrap gap-3">
                      {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-indigo-600 transition"><Globe size={20} /></a>}
                      {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-pink-600 transition"><Instagram size={20} /></a>}
                      {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-blue-600 transition"><Linkedin size={20} /></a>}
                      {profile.behance && <a href={profile.behance} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-blue-400 transition"><LinkIcon size={20} /></a>}
                    </div>
                  </div>
                  {isOwner && (
                    <button onClick={() => setIsEditing(true)} className="w-full mt-4 bg-white text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition">
                      {t?.profile?.editBtn || "Edit Profile Info"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t?.profile?.editForm?.fName || "First Name"}</label>
                      <input name="name" 
                            value={profile.name} 
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t?.profile?.editForm?.lName || "Last Name"}</label>
                      <input name="surname" 
                            value={profile.surname || ""} 
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t?.profile?.profession || "Profession"}</label>
                    <input name="profession" value={profile.profession} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t?.profile?.location || "Location"}</label>
                      <input name="location" value={profile.location || ""} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t?.profile?.phone || "Phone"}</label>
                      <input name="phone" value={profile.phone || ""} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h4 className="text-xs font-black uppercase text-indigo-600 flex items-center gap-2"><Briefcase size={14}/> {t?.profile?.experience || "Experience"}</h4>
                    <div className="space-y-2">
                      {profile.experiences?.map((exp, idx) => (
                        <div key={`exp-${idx}`} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-[10px]">
                          <span><b>{exp.title}</b> ({exp.year})</span>
                          <button type="button" onClick={() => setProfile(prev => ({...prev, experiences: prev.experiences.filter((_, i) => i !== idx)}))} className="text-red-500"><X size={14}/></button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <input placeholder={t?.profile?.editForm?.jobTitle || "Job Position"} value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full border-b bg-transparent py-1 text-xs outline-none" />
                      <input placeholder={t?.profile?.editForm?.years || "Years"} value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} className="w-full border-b bg-transparent py-1 text-xs outline-none" />
                      <button type="button" onClick={() => { if(!newExp.title) return; setProfile({...profile, experiences: [...(profile.experiences || []), newExp]}); setNewExp({title:"", year:"", desc:""}) }} className="w-full py-2 bg-white border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold">
                        {t?.profile?.editForm?.addExp || "+ Add Experience"}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h4 className="text-xs font-black uppercase text-indigo-600 flex items-center gap-2"><GraduationCap size={16}/> {t?.profile?.education || "Education"}</h4>
                    <div className="space-y-2">
                      {profile.education?.map((edu, idx) => (
                        <div key={`edu-${idx}`} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-[10px]">
                          <span><b>{edu.school}</b> ({edu.year})</span>
                          <button type="button" onClick={() => setProfile(prev => ({...prev, education: prev.education.filter((_, i) => i !== idx)}))} className="text-red-500"><X size={14}/></button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <input placeholder={t?.profile?.editForm?.uni || "University"} value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} className="w-full border-b bg-transparent py-1 text-xs outline-none" />
                      <input placeholder={t?.profile?.editForm?.year || "Year"} value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} className="w-full border-b bg-transparent py-1 text-xs outline-none" />
                      <button type="button" onClick={() => { if(!newEdu.school) return; setProfile({...profile, education: [...(profile.education || []), newEdu]}); setNewEdu({school:"", year:"", degree:""}) }} className="w-full py-2 bg-white border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold">
                        {t?.profile?.editForm?.addEdu || "+ Add Education"}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{t?.profile?.links || "Social Links"}</label>
                    <input name="website" placeholder="Website URL" value={profile.website} onChange={handleChange} className="w-full border rounded-xl px-4 py-2 text-sm outline-none" />
                    <input name="instagram" placeholder="Instagram URL" value={profile.instagram} onChange={handleChange} className="w-full border rounded-xl px-4 py-2 text-sm outline-none" />
                    <input name="linkedin" placeholder="LinkedIn URL" value={profile.linkedin} onChange={handleChange} className="w-full border rounded-xl px-4 py-2 text-sm outline-none" />
                    <input name="behance" placeholder="Behance URL" value={profile.behance} onChange={handleChange} className="w-full border rounded-xl px-4 py-2 text-sm outline-none" />
                  </div>

                  <div className="flex items-center gap-3 px-1 pt-2">
                    <input 
                      type="checkbox" 
                      name="available" 
                      id="available"
                      checked={profile.available} 
                      onChange={handleChange} 
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="available" className="text-sm font-bold text-gray-700 cursor-pointer">
                      {t?.profile?.availableLabel || "Available for projects"}
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSaveProfile} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg"><Save size={18} /> {t?.common?.save || "Save"}</button>
                    <button onClick={() => setIsEditing(false)} className="px-5 bg-gray-100 text-gray-500 py-3 rounded-xl hover:bg-gray-200 transition"><X size={18} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t?.profile?.workshop || "Portfolio & Projects"}</h3>
              {isOwner && <AddProjectButton userId={id} onSave={(newProj) => setPortfolios(prev => [newProj, ...prev])} />}
            </div>

            <div className="border-b border-gray-100 mb-8 flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm font-bold transition-all relative ${
                    activeTab === tab.id ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPortfolios.length > 0 ? (
                filteredPortfolios.map((p) =>
                  p.type === "projects" ? (
                    <ProjectCard 
                        key={p._id || p.id} 
                        project={p} 
                        onDelete={isOwner ? () => handleDelete(p) : null} 
                        onClick={isOwner ? () => setEditingProject(p) : null} 
                    />
                  ) : (
                    <PortfolioCard 
                        key={p._id || p.id} 
                        portfolio={p} 
                        onClick={() => navigate(`/portfolio-editor/${p._id || p.id}`)} 
                        onDelete={isOwner ? () => handleDelete(p) : null} 
                    />
                  )
                )
              ) : (
                <div className="col-span-full text-center text-gray-400 py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 px-6">
                  <PlusCircle size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="font-bold text-lg">{t?.profile?.emptyGallery || "Empty gallery"}</p>
                  <p className="text-sm">{t?.profile?.noWork || "This designer hasn't added any work yet."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {editingProject && isOwner && (
        <EditProjectModal 
          project={editingProject} 
          onClose={() => setEditingProject(null)} 
          onSave={(updated) => {
            const newList = portfolios.map(p => (p._id === updated._id || p.id === updated.id) ? updated : p);
            setPortfolios(newList);
            setEditingProject(null);
          }} 
        />
      )}
    </div>
  );
}

export default Profile;