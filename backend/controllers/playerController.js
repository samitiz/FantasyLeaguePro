import Player from "../models/Player.js";
import Team from "../models/Team.js";
import HttpError from "../middleware/http-error.js";

// Get all players
export const getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    return next(new HttpError("Could not fetch players, please try again later.", 500));
  }
};

// Get player details
export const getPlayerDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const player = await Player.findById(id);
    if (!player) {
      return next(new HttpError("Player not found", 404));
    }
    res.json(player);
  } catch (err) {
    return next(new HttpError("Could not fetch player details, please try again later.", 500));
  }
};

// Add player to team
export const addPlayerToTeam = async (req, res, next) => {
  const { playerId, teamId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new HttpError("Team not found", 404));
    }
    
    const player = await Player.findById(playerId);
    if (!player) {
      return next(new HttpError("Player not found", 404));
    }

    // Check if the team has space for this player
    const remainingBudget = team.checkBudget(player.price);
    team.budget = remainingBudget; // Update team budget
    team.players.push(playerId);

    await team.save();
    res.status(201).json({ message: "Player added successfully to the team", team });
  } catch (err) {
    return next(new HttpError("Could not add player to team", 500));
  }
};

// Remove player from team
export const removePlayerFromTeam = async (req, res, next) => {
  const { id } = req.params;  // Player ID to remove
  try {
    const team = await Team.findOne({ players: id });
    if (!team) {
      return next(new HttpError("Player not found in any team", 404));
    }

    // Remove the player from the team
    team.players = team.players.filter(playerId => playerId.toString() !== id);

    await team.save();
    res.status(200).json({ message: "Player removed from the team", team });
  } catch (err) {
    return next(new HttpError("Could not remove player from team", 500));
  }
};
