import express from "express";
import {
  addPlayerToTeam,
  removePlayerFromTeam,
  getPlayerDetails,
  getAllPlayers,
} from "../controllers/playerController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all players
router.get("/", authenticateJWT, getAllPlayers);

// Route to get details of a specific player
router.get("/:id", authenticateJWT, getPlayerDetails);

// Route to add a player to a team
router.post("/add", authenticateJWT, addPlayerToTeam);

// Route to remove a player from a team
router.delete("/remove/:id", authenticateJWT, removePlayerFromTeam);

export default router;
