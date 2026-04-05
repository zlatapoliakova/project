import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  template: { 
    type: String, 
    enum: ['minimal', 'grid', 'dark'], 
    required: true 
  },
  data: {
    name: String,
    surname: String,
    profession: String,
    about: String,
    bio: String,
    location: String,
    avatar: String,
    experiences: Array, 
    education: Array,  
    settings: {
      primaryColor: String,
      showEducation: Boolean
    }
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
