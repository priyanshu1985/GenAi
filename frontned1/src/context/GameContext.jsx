import React, { createContext, useState, useEffect, useCallback } from "react";
import gameAPI from "../services/gameAPI";
import { useAuth } from "./AuthContext";

// Create Game Context
const GameContext = createContext();

// Game Provider Component
export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  const [gameStats, setGameStats] = useState({
    coins: 0,
    level: 1,
    current_streak: 0,
    best_streak: 0,
    accuracy_percentage: 0,
    badges_earned: [],
    coins_for_next_level: 25,
    level_progress_percentage: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const loadGameStats = useCallback(async () => {
    // Only load if user is logged in
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await gameAPI.getChildProgress(user.id);

      if (response.success) {
        setGameStats(response.data);
      }
    } catch (error) {
      console.error("Error loading game stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load game stats on user login
  useEffect(() => {
    if (user?.id) {
      loadGameStats();
    }
  }, [user?.id, loadGameStats]);

  const updateGameStats = (newStats) => {
    setGameStats((prev) => ({
      ...prev,
      ...newStats,
    }));
  };

  const addCoins = (amount) => {
    setGameStats((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  };

  const updateStreak = (isCorrect) => {
    setGameStats((prev) => ({
      ...prev,
      current_streak: isCorrect ? prev.current_streak + 1 : 0,
      best_streak:
        isCorrect && prev.current_streak + 1 > prev.best_streak
          ? prev.current_streak + 1
          : prev.best_streak,
    }));
  };

  const addBadge = (badge) => {
    setGameStats((prev) => ({
      ...prev,
      badges_earned: [...prev.badges_earned, badge],
    }));
  };

  const getStreakDisplay = () => {
    const streak = gameStats.current_streak;
    if (streak === 0) return "💫";
    if (streak < 3) return "🔥".repeat(Math.min(streak, 2));
    if (streak < 5) return "🔥🔥🔥";
    return "🔥🔥🔥⭐";
  };

  const getLevelEmoji = () => {
    const level = gameStats.level;
    if (level < 3) return "🌱";
    if (level < 5) return "🌿";
    if (level < 7) return "🌳";
    return "👑";
  };

  const contextValue = {
    gameStats,
    isLoading,
    loadGameStats,
    updateGameStats,
    addCoins,
    updateStreak,
    addBadge,
    getStreakDisplay,
    getLevelEmoji,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export default GameContext;
