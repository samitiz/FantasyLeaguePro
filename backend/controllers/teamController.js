// controllers/teamController.js
import Team from '../models/Team.js';
import Player from '../models/Player.js';


// Add player to team and check composition rules
const addPlayerToTeam = async (req, res) => {
    const { teamId, playerId } = req.body;

    try {
        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(404).json({ message: 'Team or Player not found.' });
        }

        // Check if the team has reached the max players for each position
        const positionCount = team.players.filter(p => p.position === player.position).length;
        const maxCount = {
            Goalkeeper: 3,
            Defender: 6,
            Midfielder: 6,
            Attacker: 5,
        };

        if (positionCount >= maxCount[player.position]) {
            return res.status(400).json({ message: `You cannot add more than ${maxCount[player.position]} ${player.position}s.` });
        }

        // Add player to team
        team.players.push(playerId);
        await team.save();
        res.status(200).json({ message: 'Player added to team', team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Remove player from team and check composition rules
const removePlayerFromTeam = async (req, res) => {
    const { teamId, playerId } = req.body;

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        // Remove player from the team
        const playerIndex = team.players.indexOf(playerId);
        if (playerIndex === -1) {
            return res.status(404).json({ message: 'Player not found in team.' });
        }

        team.players.splice(playerIndex, 1);
        await team.save();
        res.status(200).json({ message: 'Player removed from team', team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getTeamByUserId = async (req, res) => {

    const { userId } = req;

    try {
        const team = await Team.findOne({ user: userId }).populate('players');
        res.status(200).json({ team });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    } 
}



export { addPlayerToTeam, removePlayerFromTeam, getTeamByUserId };
