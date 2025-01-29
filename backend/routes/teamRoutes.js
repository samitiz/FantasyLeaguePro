
import express from 'express';
import { addPlayerToTeam, removePlayerFromTeam, getTeamByUserId } from '../controllers/teamController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();



router.get('/', authenticateJWT,  getTeamByUserId);
router.post('/addPlayer',authenticateJWT, addPlayerToTeam);
router.post('/removePlayer',authenticateJWT, removePlayerFromTeam);

export default router;

