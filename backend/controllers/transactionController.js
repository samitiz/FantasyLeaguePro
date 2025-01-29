import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Transaction from '../models/Transaction.js';
import HttpError from '../middleware/http-error.js';

// Buy player from transfer market
const buyPlayerHandler = async (req, res, next) => {
    const { buyerTeamId, sellerTeamId, playerId } = req.body;

    try {
        const buyerTeam = await Team.findById(buyerTeamId).populate('players');
        const sellerTeam = await Team.findById(sellerTeamId).populate('players');
        const player = await Player.findById(playerId);

        if (!buyerTeam || !sellerTeam || !player) {
            return next(new HttpError('Team or Player not found.', 404));
        }

        // Check if the player is available for sale
        if (!player.availableForSale) {
            return next(new HttpError('Player is not available for sale.', 400));
        }

        // Check if the buyer team has enough budget
        const playerPrice = player.price * 0.95;  
        if (buyerTeam.budget < playerPrice) {
            return next(new HttpError('Insufficient funds to buy player.', 400));
        }

        // Check if both buyer and seller teams have between 15 and 25 players
        if (buyerTeam.players.length < 15 || buyerTeam.players.length > 25) {
          return next(new HttpError('Buyer team must have between 15 and 25 players.', 400));
        }

        if (sellerTeam.players.length < 15 || sellerTeam.players.length > 25) {
          return next(new HttpError('Seller team must have between 15 and 25 players.', 400));
        }

        // Update buyer and seller teams
        buyerTeam.players.push(playerId);
        buyerTeam.budget -= playerPrice;
        sellerTeam.players = sellerTeam.players.filter(p => p.toString() !== playerId.toString());
        sellerTeam.budget += playerPrice;
        player.availableForSale = false;

        // Save updated teams and player
        await buyerTeam.save();
        await sellerTeam.save();
        await player.save();

        // Create a transaction record
        const transaction = new Transaction({
            action: 'buy',
            player: playerId,
            buyerTeam: buyerTeamId,
            sellerTeam: sellerTeamId,
            price: playerPrice,
        });

        await transaction.save();

        res.status(200).json({ message: 'Player bought successfully', transaction });
    } catch (error) {
        console.error(error);
        return next(new HttpError('Error processing the transaction, please try again later.', 500));
    }
};

// Get user transactions
const getUserTransactions = async (req, res, next) => {
    const { userId } = req;

    try {
        const userTeam = await Team.findOne({ user: userId });

        if (!userTeam) {
            return next(new HttpError("User's team not found", 404));
        }

        // Fetch transactions where the user's team was the buyer or seller
        const transactions = await Transaction.find({
            $or: [{ buyerTeam: userTeam._id }, { sellerTeam: userTeam._id }],
        })
            .populate('player', 'name')
            .populate('buyerTeam', 'name')
            .populate('sellerTeam', 'name')
            .sort({ createdAt: -1 }); 

        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        return next(new HttpError('Error fetching transactions, please try again later.', 500));
    }
};

export { buyPlayerHandler, getUserTransactions };
