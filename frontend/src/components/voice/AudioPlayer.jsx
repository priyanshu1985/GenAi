import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";

const AudioPlayer = ({
  audioSrc,
  audioBlob,
  title = "Audio Player",
  className = "",
  autoPlay = false,
  onPlayStateChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (audioSrc) {
      setAudioUrl(audioSrc);
    }
  }, [audioBlob, audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayStateChange?.(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [audioUrl, onPlayStateChange]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) {
    return (
      <div className={`text-center p-4 text-muted ${className}`}>
        No audio to play
      </div>
    );
  }

  return (
    <div className={`card shadow-sm p-3 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        autoPlay={autoPlay}
        className="d-none"
      />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-medium text-dark mb-0">{title}</h6>
        <span className="small text-muted">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="progress mb-3"
        style={{ height: "8px", cursor: "pointer" }}
        onClick={handleSeek}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progressPercent}%`, transition: "width 0.3s" }}
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center justify-content-center gap-3">
        <Button
          onClick={handlePlayPause}
          disabled={isLoading}
          variant="primary"
          size="large"
          className="rounded-circle p-0"
          style={{ width: "48px", height: "48px" }}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : isPlaying ? (
            <svg style={{ width: "24px", height: "24px" }} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg style={{ width: "24px", height: "24px" }} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

AudioPlayer.propTypes = {
  audioSrc: PropTypes.string,
  audioBlob: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
  autoPlay: PropTypes.bool,
  onPlayStateChange: PropTypes.func,
};

export default AudioPlayer;
