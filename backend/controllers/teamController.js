import Team from '../models/Team.js';
import Player from '../models/Player.js';
import HttpError from '../middleware/http-error.js';

// Helper function to check position limits
const checkPositionLimit = (team, player) => {
  const positionCount = team.players.filter(p => p.position === player.position).length;
  const maxCount = {
    Goalkeeper: 3,
    Defender: 6,
    Midfielder: 6,
    Attacker: 5,
  };

  return positionCount >= maxCount[player.position];
};

// Add player to team and check composition rules
const addPlayerToTeam = async (req, res, next) => {
  const { teamId, playerId } = req.body;

  try {
    const team = await Team.findById(teamId);
    const player = await Player.findById(playerId);

    if (!team || !player) {
      return next(new HttpError('Team or Player not found.', 404));
    }

    // Check if the team has reached the max players for the player’s position
    if (checkPositionLimit(team, player)) {
      return next(
        new HttpError(`Cannot add more than ${maxCount[player.position]} ${player.position}s.`, 400)
      );
    }

    // Add player to team
    team.players.push(playerId);
    await team.save();
    res.status(200).json({ message: 'Player added to team', team });
  } catch (error) {
    return next(new HttpError('Could not add player to team, please try again later.', 500));
  }
};

// Remove player from team and check composition rules
const removePlayerFromTeam = async (req, res, next) => {
  const { teamId, playerId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new HttpError('Team not found.', 404));
    }

    // Remove player from the team
    const playerIndex = team.players.indexOf(playerId);
    if (playerIndex === -1) {
      return next(new HttpError('Player not found in team.', 404));
    }

    team.players.splice(playerIndex, 1);
    await team.save();
    res.status(200).json({ message: 'Player removed from team', team });
  } catch (error) {
    return next(new HttpError('Could not remove player from team, please try again later.', 500));
  }
};

// Get team by user ID
const getTeamByUserId = async (req, res, next) => {
  const { userId } = req;

  try {
    const team = await Team.findOne({ user: userId }).populate('players');
    if (!team) {
      return next(new HttpError('Team not found.', 404));
    }
    res.status(200).json({ team });
  } catch (error) {
    return next(new HttpError('Could not fetch team, please try again later.', 500));
  }
};

export { addPlayerToTeam, removePlayerFromTeam, getTeamByUserId };
