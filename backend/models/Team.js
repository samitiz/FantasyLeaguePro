import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    budget: {
        type: Number,
        default: 5000000,
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

const Team = mongoose.model('Team', teamSchema);
export default Team;
