import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  surname: { type: String, default: "" },
  profession: { type: String, default: "" },
  location: { type: String, default: "" },
  experience: { type: String, default: "" },
  phone: { type: String, default: "" },
  experiences: { type: Array, default: [] },
  education: { type: Array, default: [] },
  website: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  behance: { type: String, default: "" },
  available: { type: Boolean, default: true },
  avatar: { type: String, default: "" },
  banner: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;