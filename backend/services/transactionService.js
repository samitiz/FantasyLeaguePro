// services/transactionService.js

const Team = require('../models/teamModel');
const Player = require('../models/playerModel');
const Transaction = require('../models/transactionModel');

// Logic to buy player
async function buyPlayer(team, player) {
    // Check if the team has enough budget
    if (team.budget < player.price * 0.95) {
        throw new Error('Insufficient budget');
    }

    // Add player to team
    await team.addPlayer(player._id);

    // Update budget
    team.budget -= player.price * 0.95; // deduct 95% of the player price

    // Save the team
    await team.save();

    // Record the transaction
    await Transaction.create({
        team: team._id,
        player: player._id,
        action: 'buy',
        price: player.price * 0.95,
    });
}

// Logic to sell player
async function sellPlayer(team, player) {
    // Remove player from team
    await team.removePlayer(player._id);

    // Calculate selling price (95% of original price)
    const sellingPrice = player.price * 0.95;

    // Update the team's budget
    team.budget += sellingPrice;

    // Save the team and player
    await team.save();
    await player.save();

    // Record the transaction
    await Transaction.create({
        team: team._id,
        player: player._id,
        action: 'sell',
        price: sellingPrice,
    });
}

module.exports = {
    buyPlayer,
    sellPlayer
};
