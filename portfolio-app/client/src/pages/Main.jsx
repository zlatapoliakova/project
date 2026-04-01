import { useNavigate } from "react-router-dom";

import { templates } from "../data/templatesData";

import { useAuth } from "../context/AuthContext";

import Header from "../components/header/Header"; 
import Footer from "../components/Footer";
import TemplateCard from "../components/cards/TemplateCard";

function Main() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const handleSelectTemplate = (template) => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    navigate("/portfolio-editor", { state: { templateId: template.id } });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
              Create your professional
              <span className="text-indigo-600 block"> design portfolio</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Build, customize and share your digital portfolio in minutes.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(isAuth ? "/templates" : "/register")}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                {isAuth ? "Go to Templates" : "Start Creating — It's Free"}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                <video 
                  src="/video/portify_animation.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="relative rounded-2xl shadow-2xl w-full max-w-[500px] object-cover" 
                />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose your template</h2>
            <p className="text-gray-500">Select a starting point for your personal portfolio</p>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Main;