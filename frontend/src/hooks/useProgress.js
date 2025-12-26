import { useState, useCallback, useEffect } from "react";

const useProgress = (initialData = null) => {
  const [progress, setProgress] = useState(
    initialData || {
      currentLesson: null,
      currentStep: 0,
      completedLessons: [],
      totalScore: 0,
      sessionStartTime: null,
      sessionDuration: 0,
      statistics: {
        totalSessions: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        streak: 0,
        lastSessionDate: null,
      },
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem("learningProgress");
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setProgress((prev) => ({
            ...prev,
            ...parsed,
            sessionStartTime: null, // Reset session time
            sessionDuration: 0,
          }));
        }
      } catch (err) {
        console.error("Failed to load progress from localStorage:", err);
        setError("Failed to load your progress");
      }
    };

    loadProgress();
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("learningProgress", JSON.stringify(progress));
    } catch (err) {
      console.error("Failed to save progress to localStorage:", err);
    }
  }, [progress]);

  // Start a new learning session
  const startSession = useCallback((lessonId) => {
    setProgress((prev) => ({
      ...prev,
      currentLesson: lessonId,
      currentStep: 0,
      sessionStartTime: new Date().toISOString(),
      sessionDuration: 0,
    }));
  }, []);

  // End the current session
  const endSession = useCallback((score = 0, completed = false) => {
    setProgress((prev) => {
      const sessionEndTime = new Date();
      const sessionStart = prev.sessionStartTime
        ? new Date(prev.sessionStartTime)
        : sessionEndTime;
      const duration = Math.floor((sessionEndTime - sessionStart) / 1000 / 60); // minutes

      const newCompletedLessons =
        completed &&
        prev.currentLesson &&
        !prev.completedLessons.includes(prev.currentLesson)
          ? [...prev.completedLessons, prev.currentLesson]
          : prev.completedLessons;

      const newTotalSessions = prev.statistics.totalSessions + 1;
      const newTotalScore = prev.totalScore + score;
      const newAverageScore =
        newTotalSessions > 0 ? Math.round(newTotalScore / newTotalSessions) : 0;
      const newTotalTimeSpent = prev.statistics.totalTimeSpent + duration;

      // Calculate streak
      const today = new Date().toDateString();
      const lastSessionDate = prev.statistics.lastSessionDate;
      let newStreak = prev.statistics.streak;

      if (!lastSessionDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(lastSessionDate).toDateString();
        const yesterday = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toDateString();

        if (lastDate === yesterday) {
          newStreak += 1;
        } else if (lastDate !== today) {
          newStreak = 1;
        }
      }

      return {
        ...prev,
        currentLesson: null,
        currentStep: 0,
        sessionStartTime: null,
        sessionDuration: duration,
        completedLessons: newCompletedLessons,
        totalScore: newTotalScore,
        statistics: {
          totalSessions: newTotalSessions,
          averageScore: newAverageScore,
          totalTimeSpent: newTotalTimeSpent,
          streak: newStreak,
          lastSessionDate: today,
        },
      };
    });
  }, []);

  // Update current step
  const updateStep = useCallback((stepNumber) => {
    setProgress((prev) => ({
      ...prev,
      currentStep: stepNumber,
    }));
  }, []);

  // Mark a lesson as completed
  const completeLesson = useCallback((lessonId, score = 0) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev; // Already completed
      }

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  // Get progress for a specific lesson
  const getLessonProgress = useCallback(
    (lessonId) => {
      return {
        isCompleted: progress.completedLessons.includes(lessonId),
        isCurrent: progress.currentLesson === lessonId,
        currentStep:
          progress.currentLesson === lessonId ? progress.currentStep : 0,
      };
    },
    [progress.completedLessons, progress.currentLesson, progress.currentStep]
  );

  // Calculate overall progress percentage
  const getOverallProgress = useCallback(
    (totalLessons = 10) => {
      return Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      );
    },
    [progress.completedLessons.length]
  );

  // Get session duration in real-time
  const getCurrentSessionDuration = useCallback(() => {
    if (!progress.sessionStartTime) return 0;

    const now = new Date();
    const start = new Date(progress.sessionStartTime);
    return Math.floor((now - start) / 1000 / 60); // minutes
  }, [progress.sessionStartTime]);

  // Reset all progress (useful for testing or user request)
  const resetProgress = useCallback(() => {
    const resetData = {
      currentLesson: null,
      currentStep: 0,
      completedLessons: [],
      totalScore: 0,
      sessionStartTime: null,
      sessionDuration: 0,
      statistics: {
        totalSessions: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        streak: 0,
        lastSessionDate: null,
      },
    };

    setProgress(resetData);
    localStorage.removeItem("learningProgress");
  }, []);

  // Sync progress with server (when online)
  const syncWithServer = useCallback(
    async (apiEndpoint) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(progress),
        });

        if (!response.ok) {
          throw new Error(`Failed to sync: ${response.status}`);
        }

        const serverProgress = await response.json();

        // Update with server data if newer
        if (serverProgress.lastModified > progress.lastModified) {
          setProgress((prev) => ({
            ...serverProgress,
            sessionStartTime: prev.sessionStartTime, // Keep current session
            sessionDuration: prev.sessionDuration,
          }));
        }

        return true;
      } catch (err) {
        console.error("Failed to sync progress:", err);
        setError("Failed to sync progress with server");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [progress]
  );

  return {
    progress,
    isLoading,
    error,
    startSession,
    endSession,
    updateStep,
    completeLesson,
    getLessonProgress,
    getOverallProgress,
    getCurrentSessionDuration,
    resetProgress,
    syncWithServer,
  };
};

export default useProgress;
