import { useState, useEffect } from "react";
import { gamesService } from "../api/services";

const useGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await gamesService.getGames();
      setGames(Array.isArray(data) ? data : data.games || []);
      setError(null);
    } catch (err) {
      setError("Failed to load games. Please try again later.");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  const addGame = async (gameData) => {
    try {
      await gamesService.createGame(gameData);
      await fetchGames();
    } catch (err) {
      throw err;
    }
  };

  const updateGame = async (id, gameData) => {
    try {
      // Use MongoDB _id by default, with fallback to id
      const gameId = id || (gameData && (gameData._id || gameData.id));
      if (!gameId) {
        throw new Error("Game ID is required for update");
      }
      await gamesService.updateGame(gameId, gameData);
      await fetchGames();
    } catch (err) {
      throw err;
    }
  };

  const deleteGame = async (id) => {
    try {
      // Ensure we have a valid ID
      if (!id) {
        throw new Error("Game ID is required for deletion");
      }
      await gamesService.deleteGame(id);
      await fetchGames();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    games,
    loading,
    error,
    addGame,
    updateGame,
    deleteGame,
    refreshGames: fetchGames,
  };
};

export default useGames;
