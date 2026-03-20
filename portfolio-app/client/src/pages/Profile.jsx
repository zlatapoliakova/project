import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, MapPin, Briefcase, Clock, Globe, 
  Phone, Camera, PlusCircle, Save, X,
  Instagram, Linkedin
} from "lucide-react";

import DashboardHeader from "../components/header/DashboardHeader";
import Footer from "../components/Footer";
import AddProjectButton from "../components/buttons/AddProjectButton";
import PortfolioCard from "../components/cards/PortfolioCard";
import ProjectCard from "../components/cards/ProjectCard";
import EditProjectModal from "../components/modals/EditProjectModal";
import ProfileBanner from "../components/ProfileBanner";

function Profile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerBlur, setBannerBlur] = useState(0);
  const [portfolios, setPortfolios] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  const [profile, setProfile] = useState({
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
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "portfolio", label: "Portfolios" },
    { id: "projects", label: "Projects" },
  ];

  const isProfileEmpty = !profile.name && !profile.surname && !avatar;

  const loadUserData = () => {
    const savedPortfolios = JSON.parse(localStorage.getItem("myPortfolios")) || [];
    setPortfolios(savedPortfolios);

    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) setProfile(savedProfile);

    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) setAvatar(savedAvatar);

    const savedBanner = localStorage.getItem("profileBanner");
    if (savedBanner) setBanner(savedBanner);

    const savedBlur = localStorage.getItem("profileBannerBlur");
    if (savedBlur) setBannerBlur(Number(savedBlur));
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("portfolioUpdated", loadUserData);
    return () => window.removeEventListener("portfolioUpdated", loadUserData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
  };

  const handleSaveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      localStorage.setItem("userAvatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBanner(reader.result);
      localStorage.setItem("profileBanner", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBlurChange = (value) => {
    setBannerBlur(value);
    localStorage.setItem("profileBannerBlur", value);
  };

  const filteredPortfolios = portfolios.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "portfolio") return p.type === "portfolio" || !p.type;
    return p.type === activeTab;
  });

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const updated = portfolios.filter((pf) => pf.id !== id);
    setPortfolios(updated);
    localStorage.setItem("myPortfolios", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        avatar={avatar} 
        userName={`${profile.name} ${profile.surname}`}
        userProfession={profile.profession}
      />
      
      <div className="max-w-7xl mx-auto p-8">
        
        <ProfileBanner 
          banner={banner}
          bannerBlur={bannerBlur}
          onBannerChange={handleBannerChange}
          onBlurChange={handleBlurChange}
          name={profile.name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-24">
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-36 h-36 bg-gray-100 rounded-full border-8 border-white shadow-xl overflow-hidden flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} className="w-full h-full object-cover" alt="User" />
                    ) : (
                      <User size={56} className="text-gray-300" />
                    )}
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => avatarInputRef.current.click()}
                      className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition"
                    >
                      <Camera size={18} />
                    </button>
                  )}
                  <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>

                {!isEditing && (
                  <div className="mt-5 text-center">
                    <h3 className="text-2xl font-extrabold text-gray-900">
                      {profile.name || profile.surname ? `${profile.name} ${profile.surname}` : "Your Name"}
                    </h3>
                    {profile.available && (
                      <span className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2.5 animate-pulse"></span>
                        Available Now
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  {isProfileEmpty ? (
                    <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-5">
                      <p className="text-gray-400 text-sm mb-5 font-medium">No info added yet</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                      >
                        <PlusCircle size={20} /> Add Information
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 border-t border-gray-100 pt-6">
                        <div className="flex items-center text-gray-700 gap-4">
                          <Briefcase size={20} className="text-gray-400" />
                          <span className="font-medium">{profile.profession || "Profession"}</span>
                        </div>
                        <div className="flex items-center text-gray-700 gap-4">
                          <Clock size={20} className="text-gray-400" />
                          <span className="font-medium">{profile.experience ? `${profile.experience} years exp.` : "Experience"}</span>
                        </div>
                        <div className="flex items-center text-gray-700 gap-4">
                          <MapPin size={20} className="text-gray-400" />
                          <span className="font-medium">{profile.location || "Location"}</span>
                        </div>
                        <div className="flex items-center text-gray-700 gap-4">
                          <Phone size={20} className="text-gray-400" />
                          <span className="font-medium">{profile.phone || "No phone"}</span>
                        </div>
                        
                        <div className="pt-4 flex flex-wrap gap-3">
                          {profile.website && (
                            <a href={profile.website} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-indigo-600 transition">
                              <Globe size={20} />
                            </a>
                          )}
                          {profile.instagram && (
                            <a href={profile.instagram} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-pink-600 transition">
                              <Instagram size={20} />
                            </a>
                          )}
                          {profile.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-blue-600 transition">
                              <Linkedin size={20} />
                            </a>
                          )}
                          {profile.behance && (
                            <a href={profile.behance} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg hover:text-indigo-500 transition">
                              <span className="font-bold text-lg leading-none">Bē</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full mt-4 bg-white text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition"
                      >
                        Edit Profile Info
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input name="name" placeholder="First Name" value={profile.name} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                    <input name="surname" placeholder="Last Name" value={profile.surname} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  </div>
                  <input name="profession" placeholder="Profession" value={profile.profession} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  <input name="experience" placeholder="Years of Experience" value={profile.experience} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  <input name="location" placeholder="City, Country" value={profile.location} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  <input name="phone" placeholder="Phone" value={profile.phone} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                  
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase">Social Links</p>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input name="website" placeholder="Website URL" value={profile.website} onChange={handleChange} className="w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                    </div>
                    <div className="relative">
                      <Instagram size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input name="instagram" placeholder="Instagram URL" value={profile.instagram} onChange={handleChange} className="w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                    </div>
                    <div className="relative">
                      <Linkedin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input name="linkedin" placeholder="LinkedIn URL" value={profile.linkedin} onChange={handleChange} className="w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">Bē</span>
                      <input name="behance" placeholder="Behance URL" value={profile.behance} onChange={handleChange} className="w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-3 py-2 cursor-pointer p-2 bg-gray-50 rounded-xl">
                    <input type="checkbox" name="available" checked={profile.available} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
                    <span className="text-sm font-bold text-gray-600">Available for work</span>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSaveProfile} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                      <Save size={18} /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="px-5 bg-gray-100 text-gray-500 py-3 rounded-xl hover:bg-gray-200 transition">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your Work</h3>
              <AddProjectButton />
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
              {filteredPortfolios.map((p) =>
                p.type === "projects" ? (
                  <ProjectCard 
                    key={p.id} 
                    project={p} 
                    onDelete={handleDelete} 
                    onClick={() => setEditingProject(p)} 
                  />
                ) : (
                  <PortfolioCard
                    key={p.id}
                    portfolio={p}
                    onClick={() => {
                      localStorage.setItem("selectedTemplate", JSON.stringify({ id: p.template || "minimal" }));
                      localStorage.setItem("selectedPortfolio", JSON.stringify(p.data));
                      navigate(`/portfolio-editor/${p.id}`);
                    }}
                    onDelete={handleDelete}
                  />
                )
              )}
            </div>

            {filteredPortfolios.length === 0 && (
              <div className="text-center text-gray-400 py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 px-6">
                <PlusCircle size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="font-bold text-lg">Empty gallery</p>
                <p className="text-sm">Start adding your portfolios or single projects.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {editingProject && (
        <EditProjectModal 
          project={editingProject} 
          onClose={() => setEditingProject(null)} 
          onSave={(updated) => {
            const newList = portfolios.map(p => p.id === updated.id ? updated : p);
            setPortfolios(newList);
            localStorage.setItem("myPortfolios", JSON.stringify(newList));
            setEditingProject(null);
          }} 
        />
      )}
    </div>
  );
}

export default Profile;