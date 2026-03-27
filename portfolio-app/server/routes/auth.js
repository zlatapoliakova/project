import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { upload } from '../utils/cloudinary.js';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Цей email вже зареєстровано' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      message: 'Успішно!', 
      token, 
      user: { id: newUser._id, userName: newUser.userName } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ЛОГІН
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Невірний пароль' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ 
      message: 'Вхід успішний', 
      token, 
      user: { id: user._id, userName: user.userName, avatar: user.avatar } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ПЕРЕВІРКА ТОКЕНА 
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Немає токена' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Токен невалідний' });
  }
});

// ОТРИМАННЯ ДАНИХ КОРИСТУВАЧА
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ОНОВЛЕННЯ ПРОФІЛЮ 
router.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { returnDocument: 'after' } 
    ).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ЗАВАНТАЖЕННЯ АВАТАРА
router.post('/upload-avatar/:id', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Файл не отримано' });

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { avatar: req.file.path }, 
      { returnDocument: 'after' }
    );
    
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    res.status(200).json({ message: 'Фото оновлено', avatar: req.file.path });
  } catch (error) {
    res.status(500).json({ message: "Помилка завантаження", details: error.message });
  }
});

// ЗАВАНТАЖЕННЯ БАНЕРА
router.post('/upload-banner/:id', upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Файл банера не отримано' });

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { banner: req.file.path }, 
      { returnDocument: 'after' }
    );
    
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    res.status(200).json({ message: 'Банер оновлено', banner: req.file.path });
  } catch (error) {
    console.error("❌ Cloudinary Banner Error:", error);
    res.status(500).json({ message: "Помилка завантаження банера", details: error.message });
  }
});

// ПОШУК ДИЗАЙНЕРІВ 
router.get('/search/designers', async (req, res) => {
  try {
    const { q } = req.query; 
    if (!q) return res.status(200).json([]);

    const searchRegex = new RegExp(q, 'i'); 

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { surname: searchRegex },
        { userName: searchRegex },
        { profession: searchRegex } 
      ]
    })
    .select('name surname userName profession avatar') 
    .limit(10); 

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;