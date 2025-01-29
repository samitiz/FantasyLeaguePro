import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availableForSale: {  
        type: Boolean,
        default: false,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team', 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Player =  mongoose.model('Player', playerSchema);
export default Player;
