import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline-primary",
    danger: "btn-danger",
  };

  const sizeClasses = {
    small: "btn-sm",
    medium: "",
    large: "btn-lg",
  };

  const classes = [
    "btn",
    "d-inline-flex",
    "align-items-center",
    "justify-content-center",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
