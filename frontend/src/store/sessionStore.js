import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Session store for managing learning session state
const useSessionStore = create(
  persist(
    (set, get) => ({
      // Current session state
      currentSession: null,
      isSessionActive: false,
      sessionStartTime: null,
      sessionDuration: 0,

      // Current lesson and progress
      currentLesson: null,
      currentStep: 0,
      totalSteps: 0,
      lessonProgress: 0,

      // Recordings and feedback
      recordings: [],
      currentRecording: null,
      feedback: [],

      // User performance
      sessionScore: 0,
      correctAnswers: 0,
      totalAttempts: 0,

      // Session settings
      settings: {
        voiceRecognitionEnabled: true,
        audioFeedbackEnabled: true,
        autoAdvanceEnabled: false,
        recordingMaxDuration: 30,
        language: "en-US",
      },

      // Actions
      startSession: (lessonData) => {
        const sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        set({
          currentSession: {
            id: sessionId,
            lessonId: lessonData.id,
            lessonTitle: lessonData.title,
            startTime: new Date().toISOString(),
            userId: lessonData.userId || "guest",
          },
          isSessionActive: true,
          sessionStartTime: Date.now(),
          sessionDuration: 0,
          currentLesson: lessonData,
          currentStep: 0,
          totalSteps: lessonData.steps?.length || 0,
          lessonProgress: 0,
          recordings: [],
          feedback: [],
          sessionScore: 0,
          correctAnswers: 0,
          totalAttempts: 0,
        });

        return sessionId;
      },

      endSession: (completionData = {}) => {
        const state = get();
        const endTime = Date.now();
        const duration = Math.floor((endTime - state.sessionStartTime) / 1000);

        const sessionSummary = {
          ...state.currentSession,
          endTime: new Date().toISOString(),
          duration: duration,
          completed: completionData.completed || false,
          finalScore: state.sessionScore,
          correctAnswers: state.correctAnswers,
          totalAttempts: state.totalAttempts,
          accuracy:
            state.totalAttempts > 0
              ? (state.correctAnswers / state.totalAttempts) * 100
              : 0,
          recordingsCount: state.recordings.length,
          stepsCompleted: state.currentStep,
          totalSteps: state.totalSteps,
          progressPercentage: state.lessonProgress,
          ...completionData,
        };

        set({
          currentSession: null,
          isSessionActive: false,
          sessionStartTime: null,
          sessionDuration: duration,
          currentLesson: null,
          currentStep: 0,
          totalSteps: 0,
          lessonProgress: 0,
          recordings: [],
          currentRecording: null,
          feedback: [],
          sessionScore: 0,
          correctAnswers: 0,
          totalAttempts: 0,
        });

        return sessionSummary;
      },

      updateProgress: (stepNumber, progressPercentage) => {
        set({
          currentStep: stepNumber,
          lessonProgress: Math.min(100, Math.max(0, progressPercentage)),
        });
      },

      nextStep: () => {
        const state = get();
        const nextStep = Math.min(state.currentStep + 1, state.totalSteps);
        const progress =
          state.totalSteps > 0 ? (nextStep / state.totalSteps) * 100 : 0;

        set({
          currentStep: nextStep,
          lessonProgress: progress,
        });

        return nextStep;
      },

      previousStep: () => {
        const state = get();
        const prevStep = Math.max(state.currentStep - 1, 0);
        const progress =
          state.totalSteps > 0 ? (prevStep / state.totalSteps) * 100 : 0;

        set({
          currentStep: prevStep,
          lessonProgress: progress,
        });

        return prevStep;
      },

      addRecording: (recordingData) => {
        const recording = {
          id: `recording_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          sessionId: get().currentSession?.id,
          stepNumber: get().currentStep,
          timestamp: new Date().toISOString(),
          ...recordingData,
        };

        set((state) => ({
          recordings: [...state.recordings, recording],
          currentRecording: recording,
        }));

        return recording;
      },

      updateRecording: (recordingId, updates) => {
        set((state) => ({
          recordings: state.recordings.map((recording) =>
            recording.id === recordingId
              ? { ...recording, ...updates }
              : recording
          ),
          currentRecording:
            state.currentRecording?.id === recordingId
              ? { ...state.currentRecording, ...updates }
              : state.currentRecording,
        }));
      },

      addFeedback: (feedbackData) => {
        const feedback = {
          id: `feedback_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          sessionId: get().currentSession?.id,
          stepNumber: get().currentStep,
          timestamp: new Date().toISOString(),
          ...feedbackData,
        };

        set((state) => ({
          feedback: [...state.feedback, feedback],
        }));

        return feedback;
      },

      updateScore: (points, isCorrect = false) => {
        set((state) => ({
          sessionScore: state.sessionScore + points,
          correctAnswers: isCorrect
            ? state.correctAnswers + 1
            : state.correctAnswers,
          totalAttempts: state.totalAttempts + 1,
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      resetSession: () => {
        set({
          currentSession: null,
          isSessionActive: false,
          sessionStartTime: null,
          sessionDuration: 0,
          currentLesson: null,
          currentStep: 0,
          totalSteps: 0,
          lessonProgress: 0,
          recordings: [],
          currentRecording: null,
          feedback: [],
          sessionScore: 0,
          correctAnswers: 0,
          totalAttempts: 0,
        });
      },

      // Computed values
      getSessionDuration: () => {
        const state = get();
        if (!state.sessionStartTime) return 0;
        return Math.floor((Date.now() - state.sessionStartTime) / 1000);
      },

      getAccuracy: () => {
        const state = get();
        return state.totalAttempts > 0
          ? Math.round((state.correctAnswers / state.totalAttempts) * 100)
          : 0;
      },

      getCurrentStepRecordings: () => {
        const state = get();
        return state.recordings.filter(
          (r) => r.stepNumber === state.currentStep
        );
      },

      getSessionAnalytics: () => {
        const state = get();
        return {
          sessionId: state.currentSession?.id,
          duration: state.getSessionDuration(),
          progress: state.lessonProgress,
          score: state.sessionScore,
          accuracy: state.getAccuracy(),
          recordingsCount: state.recordings.length,
          feedbackCount: state.feedback.length,
          averageStepTime:
            state.currentStep > 0
              ? state.getSessionDuration() / state.currentStep
              : 0,
        };
      },
    }),
    {
      name: "session-store",
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for temporary data
      partialize: (state) => ({
        // Only persist essential session data
        currentSession: state.currentSession,
        isSessionActive: state.isSessionActive,
        sessionStartTime: state.sessionStartTime,
        currentLesson: state.currentLesson,
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        lessonProgress: state.lessonProgress,
        sessionScore: state.sessionScore,
        correctAnswers: state.correctAnswers,
        totalAttempts: state.totalAttempts,
        settings: state.settings,
      }),
    }
  )
);

export default useSessionStore;
