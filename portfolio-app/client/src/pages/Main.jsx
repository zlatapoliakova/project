import { useNavigate } from "react-router-dom";
import { templates } from "../data/templatesData";
import { useAuth } from "../context/AuthContext";
import Header from "../components/header/Header"; 
import Footer from "../components/Footer";
import TemplateCard from "../components/cards/TemplateCard";

function Main() {
  const navigate = useNavigate();
  const { isAuth, t } = useAuth();

  const handleSelectTemplate = (template) => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    navigate("/portfolio-editor", { state: { templateId: template.id } });
  };

  if (!t) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* HERO */}
      <section className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          
          {/* TEXT */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900">
              {t.main.heroTitle}
              <span className="text-indigo-600 block">
                {t.main.heroTitleAccent}
              </span>
            </h1>

            <p className="text-gray-600 mb-8 text-base sm:text-lg">
              {t.main.heroSubtitle}
            </p>

            <div className="flex justify-center lg:justify-start">
              <button 
                onClick={() => navigate(isAuth ? "/templates" : "/register")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-xl text-base sm:text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                {isAuth ? t.main.goTemplates : t.main.startFree}
              </button>
            </div>
          </div>

          {/* VIDEO */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[400px] sm:max-w-[500px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20"></div>
              
              <video 
                src="/video/portify_animation.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="relative rounded-2xl shadow-2xl w-full object-cover" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* TEMPLATES */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.main.templateTitle}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              {t.main.templateSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {templates.map((tpl) => (
              <TemplateCard 
                key={tpl.id} 
                template={tpl} 
                onSelect={handleSelectTemplate} 
              />
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Main;