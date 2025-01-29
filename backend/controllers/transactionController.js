import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Transaction from '../models/Transaction.js';
import HttpError from '../middleware/http-error.js';


// Buy player from transfer market
const buyPlayerHandler = async (req, res) => {
    const { buyerTeamId, sellerTeamId, playerId } = req.body;

    try {
        const buyerTeam = await Team.findById(buyerTeamId).populate('players');
        const sellerTeam = await Team.findById(sellerTeamId).populate('players');
        const player = await Player.findById(playerId);

        if (!buyerTeam || !sellerTeam || !player) {
            return res.status(404).json({ message: 'Team or Player not found.' });
        }

        // Check if the buyer team has enough budget
        const playerPrice = player.price * 0.95;  // Buy at 95% of the asking price
        if (buyerTeam.budget < playerPrice) {
            return res.status(400).json({ message: 'Insufficient funds to buy player.' });
        }

        // Check composition rules before adding player to team
        const positionCount = buyerTeam.players.filter(p => p.position === player.position).length;
        const maxCount = {
            Goalkeeper: 3,
            Defender: 6,
            Midfielder: 6,
            Attacker: 5,
        };

        if (positionCount >= maxCount[player.position]) {
            return res.status(400).json({ message: `You cannot have more than ${maxCount[player.position]} ${player.position}s.` });
        }

        // Update buyer and seller teams
        buyerTeam.players.push(playerId);
        buyerTeam.budget -= playerPrice;
        sellerTeam.players = sellerTeam.players.filter(p => p !== playerId);
        sellerTeam.budget += playerPrice;
        player.availableForSale = false;

        // Save updated teams
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
        res.status(500).json({ message: error.message });
    }
};

const getUserTransactions = async (req, res, next) => {
    try {
      const userId = req.userId;
  
      // Find the user's team
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
        .sort({ createdAt: -1 }); // Sort by latest transactions
  
      res.status(200).json(transactions);
    } catch (err) {
      console.error(err);
      return next(new HttpError('Error fetching transactions', 500));
    }
  };

export { buyPlayerHandler, getUserTransactions };
