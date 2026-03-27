import express from 'express';

import { upload } from '../utils/cloudinary.js';
import { createPortfolio, getProjectById } from '../controllers/projectController.js';
import Project from '../models/Project.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ 
      owner: req.params.userId, 
      type: 'projects' 
    }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/create-portfolio', createPortfolio);

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { owner, title, link, category, description } = req.body;
    const newWork = new Project({
      owner, title, link, category, description,
      type: 'projects',
      image: req.file ? req.file.path : ""
    });
    await newWork.save();
    res.status(201).json(newWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', getProjectById);

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;

    if (typeof updateData.data === 'string') updateData.data = JSON.parse(updateData.data);
    if (typeof updateData.projects === 'string') updateData.projects = JSON.parse(updateData.projects);

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('projects');

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;