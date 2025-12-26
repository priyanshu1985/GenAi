import { useState, useRef, useCallback, useEffect } from "react";

const useVoice = ({ onStart, onStop, onError } = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Check browser support on mount
  useEffect(() => {
    const checkSupport = () => {
      const hasMediaRecorder = "MediaRecorder" in window;
      const hasGetUserMedia =
        "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices;

      setIsSupported(hasMediaRecorder && hasGetUserMedia);

      if (!hasMediaRecorder) {
        setError("MediaRecorder API not supported in this browser");
      } else if (!hasGetUserMedia) {
        setError("getUserMedia not supported in this browser");
      }
    };

    checkSupport();
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError("Voice recording is not supported");
      return;
    }

    if (isRecording) {
      console.warn("Recording is already in progress");
      return;
    }

    try {
      // Clear previous recordings and errors
      setAudioBlob(null);
      setError(null);
      chunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm; codecs=opus")
          ? "audio/webm; codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/wav",
      });

      mediaRecorderRef.current = mediaRecorder;

      // Event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/wav",
        });
        setAudioBlob(blob);
        setIsRecording(false);

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        onStop?.(blob);
      };

      mediaRecorder.onerror = (event) => {
        setError(`Recording error: ${event.error?.message || "Unknown error"}`);
        setIsRecording(false);
        onError?.(event.error);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      onStart?.();
    } catch (err) {
      console.error("Error starting recording:", err);

      let errorMessage = "Failed to start recording";
      if (err.name === "NotAllowedError") {
        errorMessage =
          "Microphone access denied. Please allow microphone permissions.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No microphone found. Please connect a microphone.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Microphone is being used by another application.";
      }

      setError(errorMessage);
      setIsRecording(false);
      onError?.(err);
    }
  }, [isSupported, isRecording, onStart, onStop, onError]);

  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) {
      console.warn("No recording in progress");
      return;
    }

    try {
      mediaRecorderRef.current.stop();
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError("Failed to stop recording");
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setError(null);
    chunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  return {
    isRecording,
    audioBlob,
    isSupported,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  };
};

export default useVoice;
