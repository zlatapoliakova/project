import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  link: { type: String, default: "" },
  image: { type: String, default: "" },
  category: { type: String, default: "" },
  description: { type: String, default: "" },
  
  type: { type: String, enum: ['projects', 'portfolio'], default: 'projects' }, 
  
  template: { type: String, default: "minimal" }, 
  
  data: { type: Object, default: {} }, 
  
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], 
  
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;