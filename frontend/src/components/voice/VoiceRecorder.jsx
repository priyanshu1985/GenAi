import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import useVoice from "../../hooks/useVoice";

const VoiceRecorder = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  maxDuration = 30,
  className = "",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const intervalRef = useRef(null);

  const { startRecording, stopRecording, audioBlob, isSupported, error } =
    useVoice({
      onStart: () => {
        setIsRecording(true);
        setRecordingDuration(0);

        intervalRef.current = setInterval(() => {
          setRecordingDuration((prev) => {
            if (prev >= maxDuration) {
              handleStopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);

        onRecordingStart?.();
      },
      onStop: (blob) => {
        setIsRecording(false);
        setRecordingDuration(0);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        onRecordingStop?.();
        onRecordingComplete?.(blob);
      },
    });

  const handleStartRecording = () => {
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isSupported) {
    return (
      <div className={`alert alert-warning text-center ${className}`}>
        <p className="mb-0">Voice recording is not supported in this browser.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`alert alert-danger text-center ${className}`}>
        <p className="mb-0">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column align-items-center gap-3 p-3 ${className}`}>
      {isRecording && (
        <div className="text-center">
          <div className="h4 fw-bold text-danger">
            {formatDuration(recordingDuration)}
          </div>
          <p className="small text-muted">Recording... (max {maxDuration}s)</p>
        </div>
      )}

      <div className="d-flex align-items-center gap-3">
        {!isRecording ? (
          <Button
            onClick={handleStartRecording}
            variant="danger"
            size="large"
          >
            <svg
              style={{ width: "24px", height: "24px" }}
              className="me-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
            Start Recording
          </Button>
        ) : (
          <Button onClick={handleStopRecording} variant="danger" size="large">
            <svg
              style={{ width: "24px", height: "24px" }}
              className="me-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

VoiceRecorder.propTypes = {
  onRecordingComplete: PropTypes.func,
  onRecordingStart: PropTypes.func,
  onRecordingStop: PropTypes.func,
  maxDuration: PropTypes.number,
  className: PropTypes.string,
};

export default VoiceRecorder;
