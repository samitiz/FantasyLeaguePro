import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    sellerTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,

    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,

    },
    action: {
        type: String,
        enum: ['buy', 'sell'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    buyerTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false,  
    },
   
}, {timestamps: true});


const Transaction =  mongoose.model('Transaction', transactionSchema);
export default Transaction;