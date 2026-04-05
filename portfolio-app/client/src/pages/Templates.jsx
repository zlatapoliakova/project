import React from 'react';
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import TemplateCard from "../components/cards/TemplateCard";

import { templates } from "../data/templatesData";

function Templates() {
  const navigate = useNavigate();
  const { user, loading, t } = useAuth();

  if (loading || !t) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold">
        {t?.common?.loading || "Loading..."}
      </div>
    );
  }

  const handleSelectTemplate = async (template) => {
    const userId = user?.id || user?._id;

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const userResponse = await fetch(`http://localhost:5000/api/auth/${userId}`);
      const freshUser = userResponse.ok ? await userResponse.json() : user;

      const portfolioData = {
        owner: userId,
        template: template.id,
        data: {
          name: freshUser?.name || freshUser?.userName?.split(' ')[0] || "Name",
          surname: freshUser?.surname || freshUser?.userName?.split(' ')[1] || "Surname",
          avatar: freshUser?.avatar || "",
          profession: freshUser?.profession || "",
          bio: freshUser?.bio || "",
          location: freshUser?.location || "",
          experiences: freshUser?.experiences || [], 
          education: freshUser?.education || [],
        }
      };

      const response = await fetch("http://localhost:5000/api/portfolios/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      });

      const newPortfolio = await response.json();

      if (response.ok) {
        const portfolioId = newPortfolio._id || newPortfolio.id;
        navigate(`/portfolio-editor/${portfolioId}`);
      } else {
        alert(t.templates.errorCreate);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(t.templates.serverError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16 flex-1">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
            {t.templates.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl">
            {t.templates.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {templates.map((tpl) => (
            <TemplateCard 
              key={tpl.id} 
              template={tpl} 
              onSelect={() => handleSelectTemplate(tpl)} 
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Templates;
