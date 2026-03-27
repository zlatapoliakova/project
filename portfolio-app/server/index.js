import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import portfolioRoutes from './routes/portfolios.js';

const app = express();

app.use(express.json({ limit: '10mb' })); 
app.use(cors());

app.get('/', (req, res) => {
  res.send('🚀 Сервер Portify працює!');
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);    
app.use('/api/portfolios', portfolioRoutes); 

app.use((err, req, res, next) => {
  console.error("Системна помилка:", err.stack);
  res.status(500).json({ 
    message: "Щось пішло не так на сервері", 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Успішно підключено до MongoDB Atlas');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('Попередження: CLOUDINARY_CLOUD_NAME не знайдено в .env');
    }

    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту: ${PORT}`);
      console.log(`Доступно за адресою: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Помилка підключення до MongoDB:', error.message);
    process.exit(1);
  });