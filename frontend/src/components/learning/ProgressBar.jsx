import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({
  current,
  total,
  showLabel = true,
  showPercentage = true,
  color = "blue",
  size = "medium",
  className = "",
  label = "Progress",
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const colorClasses = {
    blue: "bg-primary",
    green: "bg-success",
    yellow: "bg-warning",
    red: "bg-danger",
    purple: "bg-purple",
    indigo: "bg-info",
  };

  const sizeStyles = {
    small: { height: "8px" },
    medium: { height: "12px" },
    large: { height: "16px" },
  };

  return (
    <div className={`w-100 ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          {showLabel && (
            <span className="small fw-medium text-dark">{label}</span>
          )}
          {showPercentage && (
            <span className="small text-muted">
              {percentage}% ({current}/{total})
            </span>
          )}
        </div>
      )}

      <div className="progress" style={sizeStyles[size]}>
        <div
          className={`progress-bar ${colorClasses[color]}`}
          role="progressbar"
          style={{ width: `${percentage}%`, transition: "width 0.5s ease-out" }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* Optional milestone markers */}
      {total > 1 && size !== "small" && (
        <div className="d-flex justify-content-between mt-1">
          {Array.from({ length: Math.min(total, 10) }, (_, i) => {
            const milestone = Math.ceil(
              ((i + 1) / Math.min(total, 10)) * total
            );
            const isReached = current >= milestone;
            return (
              <div
                key={i}
                className={`rounded-pill ${
                  isReached ? colorClasses[color] : "bg-secondary bg-opacity-25"
                }`}
                style={{ width: "4px", height: "8px" }}
                title={`Milestone ${milestone}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showLabel: PropTypes.bool,
  showPercentage: PropTypes.bool,
  color: PropTypes.oneOf([
    "blue",
    "green",
    "yellow",
    "red",
    "purple",
    "indigo",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  label: PropTypes.string,
};

export default ProgressBar;
