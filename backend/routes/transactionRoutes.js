import express from 'express';
import { buyPlayerHandler, getUserTransactions } from '../controllers/transactionController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
const router = express.Router();

// Route to get all players
router.get('/',authenticateJWT, getUserTransactions);

// Route to buy player from transfer market
router.post('/buy',authenticateJWT, buyPlayerHandler);


export default router;

