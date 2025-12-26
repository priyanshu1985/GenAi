import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";

const LessonCard = ({
  lesson,
  onStart,
  onContinue,
  className = "",
  isCompleted = false,
  progress = 0,
}) => {
  const {
    id,
    title,
    description,
    duration,
    difficulty,
    topics = [],
    thumbnail,
  } = lesson;

  const difficultyClasses = {
    easy: "bg-success bg-opacity-10 text-success",
    medium: "bg-warning bg-opacity-10 text-warning",
    hard: "bg-danger bg-opacity-10 text-danger",
  };

  const handleAction = () => {
    if (progress > 0) {
      onContinue?.(lesson);
    } else {
      onStart?.(lesson);
    }
  };

  return (
    <div className={`card shadow-sm ${className}`}>
      {/* Thumbnail */}
      {thumbnail && (
        <div className="bg-secondary" style={{ height: "192px", overflow: "hidden" }}>
          <img
            src={thumbnail}
            alt={title}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="card-body">
        {/* Header */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <h5 className="card-title fw-semibold text-dark mb-0">{title}</h5>
          {isCompleted && (
            <div className="flex-shrink-0 ms-2">
              <svg
                style={{ width: "24px", height: "24px" }}
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
          )}
        </div>

        {/* Description */}
        <p className="card-text text-muted small mb-3">{description}</p>

        {/* Meta information */}
        <div className="d-flex align-items-center gap-3 mb-3 small text-muted">
          {duration && (
            <div className="d-flex align-items-center">
              <svg
                style={{ width: "16px", height: "16px" }}
                className="me-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {duration}
            </div>
          )}

          {difficulty && (
            <span
              className={`badge rounded-pill ${
                difficultyClasses[difficulty] || difficultyClasses.medium
              }`}
            >
              {difficulty}
            </span>
          )}
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="badge bg-primary bg-opacity-10 text-primary"
                >
                  {topic}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="badge bg-light text-muted">
                  +{topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {progress > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small text-muted">Progress</span>
              <span className="small fw-medium text-dark">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <Button
          onClick={handleAction}
          variant="primary"
          size="medium"
          className="w-100"
        >
          {progress > 0 ? "Continue Learning" : "Start Lesson"}
        </Button>
      </div>
    </div>
  );
};

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.string,
    difficulty: PropTypes.oneOf(["easy", "medium", "hard"]),
    topics: PropTypes.arrayOf(PropTypes.string),
    thumbnail: PropTypes.string,
  }).isRequired,
  onStart: PropTypes.func,
  onContinue: PropTypes.func,
  className: PropTypes.string,
  isCompleted: PropTypes.bool,
  progress: PropTypes.number,
};

export default LessonCard;
