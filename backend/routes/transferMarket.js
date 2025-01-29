import express from 'express';
import { addPlayerToMarket, getTransferMarket, removePlayerFromMarket, } from '../controllers/transferMarketController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all players available in the transfer market
router.get('/', authenticateJWT, getTransferMarket);

// Route to add a player to the transfer market
router.post('/add', authenticateJWT, addPlayerToMarket);

// Route to remove a player from the transfer market
router.post('/remove', authenticateJWT, removePlayerFromMarket);

export default router;
