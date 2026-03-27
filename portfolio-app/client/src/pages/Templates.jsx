import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import TemplateCard from "../components/cards/TemplateCard";

function Templates() {
  const navigate = useNavigate();
  const { isAuth, user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold">Loading...</div>;

  const handleSelectTemplate = async (template) => {
    const userId = user?.id || user?._id;

    if (!userId) {
      navigate("/login");
      return;
    }

    const portfolioData = {
      owner: userId,
      template: template.id,
      data: {
        name: user.name || user.userName.split(' ')[0],
        surname: user.surname || user.userName.split(' ')[1] || "",
        avatar: user.avatar,
        profession: user.profession || "",
        bio: user.bio || "",
        location: user.location || "",
        experiences: user.experiences || [], 
        education: user.education || [],
      }
    };

    try {
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
        alert("Помилка при створенні портфоліо");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Не вдалося підключитися до сервера.");
    }
  };

  const templates = [
    { id: "minimal", title: "Minimal Template", image: "https://picsum.photos/600/400?1" },
    { id: "grid", title: "Grid Template", image: "https://picsum.photos/600/400?2" },
    { id: "dark", title: "Dark Template", image: "https://picsum.photos/600/400?3" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-8 py-16 flex-1">
        <h1 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">Templates</h1>
        <p className="text-gray-500 mb-12">
          Choose a template to quickly start your professional portfolio page with your profile data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} onSelect={() => handleSelectTemplate(tpl)} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Templates;