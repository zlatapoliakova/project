import Project from '../models/Project.js';
import User from '../models/User.js';

export const createPortfolio = async (req, res) => {
  try {
    const { owner, template } = req.body;

    const user = await User.findById(owner);
    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });

    const allUserWork = await Project.find({ owner, type: 'projects' });

    const newPortfolio = new Project({
      owner: owner,
      type: 'portfolio',
      template: template || 'minimal',
      title: `Portfolio - ${user.userName || user.name}`,
      data: {
        name: user.name || "",
        surname: user.surname || "",
        profession: user.profession || "",
        avatar: user.avatar || "",
        bio: user.experience || "", 
        experiences: [],
      },
      projects: allUserWork.map(p => p._id) 
    });

    const saved = await newPortfolio.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('projects');
    
    if (!project) return res.status(404).json({ message: "Не знайдено" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};