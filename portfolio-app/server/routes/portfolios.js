import express from 'express';
import { 
  createPortfolio, 
  getPortfolioById, 
  getUserPortfolios, 
  updatePortfolio,
  deletePortfolio
} from '../controllers/portfolioController.js';

const router = express.Router();

router.get('/user/:userId', getUserPortfolios); 
router.post('/create', createPortfolio);        
router.get('/:id', getPortfolioById);           
router.put('/:id', updatePortfolio);            
router.delete('/:id', deletePortfolio);

export default router;