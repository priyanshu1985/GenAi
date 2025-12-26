import React from "react";
import PropTypes from "prop-types";

const Loader = ({
  size = "medium",
  color = "blue",
  message = "",
  className = "",
}) => {
  const sizeClasses = {
    small: "spinner-border-sm",
    medium: "",
    large: "",
    xlarge: "",
  };

  const sizeStyles = {
    small: { width: "1rem", height: "1rem" },
    medium: { width: "2rem", height: "2rem" },
    large: { width: "3rem", height: "3rem" },
    xlarge: { width: "4rem", height: "4rem" },
  };

  const colorClasses = {
    blue: "text-primary",
    gray: "text-secondary",
    white: "text-light",
    green: "text-success",
    red: "text-danger",
  };

  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-2 ${className}`}
    >
      <div
        className={`spinner-border ${sizeClasses[size]} ${colorClasses[color]}`}
        style={sizeStyles[size]}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && (
        <p className={`small ${colorClasses[color]} mb-0`}>{message}</p>
      )}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large", "xlarge"]),
  color: PropTypes.oneOf(["blue", "gray", "white", "green", "red"]),
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Loader;
