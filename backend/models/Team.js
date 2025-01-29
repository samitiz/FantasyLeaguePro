import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the user
        required: true,
    },
    budget: {
        type: Number,
        default: 5000000, // Default budget in dollars
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player', // Array of players linked to the team
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to check the team composition
teamSchema.methods.isValidComposition = function() {
    const positionsCount = {
        Goalkeeper: 0,
        Defender: 0,
        Midfielder: 0,
        Attacker: 0
    };

    // Count players by their positions
    this.players.forEach(playerId => {
        const player = mongoose.model('Player').findById(playerId);
        if (player) {
            positionsCount[player.position]++;
        }
    });

    // Check if the team composition follows the rules
    if (positionsCount.Goalkeeper !== 3) {
        throw new Error('A team must have exactly 3 goalkeepers.');
    }
    if (positionsCount.Defender !== 6) {
        throw new Error('A team must have exactly 6 defenders.');
    }
    if (positionsCount.Midfielder !== 6) {
        throw new Error('A team must have exactly 6 midfielders.');
    }
    if (positionsCount.Attacker !== 5) {
        throw new Error('A team must have exactly 5 attackers.');
    }

    return true;
};

// Method to add a player to the team, validating the composition before adding
teamSchema.methods.addPlayer = async function(playerId) {
    const player = await mongoose.model('Player').findById(playerId);
    if (!player) throw new Error('Player not found');

    this.players.push(playerId);
    await this.isValidComposition(); // Ensure composition is valid
    await this.save();
};

// Method to remove a player from the team, validating the composition after removal
teamSchema.methods.removePlayer = async function(playerId) {
    const playerIndex = this.players.indexOf(playerId);
    if (playerIndex === -1) throw new Error('Player not found in the team');

    this.players.splice(playerIndex, 1);
    await this.isValidComposition(); // Ensure composition is valid after removal
    await this.save();
};

// Validate the number of players on the team
teamSchema.methods.validatePlayerCount = function () {
    if (this.players.length < 15 || this.players.length > 25) {
        throw new Error('Teams must have between 15 and 25 players at all times.');
    }
};

teamSchema.methods.checkBudget = function (newPlayerPrice) {
    const remainingBudget = this.budget - newPlayerPrice;
    if (remainingBudget < 0) {
        throw new Error('Insufficient budget to buy this player');
    }
    return remainingBudget;
};


const Team = mongoose.model('Team', teamSchema);
export default Team;
