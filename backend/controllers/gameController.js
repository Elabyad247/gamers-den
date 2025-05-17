const Game = require("../models/Game");

const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createGame = async (req, res) => {
  try {
    const gameData = req.body;

    const game = await Game.create(gameData);

    if (!game) {
      return res.status(400).json({ message: "Game not created" });
    }

    res.status(201).json({ message: "Game created successfully", game });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ game });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const gameData = req.body;

    const game = await Game.findByIdAndUpdate(id, gameData, { new: true });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndDelete(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame,
};
