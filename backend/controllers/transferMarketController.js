import Player from '../models/Player.js';
import HttpError from '../middleware/http-error.js';

// Fetch all available players in the Transfer Market (availableForSale is true)
export const getTransferMarket = async (req, res, next) => {
  try {
    const availablePlayers = await Player.find({ availableForSale: true }).populate('team', 'name');

    if (!availablePlayers || availablePlayers.length === 0) {
      return next(new HttpError("No players available in the transfer market", 404));
    }

    res.status(200).json(availablePlayers);
  } catch (err) {
    return next(new HttpError("Could not fetch the transfer market", 500));
  }
};
// Add a player to the Transfer Market
export const addPlayerToMarket = async (req, res, next) => {
  const { playerId, price } = req.body;
  const userId = req.userId; // Assuming JWT middleware is used to get the user ID from the token

  try {
    const player = await Player.findById(playerId).populate('team');

    if (!player) {
      return next(new HttpError("Player not found", 404));
    }

    // Check if the player belongs to the user's team
    if (player.team.user.toString() !== userId) {
      return next(new HttpError("You can only add players from your own team", 403));
    }

    // Update player to available for sale
    player.availableForSale = true;
    player.price = price;
    await player.save();

    res.status(201).json(player);
  } catch (err) {
    return next(new HttpError("Could not add player to market", 500));
  }
};

// Remove a player from the Transfer Market
export const removePlayerFromMarket = async (req, res, next) => {
  const { playerId } = req.body;
  const userId = req.userId; // Assuming JWT middleware is used to get the user ID from the token

  try {
    const player = await Player.findById(playerId).populate('team');

    if (!player) {
      return next(new HttpError("Player not found", 404));
    }

    // Check if the player belongs to the user's team
    if (player.team.user.toString() !== userId) {
      return next(new HttpError("You can only remove players from your own team", 403));
    }

    // Remove player from the market
    player.availableForSale = false;
    // player.price = 0;
    await player.save();

    res.status(200).json(player);
  } catch (err) {
    return next(new HttpError("Could not remove player from market", 500));
  }
};



