
import TeamModel from "../models/Team.js";
import PlayerModel from "../models/Player.js";

const PLAYER_CONFIG = {
  Goalkeeper: 3,
  Defender: 6,
  Midfielder: 6,
  Attacker: 5,
};

const generatePlayerName = (role, index) => `${role}-Player-${index + 1}`;

// Function to create players for a team
const createPlayers = async (teamId) => {
  const players = [];
  for (const [role, count] of Object.entries(PLAYER_CONFIG)) {
    for (let i = 0; i < count; i++) {
      players.push({
        name: generatePlayerName(role, i),
        position: role,
        team: teamId,
        price: Math.floor(Math.random() * 1000000) + 50000, // Random price between $50k and $1M
      });
    }
  }
  return await PlayerModel.insertMany(players);
};

// Function to create a team for a user
const createTeam = async (userId, teamName) => {
  const team = await TeamModel.create({
    name: teamName,
    user: userId,
    budget: 5000000, 
  });

  const players = await createPlayers(team._id);

  // Associate the players with the team
  team.players = players.map((player) => player._id);

  await team.save();
  return { team, players };
};

export { createTeam };
