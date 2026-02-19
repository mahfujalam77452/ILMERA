import React from "react";

const Card = ({ children, className = "", onClick = null }) => {
  return (
    <div
      className={`card ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
