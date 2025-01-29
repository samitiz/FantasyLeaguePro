
import express from 'express';
import { addPlayerToTeam, removePlayerFromTeam, getTeamByUserId } from '../controllers/teamController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get team by user id
router.get('/', authenticateJWT,  getTeamByUserId);

// Route to add player to team
router.post('/addPlayer',authenticateJWT, addPlayerToTeam);

// Route to remove player from team
router.post('/removePlayer',authenticateJWT, removePlayerFromTeam);

export default router;

