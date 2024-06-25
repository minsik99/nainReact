import React from "react";
import PropTypes from "prop-types";

const RadiusButton = ({
  padding,
  color,
  text,
  onClick,
  fontSize,
  border,
  fontColor,
  boxShadow,
  borderRadius,
}) => {
  const buttonStyles = {
    padding: padding || "12px 24px",
    backgroundColor: color,
    border: "none",
    boxShadow: boxShadow,
    borderRadius: borderRadius || "10px",
    color: fontColor || "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: fontSize || "14px",
  };

  return (
    <button style={buttonStyles} onClick={onClick}>
      {text}
    </button>
  );
};

RadiusButton.propTypes = {
  padding: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string.isRequired,
  boxShadow: PropTypes.string,
  onClick: PropTypes.func,
  fontSize: PropTypes.string,
  fontColor: PropTypes.string,
  borderRadius: PropTypes.string,
};

export default RadiusButton;
