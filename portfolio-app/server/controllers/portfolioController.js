import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';

export const createPortfolio = async (req, res) => {
  try {
    const { owner, template, data } = req.body;
    
    const userProjects = await Project.find({ owner });

    const newPortfolio = new Portfolio({
      owner,
      template,
      title: data.title || `My ${template} Portfolio`,
      data: {
        name: data.name || "",
        surname: data.surname || "",
        profession: data.profession || "",
        about: data.about || "",
        bio: data.bio || "",
        location: data.location || "",
        avatar: data.avatar || "",
        experiences: data.experiences || [], 
        education: data.education || [],    
      },
      projects: userProjects.map(p => p._id) 
    });

    const saved = await newPortfolio.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create Portfolio Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('projects');
    
    if (!portfolio) {
      return res.status(404).json({ message: "Портфоліо не знайдено" });
    }
    
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Некоректний ID або помилка сервера" });
  }
};

export const getUserPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ owner: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { data, projects, title } = req.body;

    const updated = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          title, 
          data, 
          projects 
        } 
      },
      { new: true }
    ).populate('projects');

    if (!updated) {
      return res.status(404).json({ message: "Портфоліо для оновлення не знайдено" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: "Портфоліо не знайдено" });
    }

    res.status(200).json({ message: "Портфоліо успішно видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
