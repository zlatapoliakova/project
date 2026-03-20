import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/header/DashboardHeader";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import TemplateCard from "../components/cards/TemplateCard";

function Templates() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: "",
    profession: "",
    avatar: null,
    isAuth: false
  });

  const templates = [
    { id: "minimal", title: "Minimal Template", image: "https://picsum.photos/600/400?1" },
    { id: "grid", title: "Grid Template", image: "https://picsum.photos/600/400?2" },
    { id: "dark", title: "Dark Template", image: "https://picsum.photos/600/400?3" },
  ];

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    const savedAvatar = localStorage.getItem("userAvatar");

    if (savedProfile) {
      setUserData({
        name: `${savedProfile.name || ""} ${savedProfile.surname || ""}`,
        profession: savedProfile.profession || "",
        avatar: savedAvatar,
        isAuth: true
      });
    }
  }, []);

  const handleSelectTemplate = (template) => {
    localStorage.removeItem("selectedPortfolio"); 
    localStorage.setItem("selectedTemplate", JSON.stringify({ id: template.id }));
    navigate("/portfolio-editor");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {userData.isAuth ? (
        <DashboardHeader 
          avatar={userData.avatar} 
          userName={userData.name} 
          userProfession={userData.profession} 
        />
      ) : (
        <Header />
      )}

      <div className="max-w-7xl mx-auto px-8 py-16 flex-1">
        <h1 className="text-4xl font-bold mb-3 font-sans">Templates</h1>
        <p className="text-gray-500 mb-12">Choose a template to quickly start your portfolio</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} onSelect={handleSelectTemplate} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Templates;