import express from 'express';
import { buyPlayerHandler, getUserTransactions } from '../controllers/transactionController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
const router = express.Router();


router.get('/',authenticateJWT, getUserTransactions);
router.post('/buy',authenticateJWT, buyPlayerHandler);


export default router;

