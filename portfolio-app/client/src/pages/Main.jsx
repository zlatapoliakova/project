import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/header/DashboardHeader";
import Header from "../components/header/Header"; 
import Footer from "../components/Footer";
import TemplateCard from "../components/cards/TemplateCard";

function Main() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    profession: "",
    avatar: null
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
      setIsAuth(true);
      setUserData({
        name: `${savedProfile.name || ""} ${savedProfile.surname || ""}`,
        profession: savedProfile.profession || "",
        avatar: savedAvatar
      });
    } else {
      setIsAuth(false);
    }
  }, []);

  const handleSelectTemplate = (template) => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    localStorage.removeItem("selectedPortfolio"); 
    localStorage.setItem("selectedTemplate", JSON.stringify({ id: template.id }));
    navigate("/portfolio-editor");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuth ? (
        <DashboardHeader 
          avatar={userData.avatar} 
          userName={userData.name} 
          userProfession={userData.profession} 
        />
      ) : (
        <Header />
      )}

      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
              Create your professional
              <span className="text-indigo-600 block"> design portfolio</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-md">
              Build, customize and share your digital portfolio
              in minutes using beautiful templates.
            </p>
            <button 
              onClick={() => navigate(isAuth ? "/templates" : "/register")}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Start Creating — It's Free
            </button>
          </div>

          <div className="flex justify-center relative">
            <div className="absolute -inset-4 bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>
            <img 
              src="https://picsum.photos/800/600?design" 
              alt="Preview" 
              className="rounded-2xl shadow-2xl border border-white object-cover w-full max-w-[500px] h-[350px] transform hover:-rotate-2 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Choose your template</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Pick a style that fits your personality and start building your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {templates.map((tpl) => (
              <TemplateCard 
                key={tpl.id} 
                template={tpl} 
                onSelect={handleSelectTemplate} 
              />
            ))}
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => navigate(isAuth ? "/templates" : "/login")}
              className="px-10 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"
            >
              View All Templates
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Main;