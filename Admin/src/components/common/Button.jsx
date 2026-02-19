import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {loading && <span className="animate-spin">⟳</span>}
    </button>
  );
};

export default Button;
