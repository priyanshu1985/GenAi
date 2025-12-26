import React, { useState, useEffect } from "react";
import VoiceRecorder from "../components/voice/VoiceRecorder";
import AudioPlayer from "../components/voice/AudioPlayer";
import ProgressBar from "../components/learning/ProgressBar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

const ChildSession = () => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [feedback, setFeedback] = useState("");

  // Mock lesson data
  const lesson = {
    id: 1,
    title: "Learning Numbers 1-5",
    steps: [
      {
        id: 1,
        type: "instruction",
        content:
          "Today we'll learn numbers 1 to 5. Listen carefully and repeat after me.",
        audio: "/audio/intro-numbers.mp3",
      },
      {
        id: 2,
        type: "practice",
        content: "Say the number 'ONE'",
        targetWord: "one",
        audio: "/audio/number-one.mp3",
      },
      {
        id: 3,
        type: "practice",
        content: "Say the number 'TWO'",
        targetWord: "two",
        audio: "/audio/number-two.mp3",
      },
      {
        id: 4,
        type: "practice",
        content: "Say the number 'THREE'",
        targetWord: "three",
        audio: "/audio/number-three.mp3",
      },
      {
        id: 5,
        type: "completion",
        content: "Great job! You've completed the numbers lesson.",
        audio: "/audio/completion.mp3",
      },
    ],
  };

  useEffect(() => {
    setCurrentLesson(lesson);
    setSessionProgress((currentStep / lesson.steps.length) * 100);
  }, [currentStep]);

  const handleRecordingComplete = async (audioBlob) => {
    setIsLoading(true);

    // Mock audio processing - in real app, this would send to backend
    try {
      const newRecording = {
        id: Date.now(),
        blob: audioBlob,
        step: currentStep,
        timestamp: new Date().toISOString(),
      };

      setRecordings((prev) => [...prev, newRecording]);

      // Mock feedback generation
      setTimeout(() => {
        const currentStepData = lesson.steps[currentStep];
        if (currentStepData.type === "practice") {
          // Mock speech recognition result
          const mockConfidence = Math.random() * 0.4 + 0.6; // 60-100%
          const isGoodPronunciation = mockConfidence > 0.75;

          setFeedback(
            isGoodPronunciation
              ? "Excellent pronunciation! Well done!"
              : "Good try! Let's practice that again."
          );

          if (isGoodPronunciation) {
            setTimeout(handleNextStep, 2000);
          }
        } else {
          setTimeout(handleNextStep, 1000);
        }

        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error processing recording:", error);
      setFeedback("Sorry, there was an error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setFeedback("");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setFeedback("");
    }
  };

  const handleRestartLesson = () => {
    setCurrentStep(0);
    setRecordings([]);
    setFeedback("");
    setSessionProgress(0);
  };

  const currentStepData = lesson.steps[currentStep];
  const isLastStep = currentStep === lesson.steps.length - 1;

  return (
    <div
      className="min-vh-100"
      style={{ background: "linear-gradient(to bottom right, #e7f1ff, #e0e7ff)" }}
    >
      <div className="container py-4" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-dark mb-2">{lesson.title}</h1>
          <p className="text-muted mb-3">
            Step {currentStep + 1} of {lesson.steps.length}
          </p>

          <ProgressBar
            current={currentStep + 1}
            total={lesson.steps.length}
            color="blue"
            size="medium"
            label="Lesson Progress"
            className="mx-auto"
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Main Content */}
        <div className="card shadow mb-4">
          <div className="card-body p-4">
            {/* Step Content */}
            <div className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded p-4 mb-4">
                <h2 className="h5 fw-semibold text-dark mb-3">
                  {currentStepData.content}
                </h2>

                {/* Audio Player for instruction */}
                {currentStepData.audio && (
                  <div className="mb-4">
                    <AudioPlayer
                      audioSrc={currentStepData.audio}
                      title="Listen to the instruction"
                      className="mx-auto"
                      style={{ maxWidth: "400px" }}
                    />
                  </div>
                )}
              </div>

              {/* Voice Recording Section */}
              {currentStepData.type === "practice" && (
                <div className="mb-4">
                  <div className="alert alert-warning mb-3">
                    <p className="mb-0 fw-medium">
                      🎤 Your turn! Record yourself saying: "
                      {currentStepData.targetWord}"
                    </p>
                  </div>

                  <VoiceRecorder
                    onRecordingComplete={handleRecordingComplete}
                    maxDuration={10}
                    className="mb-3"
                  />

                  {isLoading && (
                    <Loader
                      message="Analyzing your pronunciation..."
                      size="medium"
                      color="blue"
                    />
                  )}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div
                  className={`alert mb-4 ${
                    feedback.includes("Excellent") ||
                    feedback.includes("Well done")
                      ? "alert-success"
                      : feedback.includes("Good try")
                      ? "alert-warning"
                      : "alert-danger"
                  }`}
                >
                  <p className="mb-0 fw-medium">{feedback}</p>
                </div>
              )}

              {/* Completion Message */}
              {isLastStep && (
                <div className="alert alert-success p-4 mb-4">
                  <div className="text-center">
                    <div
                      className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: "64px", height: "64px" }}
                    >
                      <svg
                        style={{ width: "32px", height: "32px" }}
                        className="text-success"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="h5 fw-bold text-success mb-2">
                      Congratulations! 🎉
                    </h3>
                    <p className="text-success mb-0">
                      You've successfully completed this lesson!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="d-flex justify-content-between align-items-center">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="d-flex gap-3">
                {!isLastStep ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      currentStepData.type === "practice" &&
                      !feedback.includes("Excellent")
                    }
                  >
                    Next Step
                  </Button>
                ) : (
                  <div className="d-flex gap-3">
                    <Button onClick={handleRestartLesson} variant="outline">
                      Restart Lesson
                    </Button>
                    <Button onClick={() => (window.location.href = "/")}>
                      Back to Home
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recording History (for debugging/review) */}
        {recordings.length > 0 && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h6 fw-semibold text-dark mb-3">
                Session Recordings ({recordings.length})
              </h3>
              <div className="d-flex flex-column gap-3">
                {recordings.slice(-3).map((recording, index) => (
                  <div key={recording.id} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-medium text-dark">
                        Step {recording.step + 1} Recording
                      </span>
                      <span className="small text-muted">
                        {new Date(recording.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <AudioPlayer
                      audioBlob={recording.blob}
                      title={`Recording ${recordings.length - index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildSession;
